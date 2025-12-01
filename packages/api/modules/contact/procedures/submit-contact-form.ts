import { ORPCError } from "@orpc/server";
import { config } from "@shipos/config";
import { logger } from "@shipos/logs";
import { sendEmail } from "@shipos/mail";
import { publicProcedure } from "../../../orpc/procedures";
import { contactFormSchema } from "../types";

export const submitContactForm = publicProcedure
	.route({
		method: "POST",
		path: "/contact",
		tags: ["Contact"],
		summary: "Submit contact form",
	})
	.input(contactFormSchema)
	.handler(async ({ input: { email, name, message } }) => {
		try {
			await sendEmail({
				to: config.contactForm.to,
				subject: config.contactForm.subject,
				text: `Name: ${name}\n\nEmail: ${email}\n\nMessage: ${message}`,
			});
		} catch (error) {
			logger.error(error);
			throw new ORPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to send email",
			});
		}
	});
