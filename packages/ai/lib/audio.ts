import { experimental_transcribe } from "ai";
import { audioModel } from "../index";

export interface TranscribeAudioOptions {
	audioFile: File | Blob;
	language?: string;
	prompt?: string;
	responseFormat?: "json" | "text" | "srt" | "verbose_json" | "vtt";
	temperature?: number;
}

/**
 * Transcribe audio using the configured audio model
 */
export async function transcribeAudio(
	options: TranscribeAudioOptions,
): Promise<{
	text: string;
	language?: string;
	duration?: number;
	segments?: Array<{
		id: number;
		seek: number;
		start: number;
		end: number;
		text: string;
		tokens: number[];
		temperature: number;
		avgLogprob: number;
		compressionRatio: number;
		noSpeechProb: number;
	}>;
}> {
	const {
		audioFile,
		language,
		prompt,
		responseFormat = "json",
		temperature = 0,
	} = options;

	// Convert File/Blob to DataContent format expected by the AI SDK
	const audioBuffer = await audioFile.arrayBuffer();
	const audioData = Buffer.from(audioBuffer);

	const result = await experimental_transcribe({
		model: audioModel,
		audio: {
			type: "audio",
			data: audioData,
			mimeType: audioFile.type || "audio/wav",
		},
		providerOptions: {
			openai: {
				language,
				prompt,
				response_format: responseFormat,
				temperature,
			},
		},
	});

	return {
		text: result.text,
		segments: result.segments,
	};
}
