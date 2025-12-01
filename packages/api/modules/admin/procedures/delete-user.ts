import { prisma } from "@shipos/database";
import { z } from "zod";
import { adminProcedure } from "../../../orpc/procedures";

export const deleteUser = adminProcedure
	.input(
		z.object({
			userId: z.string(),
		}),
	)
	.route({
		method: "DELETE",
		path: "/admin/users/{userId}",
		tags: ["Admin"],
		summary: "Delete user",
		description: "Permanently delete a user and all associated data",
	})
	.handler(async ({ input, context }) => {
		// Prevent self-deletion
		if (input.userId === context.user.id) {
			throw new Error("Cannot delete your own account");
		}

		await prisma.user.delete({
			where: { id: input.userId },
		});

		return { success: true };
	});
