# Quick Start Guide

Get up and running with Shipos Kit in minutes.

## ⚠️ Important: Read This First

**This project is ~35% complete.** The backend infrastructure is solid, but there are **no frontend pages** yet (no dashboard, no settings UI, no marketing pages).

**What works:** Authentication, email, storage, i18n (all backend)  
**What doesn't work:** User-facing pages, payments, AI, UI components

See [Implementation Status](./implementation-status.md) for full details.

## Prerequisites

-   Node.js 18+ and pnpm
-   PostgreSQL database
-   (Optional) S3-compatible storage for file uploads
-   (Optional) Resend account for email sending

## Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd shipos-kit

# Install dependencies
pnpm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Database (Required)
DATABASE_URL=postgresql://postgres:password@localhost:5432/shipos

# Authentication (Required)
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Provider (Optional - uses console in development)
RESEND_API_KEY=re_123456789

# Storage (Optional - for avatar uploads)
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
NEXT_PUBLIC_AVATARS_BUCKET_NAME=avatars
```

Generate a secure auth secret:

```bash
openssl rand -base64 32
```

### 3. Set Up Database

Create the database:

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE shipos;

# Exit
\q
```

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at:

-   **Web App**: http://localhost:3000
-   **API**: http://localhost:3000/api

## Implementation Status

⚠️ **Important:** This project is ~35% complete. See [Implementation Status](./implementation-status.md) for a detailed breakdown of what's working and what's not.

## What Actually Works

### ✅ Backend/API (Fully Functional)

-   Authentication API endpoints (`/api/auth/*`)
-   Email sending (console in dev, Resend in prod)
-   File storage (S3-compatible)
-   Database with complete schema
-   Internationalization system
-   User management API

### ❌ Frontend/UI (Not Implemented)

-   **No login/signup pages** - Auth pages don't exist
-   **No dashboard** - `/app` routes don't exist
-   **No settings pages** - `/app/settings` doesn't exist
-   **No UI components** - No component library
-   **No theme switcher** - No dark mode UI

### How to Test What Works

**Test Authentication API:**

```bash
# better-auth provides these endpoints automatically:
curl http://localhost:3000/api/auth/session
curl http://localhost:3000/api/auth/list-sessions

# See all available endpoints:
# /api/auth/sign-up
# /api/auth/sign-in
# /api/auth/sign-out
# /api/auth/callback/google
# /api/auth/callback/github
```

**Test Email System:**

```bash
# Start dev server
pnpm dev

# Trigger an auth flow (via API)
# Check console for email output
```

**Test Database:**

```bash
# Open Prisma Studio
pnpm db:studio

# View at http://localhost:5555
```

### Email System

-   ✅ React Email templates
-   ✅ Locale-aware emails
-   ✅ Console provider (development)
-   ✅ Resend provider (production)

**Templates included:**

-   Email verification
-   Password reset
-   Magic link
-   New user welcome
-   Newsletter signup

### Payment System

-   ✅ Stripe integration
-   ✅ Checkout sessions (subscription & one-time)
-   ✅ Customer portal
-   ✅ Webhook handling
-   ✅ Purchase tracking

**Supported features:**

-   Recurring subscriptions
-   One-time payments
-   Trial periods
-   Seat management
-   Subscription cancellation

### Internationalization

-   ✅ English and German translations
-   ✅ Locale detection from cookies
-   ✅ Language switcher component
-   ✅ Locale-aware routing

**Try it:**

1. Go to http://localhost:3000
2. Click the language switcher
3. Switch between English and German

### File Storage

-   ✅ S3-compatible storage
-   ✅ Presigned upload URLs
-   ✅ Image proxy endpoint
-   ✅ Avatar upload flow

**Supported providers:**

-   AWS S3
-   Cloudflare R2
-   MinIO
-   DigitalOcean Spaces
-   Backblaze B2

## Project Structure

```
shipos-kit/
├── apps/
│   └── web/              # Next.js application
│       ├── app/          # App Router pages
│       ├── modules/      # Feature modules
│       │   ├── saas/     # SaaS application
│       │   ├── ui/       # UI components
│       │   ├── i18n/     # Internationalization
│       │   └── shared/   # Shared utilities
│       └── middleware.ts # Route middleware
├── packages/
│   ├── auth/             # Authentication (better-auth)
│   ├── database/         # Database (Prisma)
│   ├── mail/             # Email system
│   ├── storage/          # File storage
│   ├── i18n/             # Translations
│   ├── logs/             # Logging
│   └── utils/            # Utilities
├── config/               # App configuration
├── tooling/              # Shared configs
└── docs/                 # Documentation
```

## Common Tasks

### Database Management

```bash
# Generate Prisma client
pnpm db:generate

# Create migration
pnpm db:migrate:dev

# Apply migrations
pnpm db:migrate:deploy

# Open Prisma Studio
pnpm db:studio

# Reset database (WARNING: deletes data)
pnpm db:reset
```

### Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Check types
pnpm type-check

# Run all checks
pnpm check
```

### Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Configuration

### Feature Flags

Enable/disable features in `config/index.ts`:

```typescript
export const config = {
	appName: "Shipos Kit",

	auth: {
		enableSignup: true,
		enableMagicLink: true,
		enableSocialLogin: true,
		enablePasskeys: true,
		enablePasswordLogin: true,
	},

	users: {
		enableBilling: false, // Enable when payments are implemented
		enableOnboarding: false,
	},

	i18n: {
		enabled: true,
		defaultLocale: "en",
	},

	ui: {
		enabledThemes: ["light", "dark"],
		defaultTheme: "light",
	},
};
```

### Adding Locales

1. Add to configuration:

```typescript
// config/index.ts
i18n: {
  locales: {
    en: { currency: 'USD', label: 'English' },
    de: { currency: 'EUR', label: 'Deutsch' },
    fr: { currency: 'EUR', label: 'Français' }, // New
  },
}
```

2. Create translation file:

```bash
# Create packages/i18n/translations/fr.json
{
  "common": {
    "loading": "Chargement...",
    "error": "Une erreur s'est produite"
  }
}
```

3. Restart dev server

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add credentials to `.env`:

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add credentials to `.env`:

```bash
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

## Storage Setup

### Local Development (MinIO)

```bash
# Start MinIO with Docker
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"

# Add to .env
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
NEXT_PUBLIC_AVATARS_BUCKET_NAME=avatars
```

Create bucket:

1. Open http://localhost:9001
2. Login with minioadmin/minioadmin
3. Create bucket named "avatars"

### Production (AWS S3)

```bash
# Add to .env
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
NEXT_PUBLIC_AVATARS_BUCKET_NAME=avatars
```

## Email Setup

### Development

Emails are logged to console by default. No setup required.

### Production (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to `.env`:

```bash
RESEND_API_KEY=re_123456789
```

4. Verify your domain in Resend dashboard

## Next Steps

### Learn the Basics

-   [Setup Guide](./setup.md) - Detailed setup instructions
-   [Development Guide](./development.md) - Development workflow
-   [Configuration](./configuration.md) - Configure features

### Explore Features

-   [Authentication](./authentication.md) - Auth system details
-   [User Management](./user-management.md) - User features
-   [Email System](./email.md) - Email templates and sending
-   [Storage](./storage.md) - File storage and uploads
-   [Internationalization](./i18n.md) - Multi-language support

### Customize

-   [TypeScript](./typescript.md) - TypeScript configuration
-   [Database](./database.md) - Database schema and queries
-   [Utilities](./utilities.md) - Helper functions

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Test connection
psql $DATABASE_URL
```

### Prisma Client Not Generated

```bash
pnpm db:generate
```

### TypeScript Errors

```bash
# Regenerate types
pnpm db:generate
pnpm install

# Restart TypeScript server in VS Code
# Command Palette > TypeScript: Restart TS Server
```

## Getting Help

-   Check the [documentation](./README.md)
-   Review [troubleshooting guides](./setup.md#common-issues)
-   Check GitHub issues
-   Ask in community forums

## What's Next?

The following features are planned:

-   🤖 **AI** - OpenAI chat and image generation
-   🔌 **API** - Type-safe API with ORPC
-   👥 **Admin Panel** - User management (optional)
-   🧪 **Testing** - E2E tests with Playwright
-   🎨 **UI Components** - Complete component library

Check the [tasks list](.kiro/specs/shipos-kit/tasks.md) for implementation progress.
