# Email System

The email system provides transactional email functionality with React Email templates and support for multiple email providers.

## Overview

The email package (`@shipos/mail`) provides:

-   Email provider abstraction (Console, Resend)
-   React Email templates with Tailwind CSS
-   Locale-aware email sending
-   Template rendering with context
-   Type-safe email sending
-   Reusable email components

## Architecture

```
packages/mail/
├── emails/
│   ├── EmailVerification.tsx    # Email verification template
│   ├── ForgotPassword.tsx       # Password reset template
│   ├── MagicLink.tsx            # Magic link login template
│   ├── NewUser.tsx              # New user welcome template
│   ├── NewsletterSignup.tsx     # Newsletter confirmation template
│   └── index.ts                 # Template exports
├── src/
│   ├── components/
│   │   ├── Logo.tsx             # Email logo component
│   │   ├── PrimaryButton.tsx    # Primary button component
│   │   └── Wrapper.tsx          # Email wrapper with styling
│   ├── provider/
│   │   ├── console.ts           # Console provider (development)
│   │   ├── resend.ts            # Resend provider (production)
│   │   └── index.ts             # Provider factory
│   └── util/
│       ├── send.ts              # Email sending logic
│       ├── templates.ts         # Template registry
│       └── translations.ts      # Translation utilities
├── types.ts                     # TypeScript types
└── index.ts                     # Package exports
```

## Configuration

### Application Configuration

Email settings are configured in `config/index.ts`:

```typescript
mails: {
  from: 'noreply@example.com',
}
```

### Environment Variables

```bash
# Email Provider
RESEND_API_KEY=re_123456789  # For Resend provider

# From Address (optional, uses config default)
EMAIL_FROM=noreply@example.com
```

## Email Providers

### Console Provider (Development)

Logs emails to console instead of sending them.

**Usage:**

```typescript
import { ConsoleProvider } from "@shipos/mail/src/provider/console";

const provider = new ConsoleProvider();
await provider.sendEmail({
	to: "user@example.com",
	subject: "Test Email",
	html: "<p>Hello</p>",
});
```

**Output:**

```
📧 Email sent:
To: user@example.com
Subject: Test Email
HTML: <p>Hello</p>
```

**When to use:**

-   Local development
-   Testing email flows
-   CI/CD environments

### Resend Provider (Production)

Sends emails via [Resend](https://resend.com) API.

**Setup:**

1. Sign up at [resend.com](https://resend.com)
2. Get API key from dashboard
3. Add to environment variables:

```bash
RESEND_API_KEY=re_123456789
```

**Usage:**

```typescript
import { ResendProvider } from "@shipos/mail/src/provider/resend";

const provider = new ResendProvider();
await provider.sendEmail({
	to: "user@example.com",
	subject: "Welcome",
	html: "<p>Welcome to our app!</p>",
});
```

**Features:**

-   Reliable email delivery
-   Email analytics
-   Bounce handling
-   Webhook support

### Provider Selection

The provider is automatically selected based on environment:

```typescript
import { getEmailProvider } from "@shipos/mail/src/provider";

// Returns ConsoleProvider in development
// Returns ResendProvider in production (if RESEND_API_KEY is set)
const provider = getEmailProvider();
```

## Email Templates

### Template Structure

All templates use React Email components:

```typescript
import { Text } from "@react-email/components";
import Wrapper from "../src/components/Wrapper";
import PrimaryButton from "../src/components/PrimaryButton";

export function EmailTemplate({ url, name }: Props) {
	return (
		<Wrapper>
			<Text>Hello {name},</Text>
			<PrimaryButton href={url}>Click Here</PrimaryButton>
		</Wrapper>
	);
}
```

### Available Templates

#### EmailVerification

Sent when user changes their email address.

**Props:**

```typescript
{
	url: string; // Verification link
	name: string; // User's name
	locale: string; // User's locale
	translations: any; // Translation messages
}
```

**Usage:**

```typescript
await sendEmail({
	to: user.email,
	locale: user.locale,
	templateId: "emailVerification",
	context: {
		url: verificationUrl,
		name: user.name,
	},
});
```

#### ForgotPassword

Sent when user requests password reset.

**Props:**

```typescript
{
	url: string; // Reset password link
	name: string; // User's name
	locale: string; // User's locale
	translations: any; // Translation messages
}
```

**Usage:**

```typescript
await sendEmail({
	to: user.email,
	locale: user.locale,
	templateId: "forgotPassword",
	context: {
		url: resetUrl,
		name: user.name,
	},
});
```

#### MagicLink

Sent for passwordless authentication.

**Props:**

```typescript
{
	url: string; // Magic link URL
	locale: string; // User's locale
	translations: any; // Translation messages
}
```

**Usage:**

```typescript
await sendEmail({
	to: email,
	locale: locale,
	templateId: "magicLink",
	context: {
		url: magicLinkUrl,
	},
});
```

#### NewUser

Sent to new users for email verification.

**Props:**

```typescript
{
	url: string; // Verification link
	name: string; // User's name
	locale: string; // User's locale
	translations: any; // Translation messages
}
```

**Usage:**

```typescript
await sendEmail({
	to: user.email,
	locale: user.locale,
	templateId: "newUser",
	context: {
		url: verificationUrl,
		name: user.name,
	},
});
```

#### NewsletterSignup

Sent when user subscribes to newsletter.

**Props:**

```typescript
{
	locale: string; // User's locale
	translations: any; // Translation messages
}
```

**Usage:**

```typescript
await sendEmail({
	to: email,
	locale: locale,
	templateId: "newsletterSignup",
	context: {},
});
```

## Reusable Components

### Wrapper

Provides consistent email layout with logo and styling.

**Features:**

-   Responsive design
-   Tailwind CSS styling
-   Inter font family
-   Light/dark mode support
-   Consistent branding

**Usage:**

```typescript
import Wrapper from "../src/components/Wrapper";

export function MyEmail() {
	return (
		<Wrapper>
			<Text>Email content here</Text>
		</Wrapper>
	);
}
```

### Logo

Displays application logo/name.

**Features:**

-   Uses `config.appName`
-   Consistent styling
-   Responsive sizing

**Usage:**

```typescript
import { Logo } from "../src/components/Logo";

<Logo />;
```

### PrimaryButton

Styled call-to-action button.

**Props:**

```typescript
{
	href: string; // Button link
	children: ReactNode; // Button text
}
```

**Usage:**

```typescript
import PrimaryButton from "../src/components/PrimaryButton";

<PrimaryButton href="https://example.com/verify">Verify Email</PrimaryButton>;
```

## Sending Emails

### Basic Usage

```typescript
import { sendEmail } from "@shipos/mail";

await sendEmail({
	to: "user@example.com",
	locale: "en",
	templateId: "emailVerification",
	context: {
		url: "https://example.com/verify?token=abc",
		name: "John Doe",
	},
});
```

### With Locale Detection

```typescript
import { sendEmail } from "@shipos/mail";

const locale = user.locale || "en";

await sendEmail({
	to: user.email,
	locale,
	templateId: "forgotPassword",
	context: {
		url: resetUrl,
		name: user.name,
	},
});
```

### Error Handling

```typescript
try {
	await sendEmail({
		to: user.email,
		locale: user.locale,
		templateId: "newUser",
		context: { url, name: user.name },
	});
	console.log("Email sent successfully");
} catch (error) {
	console.error("Failed to send email:", error);
	// Handle error (retry, log, notify admin, etc.)
}
```

## Internationalization

### Locale-Aware Emails

Emails are automatically translated based on the provided locale:

```typescript
// English email
await sendEmail({
	to: "user@example.com",
	locale: "en",
	templateId: "emailVerification",
	context: { url, name: "John" },
});

// German email
await sendEmail({
	to: "user@example.com",
	locale: "de",
	templateId: "emailVerification",
	context: { url, name: "John" },
});
```

### Translation Loading

Translations are loaded from `packages/i18n/translations/`:

```typescript
import { getMessagesForLocale } from "@shipos/i18n";

const translations = await getMessagesForLocale(locale);
```

### Adding Translations

Add email translations to locale files:

```json
// packages/i18n/translations/en.json
{
	"mail": {
		"emailVerification": {
			"subject": "Verify your email",
			"body": "Please click the link below to verify your email.",
			"confirmEmail": "Verify email"
		}
	}
}
```

```json
// packages/i18n/translations/de.json
{
	"mail": {
		"emailVerification": {
			"subject": "Bestätigen Sie Ihre E-Mail",
			"body": "Bitte klicken Sie auf den Link unten, um Ihre E-Mail zu bestätigen.",
			"confirmEmail": "E-Mail bestätigen"
		}
	}
}
```

## Creating Custom Templates

### 1. Create Template File

Create a new file in `packages/mail/emails/`:

```typescript
// packages/mail/emails/CustomEmail.tsx
import { Text, Link } from "@react-email/components";
import { createTranslator } from "use-intl/core";
import Wrapper from "../src/components/Wrapper";
import PrimaryButton from "../src/components/PrimaryButton";
import type { BaseMailProps } from "../types";

interface CustomEmailProps extends BaseMailProps {
	url: string;
	userName: string;
}

export function CustomEmail({
	url,
	userName,
	locale,
	translations,
}: CustomEmailProps) {
	const t = createTranslator({ locale, messages: translations });

	return (
		<Wrapper>
			<Text>{t("mail.custom.greeting", { name: userName })}</Text>
			<Text>{t("mail.custom.body")}</Text>

			<PrimaryButton href={url}>{t("mail.custom.action")}</PrimaryButton>

			<Text className="text-muted-foreground text-sm">
				{t("mail.common.openLinkInBrowser")}
				<Link href={url} className="break-all">
					{url}
				</Link>
			</Text>
		</Wrapper>
	);
}

// Preview props for development
CustomEmail.PreviewProps = {
	locale: "en",
	translations: {},
	url: "#",
	userName: "John Doe",
};

export default CustomEmail;
```

### 2. Register Template

Add to `packages/mail/src/util/templates.ts`:

```typescript
import { CustomEmail } from "../../emails/CustomEmail";

export const templates = {
	emailVerification: EmailVerification,
	forgotPassword: ForgotPassword,
	magicLink: MagicLink,
	newUser: NewUser,
	newsletterSignup: NewsletterSignup,
	custom: CustomEmail, // Add your template
};
```

### 3. Add Translations

```json
// packages/i18n/translations/en.json
{
	"mail": {
		"custom": {
			"subject": "Custom Email Subject",
			"greeting": "Hello {name},",
			"body": "This is a custom email template.",
			"action": "Take Action"
		}
	}
}
```

### 4. Use Template

```typescript
await sendEmail({
	to: user.email,
	locale: user.locale,
	templateId: "custom",
	context: {
		url: "https://example.com/action",
		userName: user.name,
	},
});
```

## Email Styling

### Tailwind CSS

Templates use Tailwind CSS for styling:

```typescript
<Text className="text-lg font-bold text-foreground">Welcome!</Text>
```

### Theme Colors

Available theme colors:

```typescript
colors: {
  border: '#e3ebf6',
  background: '#fafafe',
  foreground: '#292b35',
  primary: {
    DEFAULT: '#4e6df5',
    foreground: '#f6f7f9',
  },
  secondary: {
    DEFAULT: '#292b35',
    foreground: '#ffffff',
  },
  card: {
    DEFAULT: '#ffffff',
    foreground: '#292b35',
  },
}
```

### Custom Styling

Add custom styles with Tailwind classes:

```typescript
<div className="rounded-lg bg-card p-6 shadow-md">
	<Text className="text-2xl font-bold text-primary">Important Notice</Text>
</div>
```

## Testing Emails

### Preview in Development

Use React Email CLI to preview templates:

```bash
# Install React Email CLI
pnpm add -D @react-email/cli

# Start preview server
pnpm email:dev
```

Opens preview at `http://localhost:3000`

### Send Test Email

```typescript
import { sendEmail } from "@shipos/mail";

// Send test email
await sendEmail({
	to: "test@example.com",
	locale: "en",
	templateId: "emailVerification",
	context: {
		url: "https://example.com/verify?token=test",
		name: "Test User",
	},
});
```

### Console Provider Testing

In development, emails are logged to console:

```bash
pnpm dev

# Trigger email flow (signup, password reset, etc.)
# Check console for email output
```

## Best Practices

### Use Locale-Aware Sending

Always provide locale for proper translations:

```typescript
// Good
await sendEmail({
	to: user.email,
	locale: user.locale || "en",
	templateId: "emailVerification",
	context: { url, name: user.name },
});

// Avoid
await sendEmail({
	to: user.email,
	locale: "en", // Hardcoded locale
	templateId: "emailVerification",
	context: { url, name: user.name },
});
```

### Include Fallback Links

Always include plain text links for accessibility:

```typescript
<PrimaryButton href={url}>
  Verify Email
</PrimaryButton>

<Text className="text-sm text-muted-foreground">
  Or copy this link: {url}
</Text>
```

### Keep Templates Simple

-   Use clear, concise copy
-   Single call-to-action per email
-   Mobile-responsive design
-   Accessible color contrast

### Handle Errors Gracefully

```typescript
try {
  await sendEmail({ ... })
} catch (error) {
  // Log error
  console.error('Email send failed:', error)

  // Don't block user flow
  // Consider retry logic or queue
}
```

### Test All Locales

Test email templates in all supported locales:

```typescript
for (const locale of ["en", "de"]) {
	await sendEmail({
		to: "test@example.com",
		locale,
		templateId: "emailVerification",
		context: { url, name: "Test" },
	});
}
```

## Troubleshooting

### Common Issues

**Issue: "RESEND_API_KEY not set"**

-   Solution: Add `RESEND_API_KEY` to environment variables
-   Or use Console provider in development

**Issue: "Template not found"**

-   Solution: Ensure template is registered in `templates.ts`
-   Check template ID spelling

**Issue: "Email not translated"**

-   Solution: Add translations to all locale files
-   Check locale is passed correctly

**Issue: "Styling not applied"**

-   Solution: Ensure Tailwind config is correct in Wrapper component
-   Check class names are valid

**Issue: "Email not received"**

-   Solution: Check spam folder
-   Verify email address is correct
-   Check Resend dashboard for delivery status

## Production Deployment

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key
4. Add to production environment:

```bash
RESEND_API_KEY=re_prod_123456789
```

### Domain Verification

Verify your sending domain in Resend:

1. Add DNS records (SPF, DKIM, DMARC)
2. Wait for verification
3. Test email sending

### Monitoring

Monitor email delivery:

-   Check Resend dashboard for analytics
-   Set up webhook for delivery events
-   Log email sending errors
-   Track bounce rates

## Next Steps

-   [Authentication](./authentication.md) - Email flows in auth
-   [Internationalization](./i18n.md) - Add email translations
-   [Configuration](./configuration.md) - Configure email settings

## Resources

-   [React Email Documentation](https://react.email/)
-   [Resend Documentation](https://resend.com/docs)
-   [Tailwind CSS](https://tailwindcss.com/)
