import { generateText, streamText, type CoreMessage } from "ai";
import { textModel } from "../index";
import { systemPrompt } from "./prompts";

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
    createdAt?: Date;
}

export interface GenerateResponseOptions {
    messages: ChatMessage[];
    maxTokens?: number;
    temperature?: number;
}

/**
 * Generate a chat response using OpenAI
 */
export async function generateChatResponse(
    options: GenerateResponseOptions,
): Promise<string> {
    const { messages, maxTokens = 1000, temperature = 0.7 } = options;

    // Convert messages to CoreMessage format
    const coreMessages: CoreMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
    }));

    // Add system prompt if not present
    if (!coreMessages.some((msg) => msg.role === "system")) {
        coreMessages.unshift({
            role: "system",
            content: systemPrompt,
        });
    }

    const { text } = await generateText({
        model: textModel,
        messages: coreMessages,
        maxTokens,
        temperature,
    });

    return text;
}

/**
 * Stream a chat response using OpenAI
 */
export async function streamChatResponse(options: GenerateResponseOptions) {
    const { messages, maxTokens = 1000, temperature = 0.7 } = options;

    // Convert messages to CoreMessage format
    const coreMessages: CoreMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
    }));

    // Add system prompt if not present
    if (!coreMessages.some((msg) => msg.role === "system")) {
        coreMessages.unshift({
            role: "system",
            content: systemPrompt,
        });
    }

    return streamText({
        model: textModel,
        messages: coreMessages,
        maxTokens,
        temperature,
    });
}
