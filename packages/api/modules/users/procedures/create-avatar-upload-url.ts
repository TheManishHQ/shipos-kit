import { getSignedUploadUrl } from "@shipos/storage";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const createAvatarUploadUrl = protectedProcedure
    .input(
        z.object({
            path: z.string(),
            bucket: z.string(),
        }),
    )
    .route({
        method: "POST",
        path: "/users/avatar-upload-url",
        tags: ["Users"],
        summary: "Create avatar upload URL",
        description:
            "Create a signed upload URL to upload an avatar image to the storage bucket",
    })
    .handler(async ({ input }) => {
        const signedUploadUrl = await getSignedUploadUrl(input.path, {
            bucket: input.bucket,
        });

        return { signedUploadUrl };
    });
