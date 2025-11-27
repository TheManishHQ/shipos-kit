import { auth } from "@shipos/auth";
import { getSignedUploadUrl } from "@shipos/storage";
import { NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
    path: z.string(),
    bucket: z.string(),
});

export async function POST(request: Request) {
    try {
        // Check authentication
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse and validate input
        const body = await request.json();
        const { path, bucket } = inputSchema.parse(body);

        // Generate signed upload URL
        const signedUploadUrl = await getSignedUploadUrl(path, { bucket });

        return NextResponse.json({ signedUploadUrl });
    } catch (error) {
        console.error("Failed to generate upload URL:", error);
        return NextResponse.json(
            { error: "Failed to generate upload URL" },
            { status: 500 }
        );
    }
}
