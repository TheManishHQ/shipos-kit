import { sendEmail } from "@shipos/mail";
import { publicProcedure } from "../../../orpc/procedures";
import { newsletterSubscribeSchema } from "../types";

export const subscribeToNewsletter = publicProcedure
	.input(newsletterSubscribeSchema)
	.handler(async ({ input }) => {
		// Send confirmation email
		await sendEmail({
			to: input.email,
			templateId: "newsletterSignup",
			context: {
				email: input.email,
			},
			locale: "en",
		});

		return { success: true };
	});
