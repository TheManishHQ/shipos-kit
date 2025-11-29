import { ORPCError } from "@orpc/client";
import { getPurchaseById } from "@shipos/database";
import { logger } from "@shipos/logs";
import { createCustomerPortalLink as createCustomerPortalLinkFn } from "@shipos/payments";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const createCustomerPortalLink = protectedProcedure
    .route({
        method: "POST",
        path: "/payments/create-customer-portal-link",
        tags: ["Payments"],
        summary: "Create customer portal link",
        description:
            "Creates a customer portal link for managing subscriptions and billing",
    })
    .input(
        z.object({
            purchaseId: z.string(),
            redirectUrl: z.string().optional(),
        }),
    )
    .handler(
        async ({ input: { purchaseId, redirectUrl }, context: { user } }) => {
            const purchase = await getPurchaseById(purchaseId);

            if (!purchase) {
                throw new ORPCError("NOT_FOUND");
            }

            if (purchase.userId !== user.id) {
                throw new ORPCError("FORBIDDEN");
            }

            try {
                const customerPortalLink = await createCustomerPortalLinkFn({
                    subscriptionId: purchase.subscriptionId ?? undefined,
                    customerId: purchase.customerId,
                    redirectUrl,
                });

                if (!customerPortalLink) {
                    throw new ORPCError("INTERNAL_SERVER_ERROR");
                }

                return { customerPortalLink };
            } catch (e) {
                logger.error("Failed to create customer portal link", e);
                throw new ORPCError("INTERNAL_SERVER_ERROR");
            }
        },
    );
