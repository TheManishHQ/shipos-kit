import { getSignedDownloadUrl } from "@shipos/storage";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const path = searchParams.get("path");
        const bucket = searchParams.get("bucket");

        if (!path) {
            return NextResponse.json(
                { error: "Path parameter required" },
                { status: 400 }
            );
        }

        // Generate signed download URL
        const signedDownloadUrl = await getSignedDownloadUrl(path, {
            bucket: bucket || undefined,
            expiresIn: 3600, // 1 hour
        });

        // Redirect to the signed URL
        return NextResponse.redirect(signedDownloadUrl);
    } catch (error) {
        console.error("Failed to proxy image:", error);
        return NextResponse.json(
            { error: "Failed to proxy image" },
            { status: 500 }
        );
    }
}
