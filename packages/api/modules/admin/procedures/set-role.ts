import { prisma } from "@shipos/database";
import { z } from "zod";
import { adminProcedure } from "../../../orpc/procedures";

export const setRole = adminProcedure
	.input(
		z.object({
			userId: z.string(),
			role: z.enum(["user", "admin"]),
		}),
	)
	.route({
		method: "POST",
		path: "/admin/users/{userId}/role",
		tags: ["Admin"],
		summary: "Set user role",
		description: "Set a user's role to admin or user",
	})
	.handler(async ({ input }) => {
		const user = await prisma.user.update({
			where: { id: input.userId },
			data: {
				role: input.role,
			},
		});

		return { user };
	});
