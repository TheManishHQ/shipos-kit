import type { StorageProvider } from "../types";
import { S3StorageProvider } from "./s3";

let storageProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
    if (storageProvider) return storageProvider;

    // Currently only S3 is supported
    // In the future, you could add other providers (Cloudflare R2, etc.)
    storageProvider = new S3StorageProvider();

    return storageProvider;
}

export { S3StorageProvider } from "./s3";
