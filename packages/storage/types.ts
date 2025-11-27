export interface StorageProvider {
    getSignedUploadUrl(
        path: string,
        options?: { bucket?: string; expiresIn?: number }
    ): Promise<string>;
    getSignedDownloadUrl(
        path: string,
        options?: { bucket?: string; expiresIn?: number }
    ): Promise<string>;
}

export interface S3Config {
    endpoint?: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}
