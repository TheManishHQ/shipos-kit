import { S3Client } from "@aws-sdk/client-s3";
import type { S3Config } from "../../types";

let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
    if (s3Client) return s3Client;

    const config: S3Config = {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || "auto",
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    };

    if (!config.accessKeyId || !config.secretAccessKey) {
        throw new Error(
            "S3 credentials not configured. Set S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY environment variables."
        );
    }

    s3Client = new S3Client({
        region: config.region,
        endpoint: config.endpoint,
        forcePathStyle: true,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
        },
    });

    return s3Client;
}
