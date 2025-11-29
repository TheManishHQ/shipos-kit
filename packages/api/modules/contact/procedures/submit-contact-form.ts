import { config } from "@shipos/config";
import { sendEmail } from "@shipos/mail";
import { publicProcedure } from "../../../orpc/procedures";
import { contactFormSchema } from "../types";

export const submitContactForm = publicProcedure
	.input(contactFormSchema)
	.handler(async ({ input }) => {
		// Send email to the configured contact email address
		await sendEmail({
			to: config.contactForm.to,
			templateId: "contact",
			context: {
				name: input.name,
				email: input.email,
				message: input.message,
			},
			locale: "en",
		});

		return { success: true };
	});
