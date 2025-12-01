import { prisma } from "@shipos/database";
import { z } from "zod";
import { adminProcedure } from "../../../orpc/procedures";

export const listUsers = adminProcedure
	.input(
		z.object({
			limit: z.number().min(1).max(100).default(10),
			offset: z.number().min(0).default(0),
			query: z.string().optional(),
		}),
	)
	.route({
		method: "GET",
		path: "/admin/users",
		tags: ["Admin"],
		summary: "List users",
		description: "List all users with pagination and search",
	})
	.handler(async ({ input }) => {
		const where = input.query
			? {
					OR: [
						{ name: { contains: input.query, mode: "insensitive" as const } },
						{ email: { contains: input.query, mode: "insensitive" as const } },
					],
				}
			: {};

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
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
					banned: true,
					banReason: true,
					banExpires: true,
				},
			}),
			prisma.user.count({ where }),
		]);

		return {
			users,
			total,
		};
	});
