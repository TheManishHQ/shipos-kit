import { logger } from "@shipos/logs";
import Stripe from "stripe";
import {
    createPurchase,
    deletePurchaseBySubscriptionId,
    getPurchaseBySubscriptionId,
    updatePurchase,
    updateUser,
} from "@shipos/database";
import type {
    CancelSubscription,
    CreateCheckoutLink,
    CreateCustomerPortalLink,
    SetSubscriptionSeats,
    WebhookHandler,
} from "../../types";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
    if (stripeClient) {
        return stripeClient;
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

    if (!stripeSecretKey) {
        throw new Error("Missing env variable STRIPE_SECRET_KEY");
    }

    stripeClient = new Stripe(stripeSecretKey);

    return stripeClient;
}

export const createCheckoutLink: CreateCheckoutLink = async (options) => {
    const stripeClient = getStripeClient();
    const {
        type,
        productId,
        redirectUrl,
        customerId,
        userId,
        trialPeriodDays,
        seats,
        email,
    } = options;

    const metadata = {
        user_id: userId || null,
    };

    const response = await stripeClient.checkout.sessions.create({
        mode: type === "subscription" ? "subscription" : "payment",
        success_url: redirectUrl ?? "",
        line_items: [
            {
                quantity: seats ?? 1,
                price: productId,
            },
        ],
        ...(customerId ? { customer: customerId } : { customer_email: email }),
        ...(type === "one-time"
            ? {
                payment_intent_data: {
                    metadata,
                },
                customer_creation: "always",
            }
            : {
                subscription_data: {
                    metadata,
                    trial_period_days: trialPeriodDays,
                },
            }),
        metadata,
    });

    return response.url;
};

export const createCustomerPortalLink: CreateCustomerPortalLink = async ({
    customerId,
    redirectUrl,
}) => {
    const stripeClient = getStripeClient();

    const response = await stripeClient.billingPortal.sessions.create({
        customer: customerId,
        return_url: redirectUrl ?? "",
    });

    return response.url;
};

export const setSubscriptionSeats: SetSubscriptionSeats = async ({
    id,
    seats,
}) => {
    const stripeClient = getStripeClient();

    const subscription = await stripeClient.subscriptions.retrieve(id);

    if (!subscription) {
        throw new Error("Subscription not found.");
    }

    await stripeClient.subscriptions.update(id, {
        items: [
            {
                id: subscription.items.data[0].id,
                quantity: seats,
            },
        ],
    });
};

export const cancelSubscription: CancelSubscription = async (id) => {
    const stripeClient = getStripeClient();

    await stripeClient.subscriptions.cancel(id);
};

async function setCustomerIdToUser(customerId: string, userId?: string) {
    if (userId) {
        await updateUser({
            id: userId,
            paymentsCustomerId: customerId,
        });
    }
}

export const webhookHandler: WebhookHandler = async (req) => {
    const stripeClient = getStripeClient();

    if (!req.body) {
        return new Response("Invalid request.", {
            status: 400,
        });
    }

    let event: Stripe.Event | undefined;

    try {
        event = await stripeClient.webhooks.constructEventAsync(
            await req.text(),
            req.headers.get("stripe-signature") as string,
            process.env.STRIPE_WEBHOOK_SECRET as string,
        );
    } catch (e) {
        logger.error("Stripe webhook error", e);

        return new Response("Invalid request.", {
            status: 400,
        });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const { mode, metadata, customer, id } = event.data.object;

                if (mode === "subscription") {
                    break;
                }

                const checkoutSession =
                    await stripeClient.checkout.sessions.retrieve(id, {
                        expand: ["line_items"],
                    });

                const productId = checkoutSession.line_items?.data[0].price?.id;

                if (!productId) {
                    return new Response("Missing product ID.", {
                        status: 400,
                    });
                }

                await createPurchase({
                    userId: metadata?.user_id || null,
                    customerId: customer as string,
                    type: "ONE_TIME",
                    productId,
                });

                await setCustomerIdToUser(customer as string, metadata?.user_id);

                break;
            }
            case "customer.subscription.created": {
                const { metadata, customer, items, id } = event.data.object;

                const productId = items?.data[0].price?.id;

                if (!productId) {
                    return new Response("Missing product ID.", {
                        status: 400,
                    });
                }

                await createPurchase({
                    subscriptionId: id,
                    userId: metadata?.user_id || null,
                    customerId: customer as string,
                    type: "SUBSCRIPTION",
                    productId,
                    status: event.data.object.status,
                });

                await setCustomerIdToUser(customer as string, metadata?.user_id);

                break;
            }
            case "customer.subscription.updated": {
                const subscriptionId = event.data.object.id;

                const existingPurchase =
                    await getPurchaseBySubscriptionId(subscriptionId);

                if (existingPurchase) {
                    await updatePurchase({
                        id: existingPurchase.id,
                        status: event.data.object.status,
                        productId: event.data.object.items?.data[0].price?.id,
                    });
                }

                break;
            }
            case "customer.subscription.deleted": {
                await deletePurchaseBySubscriptionId(event.data.object.id);

                break;
            }

            default:
                return new Response("Unhandled event type.", {
                    status: 200,
                });
        }

        return new Response(null, { status: 204 });
    } catch (error) {
        logger.error("Stripe webhook processing error", error);
        return new Response(
            `Webhook error: ${error instanceof Error ? error.message : ""}`,
            {
                status: 400,
            },
        );
    }
};
