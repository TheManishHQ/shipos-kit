import { prisma } from "@shipos/database";
import { z } from "zod";
import { adminProcedure } from "../../../orpc/procedures";

export const unbanUser = adminProcedure
	.input(
		z.object({
			userId: z.string(),
		}),
	)
	.route({
		method: "POST",
		path: "/admin/users/{userId}/unban",
		tags: ["Admin"],
		summary: "Unban user",
		description: "Remove ban from a user",
	})
	.handler(async ({ input }) => {
		const user = await prisma.user.update({
			where: { id: input.userId },
			data: {
				banned: false,
				banReason: null,
				banExpires: null,
			},
		});

		return { user };
	});
