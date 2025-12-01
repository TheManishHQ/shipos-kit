import type { z } from "zod";
import { prisma } from "../client";
import type { PurchaseSchema } from "../zod/index";

export async function getPurchaseById(id: string) {
    return prisma.purchase.findUnique({
        where: { id },
    });
}

export async function getPurchasesByUserId(userId: string) {
    return prisma.purchase.findMany({
        where: {
            userId,
        },
    });
}

export async function getPurchaseBySubscriptionId(subscriptionId: string) {
    return prisma.purchase.findFirst({
        where: {
            subscriptionId,
        },
    });
}

export async function createPurchase(
    purchase: Omit<
        z.infer<typeof PurchaseSchema>,
        "id" | "createdAt" | "updatedAt"
    >,
) {
    const created = await prisma.purchase.create({
        data: purchase,
    });

    return getPurchaseById(created.id);
}

export async function updatePurchase(
    purchase: Partial<
        Omit<z.infer<typeof PurchaseSchema>, "createdAt" | "updatedAt">
    > & { id: string },
) {
    const updated = await prisma.purchase.update({
        where: {
            id: purchase.id,
        },
        data: purchase,
    });

    return getPurchaseById(updated.id);
}

export async function deletePurchaseBySubscriptionId(subscriptionId: string) {
    await prisma.purchase.delete({
        where: {
            subscriptionId,
        },
    });
}
