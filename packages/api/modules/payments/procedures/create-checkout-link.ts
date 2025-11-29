import { ORPCError } from "@orpc/client";
import { type Config, config } from "@shipos/config";
import { logger } from "@shipos/logs";
import { createCheckoutLink as createCheckoutLinkFn } from "@shipos/payments";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const createCheckoutLink = protectedProcedure
    .route({
        method: "POST",
        path: "/payments/create-checkout-link",
        tags: ["Payments"],
        summary: "Create checkout link",
        description:
            "Creates a checkout link for a one-time or subscription product",
    })
    .input(
        z.object({
            type: z.enum(["one-time", "subscription"]),
            productId: z.string(),
            redirectUrl: z.string().optional(),
        }),
    )
    .handler(
        async ({
            input: { productId, redirectUrl, type },
            context: { user },
        }) => {
            const plans = config.payments.plans as Config["payments"]["plans"];

            const plan = Object.entries(plans).find(([_planId, plan]) =>
                plan.prices?.find((price) => price.productId === productId),
            );
            const price = plan?.[1].prices?.find(
                (price) => price.productId === productId,
            );
            const trialPeriodDays =
                price && "trialPeriodDays" in price
                    ? price.trialPeriodDays
                    : undefined;

            try {
                const checkoutLink = await createCheckoutLinkFn({
                    type,
                    productId,
                    email: user.email,
                    name: user.name ?? "",
                    redirectUrl,
                    userId: user.id,
                    trialPeriodDays,
                    customerId: user.paymentsCustomerId ?? undefined,
                });

                if (!checkoutLink) {
                    throw new ORPCError("INTERNAL_SERVER_ERROR");
                }

                return { checkoutLink };
            } catch (e) {
                logger.error("Failed to create checkout link", e);
                throw new ORPCError("INTERNAL_SERVER_ERROR");
            }
        },
    );
