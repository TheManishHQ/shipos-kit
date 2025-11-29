import { prisma } from "../client";

export const queries = {
    user: {
        findByEmail: (email: string) =>
            prisma.user.findUnique({ where: { email } }),
        findById: (id: string) => prisma.user.findUnique({ where: { id } }),
        updateLocale: (id: string, locale: string) =>
            prisma.user.update({ where: { id }, data: { locale } }),
    },
    purchase: {
        findActiveSubscription: (userId: string) =>
            prisma.purchase.findFirst({
                where: { userId, type: "SUBSCRIPTION", status: "active" },
            }),
    },
};

export * from "./ai-chats";
export * from "./organizations";
export * from "./purchases";
export * from "./users";
