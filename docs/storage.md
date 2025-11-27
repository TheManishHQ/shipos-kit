# File Storage

The storage package (`@shipos/storage`) provides S3-compatible file storage for avatars and other user-uploaded content.

## Overview

The storage package provides:

-   S3-compatible storage integration (AWS S3, Cloudflare R2, MinIO, etc.)
-   Presigned upload URLs for direct client-to-S3 uploads
-   Presigned download URLs for secure file access
-   Image proxy endpoint for serving images
-   Support for multiple buckets
-   Configurable URL expiration times
-   Type-safe storage provider interface

## Architecture

```
packages/storage/
├── provider/
│   ├── s3/
│   │   ├── client.ts       # S3 client singleton
│   │   └── index.ts        # S3 storage provider
│   └── index.ts            # Provider factory
├── types.ts                # TypeScript interfaces
├── index.ts                # Package exports
├── package.json
└── tsconfig.json
```

## Storage Provider Interface

### StorageProvider

The base interface for all storage providers:

```typescript
interface StorageProvider {
	getSignedUploadUrl(
		path: string,
		options?: { bucket?: string; expiresIn?: number }
	): Promise<string>;
	getSignedDownloadUrl(
		path: string,
		options?: { bucket?: string; expiresIn?: number }
	): Promise<string>;
}
```

## S3 Storage Provider

### Configuration

The S3 provider uses environment variables for configuration:

```bash
# S3 Configuration
S3_ENDPOINT=https://s3.amazonaws.com  # Optional, for S3-compatible services
S3_REGION=us-east-1                   # AWS region or 'auto' for Cloudflare R2
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# Bucket Configuration
NEXT_PUBLIC_AVATARS_BUCKET_NAME=avatars
```

### S3 Client

The S3 client is a singleton that initializes on first use:

```typescript
import { getS3Client } from "@shipos/storage/provider/s3/client";

const s3Client = getS3Client();
```

**Features:**

-   Singleton pattern for efficient resource usage
-   Lazy initialization
-   Validates credentials on initialization
-   Supports custom endpoints for S3-compatible services

**Implementation:**

```typescript
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
```

### S3StorageProvider Class

Implements the `StorageProvider` interface for S3:

```typescript
import { S3StorageProvider } from "@shipos/storage";

const provider = new S3StorageProvider();
```

## Usage

### Getting Signed Upload URLs

Generate a presigned URL for uploading files directly to S3:

```typescript
import { getSignedUploadUrl } from "@shipos/storage";

const uploadUrl = await getSignedUploadUrl("user-123-avatar.png", {
	bucket: "avatars",
	expiresIn: 60, // 60 seconds
});

// Upload file to S3
await fetch(uploadUrl, {
	method: "PUT",
	body: imageBlob,
	headers: {
		"Content-Type": "image/png",
	},
});
```

**Parameters:**

-   `path` (required) - File path in the bucket
-   `options.bucket` (optional) - Bucket name (defaults to `NEXT_PUBLIC_AVATARS_BUCKET_NAME`)
-   `options.expiresIn` (optional) - URL expiration in seconds (default: 60)

**Returns:** Presigned upload URL as a string

### Getting Signed Download URLs

Generate a presigned URL for downloading files from S3:

```typescript
import { getSignedDownloadUrl } from "@shipos/storage";

const downloadUrl = await getSignedDownloadUrl("user-123-avatar.png", {
	bucket: "avatars",
	expiresIn: 3600, // 1 hour
});

// Use the URL in an image tag
<img src={downloadUrl} alt="Avatar" />;
```

**Parameters:**

-   `path` (required) - File path in the bucket
-   `options.bucket` (optional) - Bucket name (defaults to `NEXT_PUBLIC_AVATARS_BUCKET_NAME`)
-   `options.expiresIn` (optional) - URL expiration in seconds (default: 3600)

**Returns:** Presigned download URL as a string

### Using the Provider Directly

```typescript
import { getStorageProvider } from "@shipos/storage";

const provider = getStorageProvider();

// Upload URL
const uploadUrl = await provider.getSignedUploadUrl("file.png");

// Download URL
const downloadUrl = await provider.getSignedDownloadUrl("file.png");
```

## API Endpoints

### Upload URL Endpoint

**Endpoint:** `POST /api/storage/upload-url`

**Authentication:** Required

**Request Body:**

```typescript
{
	path: string; // File path in bucket
	bucket: string; // Bucket name
}
```

**Response:**

```typescript
{
	signedUploadUrl: string; // Presigned upload URL
}
```

**Example:**

```typescript
const response = await fetch("/api/storage/upload-url", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		path: "user-123-avatar.png",
		bucket: "avatars",
	}),
});

const { signedUploadUrl } = await response.json();
```

**Security:**

-   Requires authentication
-   Validates input with Zod
-   Returns 401 for unauthenticated requests
-   Returns 500 for server errors

### Image Proxy Endpoint

**Endpoint:** `GET /api/image-proxy?path={path}&bucket={bucket}`

**Authentication:** Not required (public endpoint)

**Query Parameters:**

-   `path` (required) - File path in bucket
-   `bucket` (optional) - Bucket name (defaults to avatars bucket)

**Response:** Redirects to presigned download URL

**Example:**

```typescript
// In an image tag
<img src="/api/image-proxy?path=user-123-avatar.png" alt="Avatar" />

// With custom bucket
<img src="/api/image-proxy?path=file.png&bucket=documents" alt="Document" />
```

**Features:**

-   Generates presigned download URLs on-the-fly
-   1-hour expiration by default
-   Redirects to S3 URL
-   Handles errors gracefully

## Avatar Upload Flow

Complete flow for uploading user avatars:

### 1. Request Upload URL

```typescript
const path = `${user.id}-${uuid()}.png`;
const response = await fetch("/api/storage/upload-url", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		path,
		bucket: config.storage.bucketNames.avatars,
	}),
});

const { signedUploadUrl } = await response.json();
```

### 2. Upload to S3

```typescript
const uploadResponse = await fetch(signedUploadUrl, {
	method: "PUT",
	body: croppedImageBlob,
	headers: {
		"Content-Type": "image/png",
	},
});

if (!uploadResponse.ok) {
	throw new Error("Failed to upload image");
}
```

### 3. Update User Profile

```typescript
await authClient.updateUser({
	image: path,
});
```

### 4. Display Avatar

```typescript
// Using image proxy
<img src={`/api/image-proxy?path=${user.image}`} alt={user.name} />;

// Or generate download URL
const avatarUrl = await getSignedDownloadUrl(user.image);
<img src={avatarUrl} alt={user.name} />;
```

## S3-Compatible Services

The storage provider works with any S3-compatible service:

### AWS S3

```bash
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=...
```

### Cloudflare R2

```bash
S3_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

### MinIO

```bash
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
```

### DigitalOcean Spaces

```bash
S3_ENDPOINT=https://[region].digitaloceanspaces.com
S3_REGION=nyc3
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

### Backblaze B2

```bash
S3_ENDPOINT=https://s3.[region].backblazeb2.com
S3_REGION=us-west-004
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

## Bucket Configuration

### Creating Buckets

Create buckets in your S3 service:

```bash
# AWS CLI
aws s3 mb s3://avatars

# MinIO CLI
mc mb local/avatars
```

### CORS Configuration

Configure CORS to allow browser uploads:

```json
{
	"CORSRules": [
		{
			"AllowedOrigins": [
				"http://localhost:3000",
				"https://yourdomain.com"
			],
			"AllowedMethods": ["GET", "PUT", "POST"],
			"AllowedHeaders": ["*"],
			"ExposeHeaders": ["ETag"],
			"MaxAgeSeconds": 3000
		}
	]
}
```

**Apply CORS (AWS):**

```bash
aws s3api put-bucket-cors --bucket avatars --cors-configuration file://cors.json
```

### Bucket Policy

Set bucket policy for public read access (optional):

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicRead",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::avatars/*"
		}
	]
}
```

**Note:** With presigned URLs, public read access is not required.

## Security

### Presigned URLs

**Benefits:**

-   Direct client-to-S3 uploads (no server proxy)
-   Reduced server bandwidth
-   Time-limited access
-   Specific operation permissions (PUT or GET only)

**Upload URL Security:**

-   60-second expiration by default
-   Only allows PUT operations
-   Restricted to specific file path
-   Requires authentication to generate

**Download URL Security:**

-   1-hour expiration by default
-   Only allows GET operations
-   Restricted to specific file path
-   Can be generated without authentication (via image proxy)

### File Validation

Validate files on the client before upload:

```typescript
const { getRootProps, getInputProps } = useDropzone({
	accept: {
		"image/png": [".png"],
		"image/jpeg": [".jpg", ".jpeg"],
	},
	maxSize: 5 * 1024 * 1024, // 5MB
	multiple: false,
});
```

### File Naming

Use unique, unpredictable file names:

```typescript
import { v4 as uuid } from "uuid";

const path = `${user.id}-${uuid()}.png`;
// Example: "clx123abc-a1b2c3d4-e5f6-7890-abcd-ef1234567890.png"
```

**Benefits:**

-   Prevents filename collisions
-   Prevents guessing file URLs
-   Organizes files by user
-   Supports multiple files per user

## Error Handling

### Client-Side Errors

```typescript
try {
	const { signedUploadUrl } = await fetch("/api/storage/upload-url", {
		method: "POST",
		body: JSON.stringify({ path, bucket }),
	}).then((r) => r.json());

	const uploadResponse = await fetch(signedUploadUrl, {
		method: "PUT",
		body: imageBlob,
	});

	if (!uploadResponse.ok) {
		throw new Error("Upload failed");
	}
} catch (error) {
	console.error("Failed to upload file:", error);
	toast.error("Failed to upload file");
}
```

### Server-Side Errors

```typescript
try {
	const signedUploadUrl = await getSignedUploadUrl(path, { bucket });
	return NextResponse.json({ signedUploadUrl });
} catch (error) {
	console.error("Failed to generate upload URL:", error);
	return NextResponse.json(
		{ error: "Failed to generate upload URL" },
		{ status: 500 }
	);
}
```

## Best Practices

### Use Presigned URLs

Always use presigned URLs for uploads and downloads:

```typescript
// Good - Direct client-to-S3 upload
const uploadUrl = await getSignedUploadUrl(path);
await fetch(uploadUrl, { method: "PUT", body: file });

// Avoid - Proxying through server
await fetch("/api/upload", { method: "POST", body: formData });
```

### Set Appropriate Expiration Times

```typescript
// Upload URLs - Short expiration
await getSignedUploadUrl(path, { expiresIn: 60 }); // 60 seconds

// Download URLs - Longer expiration
await getSignedDownloadUrl(path, { expiresIn: 3600 }); // 1 hour
```

### Validate File Types

```typescript
// Client-side validation
accept: {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
}

// Server-side validation (if needed)
const contentType = file.type;
if (!["image/png", "image/jpeg"].includes(contentType)) {
	throw new Error("Invalid file type");
}
```

### Use Unique File Names

```typescript
import { v4 as uuid } from "uuid";

// Good - Unique filename
const path = `${user.id}-${uuid()}.png`;

// Avoid - Predictable filename
const path = `${user.id}-avatar.png`;
```

### Handle Errors Gracefully

```typescript
try {
	await uploadFile();
	toast.success("File uploaded successfully");
} catch (error) {
	console.error("Upload failed:", error);
	toast.error("Failed to upload file. Please try again.");
}
```

## Troubleshooting

### Common Issues

**Issue: "S3 credentials not configured"**

-   Solution: Set `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` environment variables

**Issue: "Failed to upload image"**

-   Solution: Check CORS configuration on your S3 bucket
-   Verify presigned URL hasn't expired
-   Check file size limits

**Issue: "Access Denied"**

-   Solution: Verify IAM permissions for S3 operations
-   Check bucket policy allows required operations

**Issue: "SignatureDoesNotMatch"**

-   Solution: Verify `S3_SECRET_ACCESS_KEY` is correct
-   Check system clock is synchronized

**Issue: "NoSuchBucket"**

-   Solution: Create the bucket in your S3 service
-   Verify `NEXT_PUBLIC_AVATARS_BUCKET_NAME` is correct

### Testing S3 Connection

```typescript
import { getS3Client } from "@shipos/storage/provider/s3/client";
import { ListBucketsCommand } from "@aws-sdk/client-s3";

async function testS3Connection() {
	try {
		const client = getS3Client();
		const response = await client.send(new ListBucketsCommand({}));
		console.log("S3 connection successful");
		console.log("Buckets:", response.Buckets);
	} catch (error) {
		console.error("S3 connection failed:", error);
	}
}
```

## Performance Optimization

### CDN Integration

Use a CDN in front of S3 for better performance:

```bash
# CloudFront (AWS)
CLOUDFRONT_DOMAIN=d123456.cloudfront.net

# Cloudflare (R2)
# Automatic CDN with R2
```

### Image Optimization

Optimize images before upload:

```typescript
// Resize and compress with canvas
const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;
const ctx = canvas.getContext("2d");
ctx?.drawImage(image, 0, 0, 400, 400);

canvas.toBlob(
	async (blob) => {
		if (blob) await uploadImage(blob);
	},
	"image/png",
	0.9
);
```

### Caching

Cache download URLs to reduce API calls:

```typescript
const urlCache = new Map<string, { url: string; expiresAt: number }>();

async function getCachedDownloadUrl(path: string): Promise<string> {
	const cached = urlCache.get(path);
	if (cached && cached.expiresAt > Date.now()) {
		return cached.url;
	}

	const url = await getSignedDownloadUrl(path);
	urlCache.set(path, {
		url,
		expiresAt: Date.now() + 3000 * 1000, // 50 minutes
	});

	return url;
}
```

## Next Steps

-   [User Management](./user-management.md) - Implement avatar upload
-   [API](./api.md) - Build storage API endpoints
-   [Configuration](./configuration.md) - Configure storage settings
-   [Security](./security.md) - Secure file uploads

## Resources

-   [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
-   [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
-   [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
-   [Presigned URLs Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
    mpatible provider:

### AWS S3

```bash
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Cloudflare R2

```bash
S3_ENDPOINT=https://account-id.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=your-r2-access-key-id
S3_SECRET_ACCESS_KEY=your-r2-secret-access-key
```

### MinIO

```bash
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
```

### DigitalOcean Spaces

```bash
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
S3_REGION=nyc3
S3_ACCESS_KEY_ID=your-spaces-key
S3_SECRET_ACCESS_KEY=your-spaces-secret
```

### Backblaze B2

```bash
S3_ENDPOINT=https://s3.us-west-002.backblazeb2.com
S3_REGION=us-west-002
S3_ACCESS_KEY_ID=your-b2-key-id
S3_SECRET_ACCESS_KEY=your-b2-application-key
```

## Bucket Configuration

### Creating Buckets

Buckets must be created manually through your provider's console or CLI.

**AWS S3:**

```bash
aws s3 mb s3://avatars --region us-east-1
```

**Cloudflare R2:**

```bash
wrangler r2 bucket create avatars
```

### Bucket Permissions

Configure bucket permissions for your use case:

**Public Read (for public assets):**

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicRead",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::avatars/*"
		}
	]
}
```

**Private (for user uploads):**

-   No public access
-   Use pre-signed URLs for all access
-   Recommended for sensitive data

### CORS Configuration

Enable CORS for direct browser uploads:

```json
[
	{
		"AllowedOrigins": ["https://yourdomain.com"],
		"AllowedMethods": ["GET", "PUT", "POST"],
		"AllowedHeaders": ["*"],
		"ExposeHeaders": ["ETag"],
		"MaxAgeSeconds": 3000
	}
]
```

## Security

### Pre-Signed URLs

Pre-signed URLs provide temporary, secure access to S3 objects:

**Benefits:**

-   No need to proxy files through your server
-   Reduced server bandwidth and load
-   Time-limited access (URLs expire)
-   Specific operation (upload or download)

**Security Considerations:**

-   URLs expire after specified time (60 seconds for uploads)
-   URLs are tied to specific bucket and path
-   Cannot be reused after expiration
-   Include signature that prevents tampering

### Access Control

**Best Practices:**

1. **Verify Authentication**: Always verify user authentication before generating URLs
2. **Validate Paths**: Sanitize and validate file paths to prevent directory traversal
3. **Limit Expiration**: Use short expiration times for upload URLs (60 seconds)
4. **Use Private Buckets**: Keep buckets private and use pre-signed URLs
5. **Validate File Types**: Check file types before generating upload URLs

**Example:**

```typescript
import { auth } from "@shipos/auth";
import { getSignedUploadUrl } from "@shipos/storage";

export async function createUploadUrl(path: string, bucket: string) {
	// Verify authentication
	const session = await auth.api.getSession();
	if (!session) {
		throw new Error("Unauthorized");
	}

	// Validate path (no directory traversal)
	if (path.includes("..") || path.startsWith("/")) {
		throw new Error("Invalid path");
	}

	// Validate bucket
	const allowedBuckets = ["avatars", "documents"];
	if (!allowedBuckets.includes(bucket)) {
		throw new Error("Invalid bucket");
	}

	// Generate URL
	return getSignedUploadUrl(path, { bucket });
}
```

## Error Handling

### Common Errors

**Missing Environment Variables:**

```typescript
try {
	const url = await getSignedUploadUrl(path, { bucket });
} catch (error) {
	if (error.message.includes("Missing env variable")) {
		// Environment not configured
		console.error("S3 configuration missing");
	}
}
```

**Upload Failures:**

```typescript
const uploadUrl = await getSignedUploadUrl(path, { bucket });

const response = await fetch(uploadUrl, {
	method: "PUT",
	body: fileBlob,
});

if (!response.ok) {
	if (response.status === 403) {
		throw new Error("Access denied - check S3 permissions");
	} else if (response.status === 404) {
		throw new Error("Bucket not found");
	} else {
		throw new Error(`Upload failed: ${response.statusText}`);
	}
}
```

### Logging

Use the logging package for error tracking:

```typescript
import { logger } from "@shipos/logs";
import { getSignedUploadUrl } from "@shipos/storage";

try {
	const url = await getSignedUploadUrl(path, { bucket });
	logger.info("Generated upload URL", { path, bucket });
	return url;
} catch (error) {
	logger.error("Failed to generate upload URL", error, { path, bucket });
	throw error;
}
```

## Testing

### Local Development

Use MinIO for local S3-compatible storage:

```bash
# Start MinIO with Docker
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

**Local Environment Variables:**

```bash
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
```

### Testing Upload Flow

```typescript
import { getSignedUploadUrl } from "@shipos/storage";

describe("Storage", () => {
	it("should generate upload URL", async () => {
		const url = await getSignedUploadUrl("test.png", {
			bucket: "test-bucket",
		});

		expect(url).toContain("test.png");
		expect(url).toContain("X-Amz-Signature");
	});

	it("should upload file successfully", async () => {
		const url = await getSignedUploadUrl("test.png", {
			bucket: "test-bucket",
		});

		const blob = new Blob(["test"], { type: "image/png" });

		const response = await fetch(url, {
			method: "PUT",
			body: blob,
		});

		expect(response.ok).toBe(true);
	});
});
```

## Performance

### Caching

The S3 client is cached after first initialization:

```typescript
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
	if (s3Client) return s3Client; // Return cached client

	// Initialize new client
	s3Client = new S3Client({
		/* ... */
	});
	return s3Client;
}
```

### Direct Uploads

Pre-signed URLs enable direct browser-to-S3 uploads:

**Benefits:**

-   No server bandwidth usage
-   Faster uploads (direct to S3)
-   Reduced server load
-   Better scalability

**Flow:**

1. Client requests upload URL from API
2. API generates pre-signed URL
3. Client uploads directly to S3
4. Client notifies API of completion

## Troubleshooting

### Common Issues

**Issue: "Missing env variable S3_ENDPOINT"**

Solution: Set all required S3 environment variables:

```bash
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
```

**Issue: "Access Denied" when uploading**

Solution: Check S3 IAM permissions:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": ["s3:PutObject", "s3:GetObject"],
			"Resource": "arn:aws:s3:::your-bucket/*"
		}
	]
}
```

**Issue: "Bucket not found"**

Solution: Create the bucket or verify the bucket name is correct.

**Issue: "CORS error" when uploading from browser**

Solution: Configure CORS on your S3 bucket (see CORS Configuration section).

**Issue: "URL expired"**

Solution: Upload URLs expire after 60 seconds. Generate a new URL if needed.

## Best Practices

### File Naming

Use unique, predictable file names:

```typescript
import { v4 as uuid } from "uuid";

// Good - Unique and organized
const path = `${userId}-${uuid()}.png`;
// Example: "user-123-a1b2c3d4-e5f6-7890-abcd-ef1234567890.png"

// Avoid - Collision risk
const path = `${userId}.png`;
```

### Content Types

Set appropriate content types:

```typescript
const contentTypes = {
	png: "image/png",
	jpg: "image/jpeg",
	pdf: "application/pdf",
	mp4: "video/mp4",
};

await fetch(uploadUrl, {
	method: "PUT",
	body: fileBlob,
	headers: {
		"Content-Type": contentTypes[fileExtension],
	},
});
```

### File Size Limits

Validate file sizes before upload:

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

if (file.size > MAX_FILE_SIZE) {
	throw new Error("File too large");
}
```

### Cleanup

Delete old files to manage storage costs:

```typescript
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

async function deleteFile(path: string, bucket: string) {
	const s3Client = getS3Client();

	await s3Client.send(
		new DeleteObjectCommand({
			Bucket: bucket,
			Key: path,
		})
	);
}
```

## Next Steps

-   [User Management](./user-management.md) - Implement avatar uploads
-   [API](./api.md) - Create upload URL endpoints
-   [Configuration](./configuration.md) - Configure storage buckets
-   [Security](./security.md) - Secure file uploads

## Resources

-   [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
-   [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
-   [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
-   [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
