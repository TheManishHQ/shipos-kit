import type { z } from "zod";
import { prisma } from "../client";
import type { UserSchema } from "../zod";

export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
    });
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export async function updateUser(
    user: Partial<Omit<z.infer<typeof UserSchema>, "createdAt" | "updatedAt">> & {
        id: string;
    },
) {
    return prisma.user.update({
        where: { id: user.id },
        data: user,
    });
}
