import { prisma } from "@shipos/database";
import { z } from "zod";
import { adminProcedure } from "../../../orpc/procedures";

export const banUser = adminProcedure
	.input(
		z.object({
			userId: z.string(),
			reason: z.string().min(1),
			expiresAt: z.date().optional(),
		}),
	)
	.route({
		method: "POST",
		path: "/admin/users/{userId}/ban",
		tags: ["Admin"],
		summary: "Ban user",
		description: "Ban a user with a reason and optional expiration",
	})
	.handler(async ({ input }) => {
		const user = await prisma.user.update({
			where: { id: input.userId },
			data: {
				banned: true,
				banReason: input.reason,
				banExpires: input.expiresAt,
			},
		});

		return { user };
	});
