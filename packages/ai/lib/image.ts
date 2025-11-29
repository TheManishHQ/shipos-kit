import { experimental_generateImage as generateImage } from "ai";
import { imageModel } from "../index";

export interface GenerateImageOptions {
	prompt: string;
	size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792";
	n?: number;
	quality?: "standard" | "hd";
	style?: "vivid" | "natural";
}

/**
 * Generate an image using DALL-E 3
 */
export async function generateAIImage(
	options: GenerateImageOptions,
): Promise<{
	images: Array<{ url: string; base64?: string }>;
}> {
	const {
		prompt,
		size = "1024x1024",
		n = 1,
		quality = "standard",
		style = "vivid",
	} = options;

	const result = await generateImage({
		model: imageModel,
		prompt,
		n,
		size,
		providerOptions: {
			openai: {
				quality,
				style,
			},
		},
	});

	return {
		images: result.images.map((image) => ({
			url: image.url || "",
			base64: image.base64,
		})),
	};
}
