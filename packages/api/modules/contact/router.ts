import { publicProcedure } from "../../orpc/procedures";
import { submitContactForm } from "./procedures/submit-contact-form";

export const contactRouter = publicProcedure.router({
	submitContactForm,
});
