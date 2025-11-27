# User Account Management

The user account management system provides comprehensive functionality for users to manage their profiles, security settings, and connected accounts.

## Overview

The user account management features include:

-   Profile management (name, avatar)
-   Password management (change, set for OAuth users)
-   Connected OAuth accounts
-   Avatar upload with image cropping
-   Email change functionality (via better-auth)

## Architecture

```
apps/web/modules/saas/settings/components/
├── ChangeNameForm.tsx           # Update user display name
├── ChangePasswordForm.tsx       # Change password for existing users
├── SetPasswordForm.tsx          # Set password for OAuth-only users
├── UserAvatarUpload.tsx         # Avatar upload with cropping
├── ConnectedAccountsBlock.tsx   # View and link OAuth accounts
└── CropImageDialog.tsx          # Image cropping dialog

packages/api/modules/users/
├── procedures/
│   └── create-avatar-upload-url.ts  # Generate S3 upload URL
└── router.ts                        # Users API router
```

## Components

### ChangeNameForm

Allows users to update their display name.

**Features:**

-   Form validation with Zod (minimum 3 characters)
-   Real-time validation feedback
-   Disabled submit until changes are made
-   Success/error notifications
-   Session reload after update

**Usage:**

```typescript
import { ChangeNameForm } from "@saas/settings/components/ChangeNameForm";

function SettingsPage() {
	return <ChangeNameForm />;
}
```

**Validation:**

```typescript
const formSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
});
```

**API Integration:**

```typescript
await authClient.updateUser({ name });
```

### ChangePasswordForm

Allows users with existing passwords to change their password.

**Features:**

-   Current password verification
-   New password validation (minimum 8 characters)
-   Revokes other sessions on password change
-   Form validation with Zod
-   Success/error notifications

**Usage:**

```typescript
import { ChangePasswordForm } from "@saas/settings/components/ChangePasswordForm";

function SecuritySettings() {
	return <ChangePasswordForm />;
}
```

**Validation:**

```typescript
const formSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
```

**API Integration:**

```typescript
await authClient.changePassword({
	currentPassword,
	newPassword,
	revokeOtherSessions: true,
});
```

**Security:**

-   Requires current password verification
-   Automatically revokes all other sessions
-   Minimum 8 character password requirement

### SetPasswordForm

Allows OAuth-only users to set a password for their account.

**Features:**

-   Sends password reset email
-   Uses existing password reset flow
-   Success/error notifications
-   Loading state during submission

**Usage:**

```typescript
import { SetPasswordForm } from "@saas/settings/components/SetPasswordForm";

function SecuritySettings() {
	return <SetPasswordForm />;
}
```

**Flow:**

1. User clicks "Set Password" button
2. System sends password reset email to user's email
3. User clicks link in email
4. User sets new password via reset password page

**API Integration:**

```typescript
await authClient.forgetPassword({
	email: user.email,
	redirectTo: `${window.location.origin}/auth/reset-password`,
});
```

### UserAvatarUpload

Provides avatar upload functionality with image cropping.

**Features:**

-   Drag-and-drop file upload
-   Click to select file
-   Image cropping dialog
-   Accepts PNG and JPEG formats
-   Uploads to S3-compatible storage
-   Updates user profile with avatar path
-   Loading state during upload
-   Success/error notifications

**Usage:**

```typescript
import { UserAvatarUpload } from "@saas/settings/components/UserAvatarUpload";

function ProfileSettings() {
	return (
		<UserAvatarUpload
			onSuccess={() => toast.success("Avatar updated")}
			onError={() => toast.error("Upload failed")}
		/>
	);
}
```

**Upload Flow:**

1. User drops or selects image file
2. Crop dialog opens with selected image
3. User crops image to desired size
4. Cropped image is converted to PNG blob
5. System requests signed upload URL from API
6. Image is uploaded directly to S3
7. User profile is updated with avatar path
8. Session is reloaded to reflect new avatar

**File Handling:**

```typescript
const { getRootProps, getInputProps } = useDropzone({
	onDrop: (acceptedFiles) => {
		setImage(acceptedFiles[0]);
		setCropDialogOpen(true);
	},
	accept: {
		"image/png": [".png"],
		"image/jpeg": [".jpg", ".jpeg"],
	},
	multiple: false,
});
```

**Upload Implementation:**

```typescript
// Generate unique filename
const path = `${user.id}-${uuid()}.png`;

// Get signed upload URL
const { signedUploadUrl } = await getSignedUploadUrlMutation.mutateAsync({
	path,
	bucket: config.storage.bucketNames.avatars,
});

// Upload to S3
await fetch(signedUploadUrl, {
	method: "PUT",
	body: croppedImageData,
	headers: {
		"Content-Type": "image/png",
	},
});

// Update user profile
await authClient.updateUser({ image: path });
```

**Dependencies:**

-   `react-dropzone` - File upload handling
-   `uuid` - Unique filename generation
-   `CropImageDialog` - Image cropping component

### ConnectedAccountsBlock

Displays and manages OAuth provider connections.

**Features:**

-   Shows all configured OAuth providers
-   Displays connection status for each provider
-   Link new OAuth accounts
-   Visual indicators for connected accounts
-   Loading states during data fetch

**Usage:**

```typescript
import { ConnectedAccountsBlock } from "@saas/settings/components/ConnectedAccountsBlock";

function SecuritySettings() {
	return <ConnectedAccountsBlock />;
}
```

**Supported Providers:**

-   Google
-   GitHub
-   Additional providers configured in better-auth

**Provider Linking:**

```typescript
const linkProvider = (provider: OAuthProvider) => {
	const callbackURL = window.location.href;
	if (!isProviderLinked(provider)) {
		authClient.linkSocial({
			provider,
			callbackURL,
		});
	}
};
```

**Account Linking Flow:**

1. User clicks "Connect" button for provider
2. System redirects to OAuth provider
3. User authorizes connection
4. Provider redirects back to callback URL
5. Account is linked to user profile
6. UI updates to show connected status

**Visual States:**

-   **Not Connected**: Shows "Connect" button
-   **Connected**: Shows checkmark icon
-   **Loading**: Shows skeleton loader

## API Endpoints

### Create Avatar Upload URL

Generates a signed URL for uploading avatar images to S3.

**Endpoint:** `POST /api/users/avatar-upload-url`

**Authentication:** Required (protected procedure)

**Request Body:**

```typescript
{
	path: string; // File path in bucket (e.g., "user-id-uuid.png")
	bucket: string; // Bucket name (e.g., "avatars")
}
```

**Response:**

```typescript
{
	signedUploadUrl: string; // Pre-signed S3 upload URL
}
```

**Implementation:**

```typescript
export const createAvatarUploadUrl = protectedProcedure
	.input(
		z.object({
			path: z.string(),
			bucket: z.string(),
		})
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
```

**Usage Example:**

```typescript
import { orpc } from "@shared/lib/orpc-query-utils";

const { signedUploadUrl } = await orpc.users.avatarUploadUrl.mutate({
	path: "user-123-abc.png",
	bucket: "avatars",
});

// Upload file to S3
await fetch(signedUploadUrl, {
	method: "PUT",
	body: imageBlob,
	headers: {
		"Content-Type": "image/png",
	},
});
```

**Security:**

-   Requires authentication (protected procedure)
-   URL expires after 60 seconds
-   Only allows PUT requests
-   Restricted to specified bucket

## Storage Integration

### S3 Configuration

Avatar uploads use S3-compatible storage (AWS S3, Cloudflare R2, MinIO, etc.).

**Environment Variables:**

```bash
# S3 Configuration
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# Bucket Configuration
NEXT_PUBLIC_AVATARS_BUCKET_NAME=avatars
```

**S3 Client Setup:**

```typescript
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
	region: process.env.S3_REGION || "auto",
	endpoint: process.env.S3_ENDPOINT,
	forcePathStyle: true,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	},
});
```

### Signed Upload URLs

Pre-signed URLs allow direct client-to-S3 uploads without proxying through the server.

**Benefits:**

-   Reduced server load
-   Faster uploads
-   Better scalability
-   Lower bandwidth costs

**Implementation:**

```typescript
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getSignedUploadUrl(
	path: string,
	{ bucket }: { bucket: string }
) {
	const s3Client = getS3Client();

	return await getSignedUrl(
		s3Client,
		new PutObjectCommand({
			Bucket: bucket,
			Key: path,
			ContentType: "image/jpeg",
		}),
		{
			expiresIn: 60, // 60 seconds
		}
	);
}
```

**Security Considerations:**

-   URLs expire after 60 seconds
-   Only allow PUT operations
-   Restrict to specific bucket
-   Validate file types on client
-   Generate unique filenames to prevent overwrites

### Avatar File Naming

Avatar files use a consistent naming pattern:

```typescript
const path = `${user.id}-${uuid()}.png`;
// Example: "clx123abc-a1b2c3d4-e5f6-7890-abcd-ef1234567890.png"
```

**Pattern:**

-   User ID prefix for organization
-   UUID for uniqueness
-   `.png` extension (all avatars converted to PNG)

**Benefits:**

-   Prevents filename collisions
-   Easy to identify user's avatars
-   Supports multiple avatars per user
-   Consistent file format

## Form Validation

All forms use Zod for schema validation and React Hook Form for form management.

### Name Validation

```typescript
const formSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
});
```

**Rules:**

-   Minimum 3 characters
-   Required field

### Password Validation

```typescript
const formSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
```

**Rules:**

-   Current password required
-   New password minimum 8 characters
-   Both fields required

### File Upload Validation

```typescript
accept: {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
}
```

**Rules:**

-   Only PNG and JPEG formats
-   Single file upload
-   Client-side validation before upload

## Internationalization

All user-facing text is internationalized using `next-intl`.

### Translation Keys

**Change Name:**

```json
{
	"settings.account.changeName.title": "Display Name",
	"settings.account.changeName.notifications.success": "Name updated successfully",
	"settings.account.changeName.notifications.error": "Failed to update name"
}
```

**Change Password:**

```json
{
	"settings.account.security.changePassword.title": "Change Password",
	"settings.account.security.changePassword.currentPassword": "Current Password",
	"settings.account.security.changePassword.newPassword": "New Password",
	"settings.account.security.changePassword.notifications.success": "Password changed successfully",
	"settings.account.security.changePassword.notifications.error": "Failed to change password"
}
```

**Set Password:**

```json
{
	"settings.account.security.setPassword.title": "Set Password",
	"settings.account.security.setPassword.description": "Set a password to enable password login",
	"settings.account.security.setPassword.submit": "Send Reset Email",
	"settings.account.security.setPassword.notifications.success": "Password reset email sent",
	"settings.account.security.setPassword.notifications.error": "Failed to send email"
}
```

**Connected Accounts:**

```json
{
	"settings.account.security.connectedAccounts.title": "Connected Accounts",
	"settings.account.security.connectedAccounts.connect": "Connect"
}
```

**Common:**

```json
{
	"settings.save": "Save Changes"
}
```

## Session Management

### Session Reload

After profile updates, the session is reloaded to reflect changes:

```typescript
const { reloadSession } = useSession();

// After successful update
await authClient.updateUser({ name: "New Name" });
await reloadSession();
```

**When to Reload:**

-   After name change
-   After avatar upload
-   After email change
-   After any profile update

### Session Revocation

Password changes automatically revoke other sessions:

```typescript
await authClient.changePassword({
	currentPassword,
	newPassword,
	revokeOtherSessions: true, // Revoke all other sessions
});
```

**Security Benefit:**

-   Logs out user from other devices
-   Prevents unauthorized access after password change
-   Forces re-authentication on all devices

## Error Handling

### Client-Side Errors

All components handle errors gracefully with toast notifications:

```typescript
try {
	await authClient.updateUser({ name });
	toast.success(t("settings.account.changeName.notifications.success"));
} catch (error) {
	toast.error(t("settings.account.changeName.notifications.error"));
}
```

### API Errors

API endpoints return structured error responses:

```typescript
const { error } = await authClient.updateUser({ name });

if (error) {
	toast.error(t("settings.account.changeName.notifications.error"));
	return;
}
```

### Upload Errors

Avatar upload handles multiple error scenarios:

```typescript
try {
	// Get signed URL
	const { signedUploadUrl } = await getSignedUploadUrlMutation.mutateAsync({
		path,
		bucket,
	});

	// Upload to S3
	const response = await fetch(signedUploadUrl, {
		method: "PUT",
		body: croppedImageData,
	});

	if (!response.ok) {
		throw new Error("Failed to upload image");
	}

	// Update profile
	const { error } = await authClient.updateUser({ image: path });

	if (error) {
		throw error;
	}

	onSuccess();
} catch {
	onError();
} finally {
	setUploading(false);
}
```

## Best Practices

### Form State Management

Use React Hook Form for efficient form state:

```typescript
const form = useForm<FormSchema>({
	resolver: zodResolver(formSchema),
	defaultValues: {
		name: user?.name ?? "",
	},
});

// Disable submit until form is valid and dirty
<Button
	type="submit"
	disabled={!(form.formState.isValid && form.formState.dirtyFields.name)}
>
	Save
</Button>;
```

### Loading States

Always show loading states during async operations:

```typescript
const [uploading, setUploading] = useState(false);

{
	uploading && (
		<div className="absolute inset-0 flex items-center justify-center bg-card/90">
			<Spinner className="size-6" />
		</div>
	);
}
```

### User Feedback

Provide clear feedback for all actions:

```typescript
// Success
toast.success(t("settings.account.changeName.notifications.success"));

// Error
toast.error(t("settings.account.changeName.notifications.error"));

// Loading
<Button loading={form.formState.isSubmitting}>Save</Button>;
```

### Security

Follow security best practices:

1. **Validate on client and server**
2. **Use signed URLs for uploads**
3. **Revoke sessions on password change**
4. **Require current password for changes**
5. **Use HTTPS for all requests**
6. **Sanitize file uploads**

## Testing

### Manual Testing

Test each component:

1. **Change Name:**

    - Update name with valid input
    - Try invalid input (< 3 characters)
    - Verify session reload
    - Check success notification

2. **Change Password:**

    - Change password with correct current password
    - Try incorrect current password
    - Verify other sessions are revoked
    - Check password requirements

3. **Set Password:**

    - Request password reset email
    - Verify email is sent
    - Complete password reset flow

4. **Avatar Upload:**

    - Upload PNG image
    - Upload JPEG image
    - Test drag-and-drop
    - Test file selection
    - Verify cropping works
    - Check upload progress
    - Verify avatar updates

5. **Connected Accounts:**
    - Link OAuth account
    - Verify connection status
    - Test with multiple providers

### Automated Testing

Example test cases:

```typescript
describe("ChangeNameForm", () => {
	it("should update user name", async () => {
		render(<ChangeNameForm />);

		const input = screen.getByRole("textbox");
		await userEvent.type(input, "New Name");

		const button = screen.getByRole("button", { name: /save/i });
		await userEvent.click(button);

		expect(authClient.updateUser).toHaveBeenCalledWith({
			name: "New Name",
		});
	});

	it("should show validation error for short name", async () => {
		render(<ChangeNameForm />);

		const input = screen.getByRole("textbox");
		await userEvent.type(input, "AB");

		expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
	});
});
```

## Troubleshooting

### Common Issues

**Issue: "Avatar upload fails"**

-   Solution: Verify S3 credentials are correct
-   Check bucket permissions
-   Ensure CORS is configured on bucket

**Issue: "Password change doesn't work"**

-   Solution: Verify current password is correct
-   Check password meets minimum requirements
-   Ensure user has a password set

**Issue: "OAuth linking fails"**

-   Solution: Verify OAuth credentials are configured
-   Check callback URL is correct
-   Ensure provider is enabled in better-auth

**Issue: "Session not updating after profile change"**

-   Solution: Call `reloadSession()` after updates
-   Verify better-auth is configured correctly

## Next Steps

-   [Authentication](./authentication.md) - Learn about the auth system
-   [Storage](./storage.md) - Set up S3 storage
-   [API](./api.md) - Build protected API routes
-   [UI Components](./ui-components.md) - Use UI components
