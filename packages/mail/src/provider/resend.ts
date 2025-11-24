import { config } from "@shipos/config";
import { logger } from "@shipos/logs";
import type { SendEmailHandler } from "../../types";

const { from } = config.mails;

export const send: SendEmailHandler = async ({ to, subject, html }) => {
	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
		},
		body: JSON.stringify({
			from,
			to,
			subject,
			html,
		}),
	});

	if (!response.ok) {
		logger.error("Failed to send email via Resend", await response.json());
		throw new Error("Could not send email");
	}
};
