# Shipos Kit

A production-ready SaaS starter kit built with Next.js 15, React 19, and TypeScript.

## ⚠️ Project Status: ~47% Complete

**This is a backend foundation, not a complete SaaS starter kit.**

✅ **What works:** Authentication, email, storage, database, payments, i18n (all backend/API)  
❌ **What doesn't work:** User-facing pages, UI components, AI

**📋 Read [CURRENT_STATUS.md](./CURRENT_STATUS.md) before proceeding.**

## Quick Links

-   [Current Status](./CURRENT_STATUS.md) - **READ THIS FIRST**
-   [Implementation Status](./docs/implementation-status.md) - Detailed breakdown
-   [Quick Start Guide](./docs/quick-start.md) - Get started
-   [Documentation](./docs/README.md) - Full documentation

## What's Actually Working

### ✅ Backend/Infrastructure (Complete)

-   🔐 Authentication (email/password, magic links, OAuth, passkeys)
-   📧 Email system (React Email + Resend)
-   📦 Storage (S3-compatible file uploads)
-   🗄️ Database (Prisma + PostgreSQL)
-   🌍 Internationalization (English, German)
-   👤 User management (profile, avatar, sessions)
-   💳 Payments (Stripe integration)
-   ⚙️ Configuration system
-   📝 Logging system

### ❌ Frontend/Features (Not Implemented)

-   🚫 No dashboard pages
-   🚫 No settings UI
-   🚫 No UI component library
-   🚫 No theme switcher
-   🚫 No marketing pages
-   🚫 No payment UI (backend works)
-   🚫 No AI features
-   🚫 No tests

## Getting Started

### Prerequisites

-   Node.js 18+ and pnpm
-   PostgreSQL database
-   (Optional) S3-compatible storage
-   (Optional) Resend account for emails

### Installation

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Setup database
pnpm db:generate
pnpm db:migrate

# Start development server
pnpm dev
```

### What You'll See

```bash
# This works
open http://localhost:3000
# Shows basic homepage

# These don't exist yet
open http://localhost:3000/auth/login     # 404
open http://localhost:3000/app            # 404
open http://localhost:3000/app/settings   # 404

# But API endpoints work
curl http://localhost:3000/api/auth/session
```

## Tech Stack

-   **Framework:** Next.js 15 (App Router)
-   **Language:** TypeScript (strict mode)
-   **Database:** PostgreSQL + Prisma ORM
-   **Auth:** better-auth v1.3.7
-   **Email:** React Email + Resend
-   **Storage:** S3-compatible (AWS S3, Cloudflare R2, MinIO)
-   **i18n:** next-intl v4.3.5
-   **Styling:** Tailwind CSS 4
-   **Linting:** Biome v2.2.2
-   **Monorepo:** pnpm workspaces + Turborepo

## Project Structure

```
shipos-kit/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── auth/             # ✅ Authentication (complete)
│   ├── database/         # ✅ Prisma database (complete)
│   ├── mail/             # ✅ Email system (complete)
│   ├── storage/          # ✅ File storage (complete)
│   ├── i18n/             # ✅ Internationalization (complete)
│   ├── logs/             # ✅ Logging (complete)
│   ├── utils/            # ✅ Utilities (complete)
│   ├── payments/         # ✅ Payments (complete)
│   ├── api/              # 🚧 Minimal (only users module)
│   └── ai/               # ❌ Empty
├── config/               # ✅ Configuration (complete)
└── docs/                 # ✅ Documentation
```

## Documentation

-   [Current Status](./CURRENT_STATUS.md) - Honest assessment
-   [Implementation Status](./docs/implementation-status.md) - Detailed breakdown
-   [Quick Start](./docs/quick-start.md) - Get started quickly
-   [Setup Guide](./docs/setup.md) - Detailed setup
-   [Development Guide](./docs/development.md) - Development workflow
-   [Authentication](./docs/authentication.md) - Auth system
-   [Database](./docs/database.md) - Database schema
-   [Email](./docs/email.md) - Email system
-   [Storage](./docs/storage.md) - File storage
-   [i18n](./docs/i18n.md) - Internationalization
-   [Payments](./docs/payments.md) - Stripe integration

## Recommendations

### ✅ Use This For:

-   Learning SaaS backend architecture
-   Building your own frontend on this backend
-   Understanding authentication flows
-   Reference for email/storage integration

### ❌ Don't Use This For:

-   Production SaaS application (no frontend)
-   Quick deployment (missing critical features)
-   Out-of-the-box solution (requires significant work)

## Next Steps to Complete

1. **UI Components** - Install Shadcn UI
2. **Auth Pages** - Create login, signup pages
3. **Dashboard** - Build main SaaS dashboard
4. **Settings Pages** - Create profile, security, billing pages
5. **API Setup** - Configure ORPC properly
6. **Testing** - Add E2E tests

**Estimated:** 4-5 weeks of full-time development

## Contributing

See [CURRENT_STATUS.md](./CURRENT_STATUS.md) for what needs to be implemented.

## License

MIT
