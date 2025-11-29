import {
    createAiChat,
    deleteAiChat,
    getAiChatById,
    getAiChatsByUserId,
    updateAiChat,
} from "@shipos/database";
import { z } from "zod";
import { protectedProcedure } from "../../orpc/procedures";
import { generateChatResponse, type ChatMessage } from "@shipos/ai";
import { generateChatTitle } from "@shipos/ai";

// Create a new chat
const createChat = protectedProcedure
    .input(
        z.object({
            title: z.string().optional(),
        }),
    )
    .route({
        method: "POST",
        path: "/ai/chats",
        tags: ["AI"],
        summary: "Create chat",
        description: "Create a new AI chat",
    })
    .handler(async ({ input, context }) => {
        const { user } = context;

        const chat = await createAiChat({
            userId: user.id,
            title: input.title,
        });

        return chat;
    });

// List user's chats
const listChats = protectedProcedure
    .input(
        z.object({
            limit: z.number().min(1).max(100).default(20),
            offset: z.number().min(0).default(0),
        }),
    )
    .route({
        method: "GET",
        path: "/ai/chats",
        tags: ["AI"],
        summary: "List chats",
        description: "List user's AI chats",
    })
    .handler(async ({ input, context }) => {
        const { user } = context;

        const chats = await getAiChatsByUserId({
            userId: user.id,
            limit: input.limit,
            offset: input.offset,
        });

        return chats;
    });

// Get a specific chat
const getChat = protectedProcedure
    .input(
        z.object({
            id: z.string(),
        }),
    )
    .route({
        method: "GET",
        path: "/ai/chats/{id}",
        tags: ["AI"],
        summary: "Get chat",
        description: "Get a specific AI chat",
    })
    .handler(async ({ input, context }) => {
        const { user } = context;

        const chat = await getAiChatById(input.id);

        if (!chat) {
            throw new Error("Chat not found");
        }

        // Verify ownership
        if (chat.userId !== user.id) {
            throw new Error("Unauthorized");
        }

        return chat;
    });

// Add a message to a chat and get AI response
const addMessage = protectedProcedure
    .input(
        z.object({
            chatId: z.string(),
            message: z.string().min(1).max(4000),
        }),
    )
    .route({
        method: "POST",
        path: "/ai/chats/{chatId}/messages",
        tags: ["AI"],
        summary: "Add message",
        description: "Add a message to a chat and get AI response",
    })
    .handler(async ({ input, context }) => {
        const { user } = context;
        const { chatId, message } = input;

        // Get the chat
        const chat = await getAiChatById(chatId);

        if (!chat) {
            throw new Error("Chat not found");
        }

        // Verify ownership
        if (chat.userId !== user.id) {
            throw new Error("Unauthorized");
        }

        // Parse existing messages
        const messages = (chat.messages as unknown as ChatMessage[]) || [];

        // Add user message
        const userMessage: ChatMessage = {
            role: "user",
            content: message,
            createdAt: new Date(),
        };
        messages.push(userMessage);

        // Generate AI response
        const aiResponse = await generateChatResponse({
            messages,
        });

        // Add AI message
        const aiMessage: ChatMessage = {
            role: "assistant",
            content: aiResponse,
            createdAt: new Date(),
        };
        messages.push(aiMessage);

        // Generate title if this is the first message
        let title = chat.title;
        if (!title && messages.length === 2) {
            title = generateChatTitle(message);
        }

        // Update chat
        const updatedChat = await updateAiChat({
            id: chatId,
            messages,
            title: title || undefined,
        });

        return updatedChat;
    });

// Update a chat
const updateChat = protectedProcedure
    .input(
        z.object({
            id: z.string(),
            title: z.string().optional(),
        }),
    )
    .route({
        method: "PUT",
        path: "/ai/chats/{id}",
        tags: ["AI"],
        summary: "Update chat",
        description: "Update a chat's title",
    })
    .handler(async ({ input, context }) => {
        const { user } = context;

        // Get the chat
        const chat = await getAiChatById(input.id);

        if (!chat) {
            throw new Error("Chat not found");
        }

        // Verify ownership
        if (chat.userId !== user.id) {
            throw new Error("Unauthorized");
        }

        // Update chat
        const updatedChat = await updateAiChat({
            id: input.id,
            title: input.title,
        });

        return updatedChat;
    });

// Delete a chat
const deleteChat = protectedProcedure
    .input(
        z.object({
            id: z.string(),
        }),
    )
    .route({
        method: "DELETE",
        path: "/ai/chats/{id}",
        tags: ["AI"],
        summary: "Delete chat",
        description: "Delete a chat",
    })
    .handler(async ({ input, context }) => {
        const { user } = context;

        // Get the chat
        const chat = await getAiChatById(input.id);

        if (!chat) {
            throw new Error("Chat not found");
        }

        // Verify ownership
        if (chat.userId !== user.id) {
            throw new Error("Unauthorized");
        }

        // Delete chat
        await deleteAiChat(input.id);

        return { success: true };
    });

// Image generation (Task 26)
const generateImage = protectedProcedure
	.input(
		z.object({
			prompt: z.string().min(1).max(1000),
			size: z
				.enum([
					"256x256",
					"512x512",
					"1024x1024",
					"1792x1024",
					"1024x1792",
				])
				.default("1024x1024"),
			n: z.number().min(1).max(4).default(1),
			quality: z.enum(["standard", "hd"]).default("standard"),
			style: z.enum(["vivid", "natural"]).default("vivid"),
		}),
	)
	.route({
		method: "POST",
		path: "/ai/image",
		tags: ["AI"],
		summary: "Generate image",
		description: "Generate AI image using DALL-E 3",
	})
	.handler(async ({ input }) => {
		const { generateAIImage } = await import("@shipos/ai");

		const result = await generateAIImage({
			prompt: input.prompt,
			size: input.size,
			n: input.n,
			quality: input.quality,
			style: input.style,
		});

		return result;
	});

// Audio transcription (Task 26)
const transcribeAudio = protectedProcedure
	.input(
		z.object({
			audioFile: z.instanceof(File),
			language: z.string().optional(),
			prompt: z.string().optional(),
			responseFormat: z
				.enum(["json", "text", "srt", "verbose_json", "vtt"])
				.default("json"),
			temperature: z.number().min(0).max(1).default(0),
		}),
	)
	.route({
		method: "POST",
		path: "/ai/transcribe",
		tags: ["AI"],
		summary: "Transcribe audio",
		description: "Transcribe audio using Whisper-1",
	})
	.handler(async ({ input }) => {
		const { transcribeAudio: transcribe } = await import("@shipos/ai");

		const result = await transcribe({
			audioFile: input.audioFile,
			language: input.language,
			prompt: input.prompt,
			responseFormat: input.responseFormat,
			temperature: input.temperature,
		});

		return result;
	});

export const aiRouter = {
	createChat,
	listChats,
	getChat,
	addMessage,
	updateChat,
	deleteChat,
	generateImage,
	transcribeAudio,
};
