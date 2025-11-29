import { prisma } from "../client";

export async function getAiChatsByUserId({
    limit,
    offset,
    userId,
}: {
    limit: number;
    offset: number;
    userId: string;
}) {
    return await prisma.aiChat.findMany({
        where: {
            userId,
        },
        take: limit,
        skip: offset,
        orderBy: {
            updatedAt: "desc",
        },
    });
}

export async function getAiChatById(id: string) {
    return await prisma.aiChat.findUnique({
        where: {
            id,
        },
    });
}

export async function createAiChat({
    userId,
    title,
}: {
    userId: string;
    title?: string;
}) {
    return await prisma.aiChat.create({
        data: {
            userId,
            title,
        },
    });
}

export async function updateAiChat({
    id,
    title,
    messages,
}: {
    id: string;
    title?: string;
    messages?: Array<object>;
}) {
    return await prisma.aiChat.update({
        where: {
            id,
        },
        data: {
            title,
            messages,
        },
    });
}

export async function deleteAiChat(id: string) {
    return await prisma.aiChat.delete({
        where: {
            id,
        },
    });
}
