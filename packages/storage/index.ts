export { getStorageProvider, S3StorageProvider } from "./provider";
export type { StorageProvider, S3Config } from "./types";

// Convenience functions
import { getStorageProvider } from "./provider";

export async function getSignedUploadUrl(
    path: string,
    options?: { bucket?: string; expiresIn?: number }
): Promise<string> {
    const provider = getStorageProvider();
    return provider.getSignedUploadUrl(path, options);
}

export async function getSignedDownloadUrl(
    path: string,
    options?: { bucket?: string; expiresIn?: number }
): Promise<string> {
    const provider = getStorageProvider();
    return provider.getSignedDownloadUrl(path, options);
}
