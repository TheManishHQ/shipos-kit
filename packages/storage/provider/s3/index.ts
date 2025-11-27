import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StorageProvider } from "../../types";
import { getS3Client } from "./client";

export class S3StorageProvider implements StorageProvider {
    async getSignedUploadUrl(
        path: string,
        options?: { bucket?: string; expiresIn?: number }
    ): Promise<string> {
        const s3Client = getS3Client();
        const bucket = options?.bucket || process.env.NEXT_PUBLIC_AVATARS_BUCKET_NAME;

        if (!bucket) {
            throw new Error("Bucket name not provided");
        }

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: path,
            ContentType: "image/png",
        });

        return await getSignedUrl(s3Client, command, {
            expiresIn: options?.expiresIn || 60, // 60 seconds default
        });
    }

    async getSignedDownloadUrl(
        path: string,
        options?: { bucket?: string; expiresIn?: number }
    ): Promise<string> {
        const s3Client = getS3Client();
        const bucket = options?.bucket || process.env.NEXT_PUBLIC_AVATARS_BUCKET_NAME;

        if (!bucket) {
            throw new Error("Bucket name not provided");
        }

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: path,
        });

        return await getSignedUrl(s3Client, command, {
            expiresIn: options?.expiresIn || 3600, // 1 hour default
        });
    }
}
