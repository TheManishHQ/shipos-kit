import type { RouterClient } from "@orpc/server";
import { adminRouter } from "../modules/admin/router";
import { aiRouter } from "../modules/ai/router";
import { contactRouter } from "../modules/contact/router";
import { newsletterRouter } from "../modules/newsletter/router";
import { paymentsRouter } from "../modules/payments/router";
import { usersRouter } from "../modules/users/router";
import { publicProcedure } from "./procedures";

export const router = publicProcedure
	// Prefix for openapi
	.prefix("/api")
	.router({
		admin: adminRouter,
		ai: aiRouter,
		contact: contactRouter,
		newsletter: newsletterRouter,
		payments: paymentsRouter,
		users: usersRouter,
	});

export type ApiRouterClient = RouterClient<typeof router>;
