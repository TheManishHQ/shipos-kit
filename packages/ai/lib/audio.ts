import { experimental_generateTranscription as generateTranscription } from "ai";
import { audioModel } from "../index";

export interface TranscribeAudioOptions {
	audioFile: File | Blob;
	language?: string;
	prompt?: string;
	responseFormat?: "json" | "text" | "srt" | "verbose_json" | "vtt";
	temperature?: number;
}

/**
 * Transcribe audio using Whisper-1
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

	const result = await generateTranscription({
		model: audioModel,
		file: audioFile,
		language,
		prompt,
		response_format: responseFormat,
		temperature,
	});

	return {
		text: result.text,
		language: result.language,
		duration: result.duration,
		segments: result.segments,
	};
}
