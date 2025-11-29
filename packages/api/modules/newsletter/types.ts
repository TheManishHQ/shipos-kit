import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
	email: z.string().email(),
});

export type NewsletterSubscribeValues = z.infer<
	typeof newsletterSubscribeSchema
>;
