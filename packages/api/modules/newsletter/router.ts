import { publicProcedure } from "../../orpc/procedures";
import { subscribeToNewsletter } from "./procedures/subscribe-to-newsletter";

export const newsletterRouter = publicProcedure.router({
	subscribeToNewsletter,
});
