# Authentication System

The authentication system is built with [better-auth](https://better-auth.com) v1.3.7, providing a comprehensive solution for user authentication and session management.

## Overview

The authentication package (`@shipos/auth`) provides:

-   Email/password authentication with verification
-   Magic link (passwordless) authentication
-   OAuth providers (Google, GitHub)
-   Passkey/WebAuthn support
-   Two-factor authentication (TOTP)
-   Session management with configurable expiration
-   User roles and permissions
-   Account linking for trusted providers

## Architecture

```
packages/auth/
├── auth.ts          # Main better-auth configuration
├── client.ts        # Client-side auth utilities
└── index.ts         # Package exports
```

## Configuration

### Server Configuration

The authentication system is configured in `packages/auth/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
	baseURL: getBaseUrl(),
	appName: config.appName,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	session: {
		expiresIn: config.auth.sessionCookieMaxAge, // 30 days default
		freshAge: 0,
	},
	// ... more configuration
});
```

### Feature Flags

Authentication features can be enabled/disabled via configuration:

```typescript
// config/index.ts
export const config = {
	auth: {
		enableSignup: true, // Allow new user registration
		enableMagicLink: true, // Enable passwordless login
		enableSocialLogin: true, // Enable OAuth providers
		enablePasskeys: true, // Enable WebAuthn/passkeys
		enablePasswordLogin: true, // Enable email/password
		enableTwoFactor: true, // Enable 2FA/TOTP
		redirectAfterSignIn: "/app", // Post-login redirect
		redirectAfterLogout: "/", // Post-logout redirect
		sessionCookieMaxAge: 2592000, // 30 days in seconds
	},
};
```

## Authentication Methods

### Email and Password

Users can sign up and log in with email and password.

**Features:**

-   Password strength validation
-   Email verification required (configurable)
-   Auto sign-in after verification
-   Password reset flow
-   Change password functionality

**Email Verification:**

```typescript
emailVerification: {
  sendOnSignUp: config.auth.enableSignup,
  autoSignInAfterVerification: true,
  sendVerificationEmail: async ({ user, url }, request) => {
    const locale = getLocaleFromRequest(request)
    // Email sending implementation
  },
}
```

**Password Reset:**

```typescript
emailAndPassword: {
  enabled: config.auth.enablePasswordLogin,
  requireEmailVerification: config.auth.enableSignup,
  sendResetPassword: async ({ user, url }, request) => {
    const locale = getLocaleFromRequest(request)
    // Email sending implementation
  },
}
```

### Magic Link (Passwordless)

Users can log in by clicking a link sent to their email.

**Configuration:**

```typescript
magicLink({
	disableSignUp: !config.auth.enableSignup,
	sendMagicLink: async ({ email, url }, request) => {
		const locale = getLocaleFromRequest(request);
		// Email sending implementation
	},
});
```

**Usage:**

1. User enters email address
2. System sends magic link email
3. User clicks link
4. System authenticates and creates session

### OAuth Providers

Social login with Google and GitHub.

**Google OAuth:**

```typescript
google: {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  scope: ['email', 'profile'],
  enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
}
```

**GitHub OAuth:**

```typescript
github: {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  scope: ['user:email'],
  enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
}
```

**Account Linking:**

```typescript
account: {
  accountLinking: {
    enabled: true,
    trustedProviders: ['google', 'github'],
  },
}
```

Trusted providers can automatically link to existing accounts with the same verified email.

### Passkeys (WebAuthn)

Biometric authentication using WebAuthn standard.

**Features:**

-   Register passkeys on compatible devices
-   Authenticate with biometrics or security keys
-   Store device metadata (type, backup status)
-   Multiple passkeys per user

**Database Schema:**

```prisma
model Passkey {
  id           String   @id @default(cuid())
  name         String?
  publicKey    String
  credentialID String   @unique
  userId       String
  counter      Int
  deviceType   String
  backedUp     Boolean
  transports   String?
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Two-Factor Authentication (TOTP)

Time-based one-time password for enhanced security.

**Features:**

-   TOTP secret generation
-   QR code display for authenticator apps
-   Backup codes for recovery
-   Required on login when enabled

**Database Schema:**

```prisma
model TwoFactor {
  id          String @id @default(cuid())
  secret      String
  backupCodes String
  userId      String @unique

  user        User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Session Management

### Session Configuration

```typescript
session: {
  expiresIn: config.auth.sessionCookieMaxAge, // 30 days
  freshAge: 0, // Always consider session fresh
}
```

### Session Storage

Sessions are stored in the database with metadata:

```prisma
model Session {
  id             String    @id @default(cuid())
  expiresAt      DateTime
  token          String    @unique
  userId         String
  ipAddress      String?
  userAgent      String?
  impersonatedBy String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### Session Security

-   **HTTP-only cookies**: Prevents XSS attacks
-   **Secure flag**: HTTPS only in production
-   **SameSite**: Lax for CSRF protection
-   **Token rotation**: Automatic on activity

## User Model

### Additional Fields

Custom fields added to the User model:

```typescript
user: {
  additionalFields: {
    onboardingComplete: {
      type: 'boolean',
      required: false,
    },
    locale: {
      type: 'string',
      required: false,
    },
  },
}
```

### Complete User Schema

```prisma
model User {
  id                  String       @id @default(cuid())
  name                String
  email               String       @unique
  emailVerified       DateTime?
  image               String?
  username            String?      @unique
  role                String?
  banned              Boolean      @default(false)
  banReason           String?
  banExpires          DateTime?
  onboardingComplete  Boolean      @default(false)
  paymentsCustomerId  String?
  locale              String?
  twoFactorEnabled    Boolean      @default(false)
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  sessions            Session[]
  accounts            Account[]
  passkeys            Passkey[]
  twoFactor           TwoFactor?
  purchases           Purchase[]
  aiChats             AiChat[]

  @@index([email])
}
```

## Client-Side Usage

### Auth Client

```typescript
import { authClient } from "@shipos/auth";

// Sign up
await authClient.signUp.email({
	email: "user@example.com",
	password: "securepassword",
	name: "John Doe",
});

// Sign in
await authClient.signIn.email({
	email: "user@example.com",
	password: "securepassword",
});

// Sign out
await authClient.signOut();

// Get session
const session = await authClient.getSession();
```

### React Hooks

```typescript
import { useSession } from "@shipos/auth";

function ProfileButton() {
	const { data: session, isPending } = useSession();

	if (isPending) return <Spinner />;
	if (!session) return <LoginButton />;

	return <UserMenu user={session.user} />;
}
```

## Plugins

### Admin Plugin

Provides admin role management:

```typescript
import { admin } from "better-auth/plugins";

plugins: [admin()];
```

**Features:**

-   Assign/remove admin role
-   Admin-only procedures
-   Role-based access control

### Username Plugin

Adds username support:

```typescript
import { username } from "better-auth/plugins";

plugins: [username()];
```

### OpenAPI Plugin

Generates OpenAPI documentation:

```typescript
import { openAPI } from "better-auth/plugins";

plugins: [openAPI()];
```

## Locale-Aware Emails

The system detects user locale for email sending:

```typescript
function getLocaleFromRequest(request?: Request): string {
	if (!request) return config.i18n.defaultLocale;

	const cookies = parseCookies(request.headers.get("cookie") ?? "");
	return cookies[config.i18n.localeCookieName] ?? config.i18n.defaultLocale;
}
```

Emails are sent in the user's preferred language when available.

## Environment Variables

Required environment variables:

```bash
# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Generating Auth Secret

```bash
# Generate a secure random secret
openssl rand -base64 32
```

## User Management

### Change Email

```typescript
user: {
  changeEmail: {
    enabled: true,
    sendChangeEmailVerification: async ({ user, url }, request) => {
      const locale = getLocaleFromRequest(request)
      // Send verification email to new address
    },
  },
}
```

### Delete User

```typescript
user: {
  deleteUser: {
    enabled: true,
  },
}
```

When a user is deleted:

-   All sessions are invalidated
-   Related records are cascade deleted (sessions, accounts, passkeys, etc.)
-   Active subscriptions should be cancelled (handled by application logic)

## Error Handling

### API Errors

```typescript
onAPIError: {
  onError(error, ctx) {
    console.error('Auth API Error:', error, { ctx })
  },
}
```

### Common Error Codes

-   `INVALID_CREDENTIALS` - Wrong email or password
-   `EMAIL_NOT_VERIFIED` - Email verification required
-   `USER_BANNED` - Account is banned
-   `INVALID_TOKEN` - Session token invalid or expired
-   `2FA_REQUIRED` - Two-factor code needed

## Security Best Practices

### Password Security

-   Passwords are hashed with bcrypt
-   Minimum password strength enforced
-   Password reset tokens expire after use

### Session Security

-   HTTP-only cookies prevent XSS
-   Secure flag in production
-   SameSite=Lax prevents CSRF
-   30-day expiration by default

### Account Security

-   Email verification prevents fake accounts
-   2FA adds extra protection layer
-   Passkeys provide phishing-resistant auth
-   Account linking only for trusted providers

## Testing

### Test User Creation

```typescript
import { auth } from "@shipos/auth";

// Create test user
const user = await auth.api.signUpEmail({
	body: {
		email: "test@example.com",
		password: "testpassword",
		name: "Test User",
	},
});
```

### Mock Authentication

```typescript
// Mock session for testing
const mockSession = {
	user: {
		id: "test-user-id",
		email: "test@example.com",
		name: "Test User",
	},
	session: {
		id: "test-session-id",
		expiresAt: new Date(Date.now() + 86400000),
	},
};
```

## Troubleshooting

### Common Issues

**Issue: "BETTER_AUTH_URL not set"**

-   Solution: Set `BETTER_AUTH_URL` environment variable to your app URL

**Issue: "Database connection failed"**

-   Solution: Verify `DATABASE_URL` is correct and database is running

**Issue: "OAuth redirect mismatch"**

-   Solution: Add redirect URL to OAuth provider settings: `{BETTER_AUTH_URL}/api/auth/callback/{provider}`

**Issue: "Email verification not working"**

-   Solution: Implement email sending in `sendVerificationEmail` callback

## Migration Guide

### From v1.2.x to v1.3.x

No breaking changes. Update package version:

```bash
pnpm add better-auth@^1.3.7
```

## API Reference

### Server API

```typescript
// Get session from request
const session = await auth.api.getSession({ headers: request.headers });

// Sign out user
await auth.api.signOut({ headers: request.headers });

// Update user
await auth.api.updateUser({
	body: { name: "New Name" },
	headers: request.headers,
});
```

### Client API

```typescript
// Sign up with email
authClient.signUp.email({ email, password, name });

// Sign in with email
authClient.signIn.email({ email, password });

// Sign in with OAuth
authClient.signIn.social({ provider: "google" });

// Request magic link
authClient.signIn.magicLink({ email });

// Sign out
authClient.signOut();

// Get session
authClient.getSession();

// Update user
authClient.updateUser({ name: "New Name" });
```

## Next Steps

-   [Database Schema](./database.md) - Learn about the database structure
-   [Configuration](./configuration.md) - Customize authentication behavior
-   [API](./api.md) - Build protected API routes
-   [Email](./email.md) - Set up email sending for auth flows
