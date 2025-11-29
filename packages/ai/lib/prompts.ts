/**
 * System prompt for AI chat assistant
 */
export const systemPrompt = `You are a helpful AI assistant. Provide clear, concise, and accurate responses to user questions.`;

/**
 * Generate a chat title from the first message
 *
 * @param {string} message - The first message in the chat
 * @return {string} A short title for the chat
 */
export function generateChatTitle(message: string): string {
    // Take first 50 characters and add ellipsis if longer
    const title = message.slice(0, 50);
    return message.length > 50 ? `${title}...` : title;
}
