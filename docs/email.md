# Email System

The email system in Shipos Kit provides a flexible way to send transactional emails with support for multiple providers and internationalization.

## Overview

The email system consists of:

-   **Email Templates**: React-based email templates using `@react-email/components`
-   **Email Providers**: Pluggable providers (Console, Resend)
-   **Internationalization**: Multi-language support for email content
-   **Type Safety**: Full TypeScript support

## Package Structure

```
packages/mail/
├── emails/                    # Email templates
│   ├── EmailVerification.tsx
│   ├── ForgotPassword.tsx
│   ├── MagicLink.tsx
│   ├── NewUser.tsx
│   ├── NewsletterSignup.tsx
│   └── index.ts
├── src/
│   ├── components/           # Reusable email components
│   │   ├── Logo.tsx
│   │   ├── PrimaryButton.tsx
│   │   └── Wrapper.tsx
│   ├── provider/             # Email providers
│   │   ├── console.ts
│   │   ├── resend.ts
│   │   └── index.ts
│   └── util/
│       ├── send.ts           # Main send function
│       ├── templates.ts      # Template utilities
│       └── translations.ts   # Translation helpers
├── types.ts
├── index.ts
└── package.json
```

## Email Providers

### Console Provider (Development)

The console provider logs emails to the console instead of sending them. This is useful for development and testing.

```typescript
// Automatically used when no EMAIL_PROVIDER is set
```

### Resend Provider (Production)

To use Resend in production:

1. Set environment variables:

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

2. The provider will automatically be used based on the `EMAIL_PROVIDER` environment variable.

## Sending Emails

### Using Templates

```typescript
import { sendEmail } from "@shipos/mail";

// Send email verification
await sendEmail({
	to: "user@example.com",
	locale: "en",
	templateId: "emailVerification",
	context: {
		url: "https://example.com/verify?token=...",
		name: "John Doe",
	},
});

// Send magic link
await sendEmail({
	to: "user@example.com",
	locale: "de",
	templateId: "magicLink",
	context: {
		url: "https://example.com/auth/magic-link?token=...",
	},
});

// Send password reset
await sendEmail({
	to: "user@example.com",
	locale: "en",
	templateId: "forgotPassword",
	context: {
		url: "https://example.com/reset-password?token=...",
		name: "John Doe",
	},
});
```

### Custom Emails

You can also send custom emails without using templates:

```typescript
await sendEmail({
	to: "user@example.com",
	subject: "Custom Email",
	text: "Plain text content",
	html: "<p>HTML content</p>",
});
```

## Available Templates

### 1. Email Verification

-   **Template ID**: `emailVerification`
-   **Context**: `{ url: string, name: string }`
-   **Use Case**: Verify email addresses for new users or email changes

### 2. Magic Link

-   **Template ID**: `magicLink`
-   **Context**: `{ url: string }`
-   **Use Case**: Passwordless authentication

### 3. Forgot Password

-   **Template ID**: `forgotPassword`
-   **Context**: `{ url: string, name: string }`
-   **Use Case**: Password reset requests

### 4. New User

-   **Template ID**: `newUser`
-   **Context**: `{ url: string, name: string }`
-   **Use Case**: Welcome email for new users

### 5. Newsletter Signup

-   **Template ID**: `newsletterSignup`
-   **Context**: `{}`
-   **Use Case**: Newsletter subscription confirmation

## Internationalization

All email templates support multiple languages. The locale is passed when sending the email:

```typescript
// English email
await sendEmail({
	to: "user@example.com",
	locale: "en",
	templateId: "emailVerification",
	context: { url: "...", name: "John" },
});

// German email
await sendEmail({
	to: "user@example.com",
	locale: "de",
	templateId: "emailVerification",
	context: { url: "...", name: "John" },
});
```

Translations are stored in `packages/i18n/translations/` and automatically loaded based on the locale.

## Creating Custom Templates

To create a new email template:

1. Create a new file in `packages/mail/emails/`:

```typescript
// packages/mail/emails/CustomEmail.tsx
import { Link, Text } from "@react-email/components";
import React from "react";
import { createTranslator } from "use-intl/core";
import PrimaryButton from "../src/components/PrimaryButton";
import Wrapper from "../src/components/Wrapper";
import { defaultLocale, defaultTranslations } from "../src/util/translations";
import type { BaseMailProps } from "../types";

export function CustomEmail({
	url,
	name,
	locale,
	translations,
}: {
	url: string;
	name: string;
} & BaseMailProps) {
	const t = createTranslator({
		locale,
		messages: translations,
	});

	return (
		<Wrapper>
			<Text>{t("mail.customEmail.body", { name })}</Text>
			<PrimaryButton href={url}>
				{t("mail.customEmail.action")}
			</PrimaryButton>
		</Wrapper>
	);
}

CustomEmail.PreviewProps = {
	locale: defaultLocale,
	translations: defaultTranslations,
	url: "#",
	name: "John Doe",
};

export default CustomEmail;
```

2. Add translations in `packages/i18n/translations/en.json`:

```json
{
	"mail": {
		"customEmail": {
			"subject": "Custom Email Subject",
			"body": "Hello {name}, this is a custom email.",
			"action": "Take Action"
		}
	}
}
```

3. Register the template in `packages/mail/emails/index.ts`:

```typescript
import { CustomEmail } from "./CustomEmail";

export const mailTemplates = {
	// ... existing templates
	customEmail: CustomEmail,
} as const;
```

4. Use the template:

```typescript
await sendEmail({
	to: "user@example.com",
	locale: "en",
	templateId: "customEmail",
	context: {
		url: "https://example.com/action",
		name: "John Doe",
	},
});
```

## Integration with Authentication

The email system is integrated with the authentication system in `packages/auth/auth.ts`:

-   **Email Verification**: Sent when users sign up
-   **Password Reset**: Sent when users request password reset
-   **Magic Link**: Sent for passwordless authentication
-   **Email Change**: Sent when users change their email address

All authentication emails automatically use the user's locale preference.

## Environment Variables

```bash
# Email provider (console or resend)
EMAIL_PROVIDER=console

# Resend API key (required for resend provider)
RESEND_API_KEY=re_...

# From email address
EMAIL_FROM=noreply@yourdomain.com
```

## Testing Emails

During development, emails are logged to the console by default. To test email rendering:

1. The console provider will log the email content
2. You can preview emails by running the React Email dev server (if configured)

## Best Practices

1. **Always use templates**: Templates ensure consistent branding and proper internationalization
2. **Test in multiple languages**: Verify emails render correctly in all supported locales
3. **Use descriptive subjects**: Make sure email subjects are clear and actionable
4. **Include plain text**: Always provide a plain text version for accessibility
5. **Handle errors gracefully**: Email sending can fail; handle errors appropriately

## Troubleshooting

### Emails not sending

1. Check that `EMAIL_PROVIDER` is set correctly
2. Verify API keys are configured
3. Check logs for error messages
4. Ensure the `from` email address is verified with your provider

### Wrong language in emails

1. Verify the locale is being passed correctly
2. Check that translations exist for the locale
3. Ensure the locale cookie is set properly

### Template not found

1. Verify the template is registered in `emails/index.ts`
2. Check that the template ID matches exactly
3. Ensure the template file is exported correctly
