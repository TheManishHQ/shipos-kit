import { prisma } from "@shipos/database";
import { z } from "zod";
import { adminProcedure } from "../../../orpc/procedures";

export const listUsers = adminProcedure
	.input(
		z.object({
			limit: z.number().min(1).max(100).default(10),
			offset: z.number().min(0).default(0),
		}),
	)
	.handler(async ({ input }) => {
		const [users, total] = await Promise.all([
			prisma.user.findMany({
				take: input.limit,
				skip: input.offset,
				orderBy: {
					createdAt: "desc",
				},
				select: {
					id: true,
					email: true,
					name: true,
					emailVerified: true,
					image: true,
					createdAt: true,
					role: true,
				},
			}),
			prisma.user.count(),
		]);

		return {
			users,
			total,
		};
	});
