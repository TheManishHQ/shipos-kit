# Quick Reference

A quick reference guide for Shipos Kit features and status.

## Project Status at a Glance

| Aspect                 | Status | Details                                            |
| ---------------------- | ------ | -------------------------------------------------- |
| **Overall Completion** | ~35%   | Backend foundation complete, frontend missing      |
| **Production Ready**   | ❌ No  | Missing UI, pages, payments, tests                 |
| **Backend/API**        | ✅ Yes | Auth, email, storage, database all working         |
| **Frontend/UI**        | ❌ No  | No dashboard, settings pages, or component library |

## What Works Right Now

### ✅ Authentication

-   Email/password with verification
-   Magic link (passwordless)
-   OAuth (Google, GitHub)
-   Passkeys (WebAuthn)
-   Session management
-   Password reset

### ✅ User Management

-   Profile updates (name, email)
-   Avatar upload with cropping
-   Password change
-   Session list and revocation
-   Connected accounts

### ✅ Email System

-   React Email templates
-   Resend integration
-   Console provider (dev)
-   Locale-aware emails
-   All auth emails

### ✅ Storage

-   S3-compatible storage
-   Presigned upload URLs
-   Presigned download URLs
-   Image proxy endpoint
-   Avatar uploads

### ✅ Internationalization

-   English and German
-   Locale detection
-   Language switcher
-   Locale-aware routing
-   Translation system

### ✅ Infrastructure

-   Monorepo (pnpm + Turborepo)
-   TypeScript strict mode
-   Biome linting/formatting
-   Tailwind CSS 4
-   Next.js 15 App Router
-   Prisma + PostgreSQL

## What Doesn't Work

### ❌ Frontend

-   No dashboard pages
-   No settings UI
-   No auth pages (login, signup)
-   No component library
-   No theme switcher
-   No marketing pages

### ❌ Features

-   No payment integration
-   No AI features
-   No admin panel
-   No blog system
-   No tests

### ❌ API

-   ORPC not configured
-   Only users module exists
-   No other API modules

## Quick Commands

```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:generate
pnpm db:migrate

# Start development
pnpm dev

# Code quality
pnpm lint
pnpm format
pnpm type-check

# Database tools
pnpm db:studio
pnpm db:reset
```

## Environment Variables

### Required

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/shipos
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

### Optional

```bash
# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email
RESEND_API_KEY=...

# Storage
S3_ENDPOINT=...
S3_REGION=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
NEXT_PUBLIC_AVATARS_BUCKET_NAME=avatars
```

## File Structure

```
shipos-kit/
├── apps/web/           # Next.js app
│   ├── app/            # Pages (minimal)
│   └── modules/        # Feature modules
├── packages/
│   ├── auth/           # ✅ Complete
│   ├── database/       # ✅ Complete
│   ├── mail/           # ✅ Complete
│   ├── storage/        # ✅ Complete
│   ├── i18n/           # ✅ Complete
│   ├── logs/           # ✅ Complete
│   ├── utils/          # ✅ Complete
│   ├── api/            # 🚧 Minimal
│   ├── ai/             # ❌ Empty
│   └── payments/       # ❌ Empty
└── config/             # ✅ Complete
```

## API Endpoints

### Working Endpoints

```bash
# Auth (better-auth)
/api/auth/session
/api/auth/sign-in
/api/auth/sign-up
/api/auth/sign-out
/api/auth/callback/google
/api/auth/callback/github

# Storage
/api/image-proxy?path=...&bucket=...

# Users
/api/users/avatar-upload-url
```

### Not Implemented

```bash
# These don't exist yet
/api/payments/*
/api/ai/*
/api/admin/*
/api/contact
/api/newsletter
```

## Database Models

### Implemented

-   ✅ User
-   ✅ Session
-   ✅ Account
-   ✅ Verification
-   ✅ Passkey
-   ✅ TwoFactor
-   ✅ Purchase
-   ✅ AiChat

All models are complete with proper relations and indexes.

## Configuration Flags

```typescript
// config/index.ts
auth: {
  enableSignup: true,
  enableMagicLink: true,
  enableSocialLogin: true,
  enablePasskeys: true,
  enablePasswordLogin: true,
}

users: {
  enableBilling: false,  // Not implemented
  enableOnboarding: false,
}

ui: {
  saas: { enabled: true },
  marketing: { enabled: true },
}
```

## Common Tasks

### Add a New User

```typescript
import { prisma } from "@shipos/database";

const user = await prisma.user.create({
	data: {
		name: "John Doe",
		email: "john@example.com",
	},
});
```

### Send an Email

```typescript
import { sendEmail } from "@shipos/mail";

await sendEmail({
	to: "user@example.com",
	locale: "en",
	templateId: "emailVerification",
	context: { url, name },
});
```

### Upload a File

```typescript
import { getSignedUploadUrl } from "@shipos/storage";

const uploadUrl = await getSignedUploadUrl("file.png", {
	bucket: "avatars",
});

await fetch(uploadUrl, {
	method: "PUT",
	body: fileBlob,
});
```

### Get Current User

```typescript
import { auth } from "@shipos/auth";

const session = await auth.api.getSession({
	headers: request.headers,
});

const user = session?.user;
```

## Troubleshooting

### Port in Use

```bash
lsof -ti:3000 | xargs kill -9
```

### Database Issues

```bash
pnpm db:generate
pnpm db:migrate
```

### TypeScript Errors

```bash
pnpm install
pnpm db:generate
# Restart TS server in IDE
```

### Prisma Client Not Found

```bash
pnpm db:generate
```

## Next Steps

To make this production-ready:

1. **Install Shadcn UI** - Component library
2. **Create Auth Pages** - Login, signup, etc.
3. **Build Dashboard** - Main SaaS interface
4. **Add Settings Pages** - Profile, security, billing
5. **Configure ORPC** - Type-safe API
6. **Add Payments** - Stripe or DodoPayments
7. **Write Tests** - E2E with Playwright

Estimated: 5-6 weeks full-time

## Resources

-   [CURRENT_STATUS.md](../CURRENT_STATUS.md) - Detailed status
-   [Implementation Status](./implementation-status.md) - Technical breakdown
-   [Quick Start](./quick-start.md) - Getting started
-   [Full Documentation](./README.md) - All docs

## Last Updated

November 27, 2024
