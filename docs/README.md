# Shipos Kit Documentation

Welcome to the Shipos Kit documentation. This is a production-ready SaaS starter kit built with Next.js 15, React 19, and TypeScript.

## ⚠️ Important: Read This First

**This project is ~35% complete.** See [CURRENT_STATUS.md](../CURRENT_STATUS.md) for an honest assessment.

## Documentation Structure

📖 **New to the docs?** Read [About This Documentation](./about-documentation.md) to understand how the documentation is organized.

### Getting Started

-   [Current Status](../CURRENT_STATUS.md) - **READ THIS FIRST** - Honest assessment ⚠️
-   [Implementation Status](./implementation-status.md) - Detailed breakdown of what's working
-   [Quick Start Guide](./quick-start.md) - Get up and running in minutes ⚡
-   [Setup Guide](./setup.md) - Detailed installation and initial setup
-   [Development Guide](./development.md) - Development workflow and best practices
-   [Biome](./biome.md) - Linting and formatting with Biome

### Core Systems

-   [Authentication](./authentication.md) - Authentication system with better-auth
-   [Database](./database.md) - Prisma database setup and schema
-   [Configuration](./configuration.md) - Application configuration and feature flags
-   [User Management](./user-management.md) - User account and profile management

### Development Tools

-   [Biome](./biome.md) - Linting and formatting with Biome
-   [TypeScript](./typescript.md) - TypeScript configuration and path aliases
-   [Utilities](./utilities.md) - Shared utility functions and helpers
-   [Logging](./logging.md) - Structured logging system

### Infrastructure

-   [Storage](./storage.md) - File storage with S3-compatible providers (✅ Implemented)
-   [Email](./email.md) - Email system and templates (✅ Implemented)
-   [Internationalization](./i18n.md) - Multi-language support with next-intl (✅ Implemented)

### Payments & Subscriptions

-   [Payments](./payments.md) - Payment provider integration with Stripe (✅ Implemented)

### Coming Soon

-   [API](./api.md) - Type-safe API with ORPC
-   [AI](./ai.md) - AI chat system with OpenAI

## Quick Start

### Prerequisites

-   Node.js 18+ and pnpm
-   PostgreSQL database
-   Environment variables configured (see `.env.example`)

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/shipos
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

## Project Structure

```
shipos-kit/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── auth/             # Authentication system
│   ├── database/         # Prisma database
│   ├── config/           # Configuration
│   └── utils/            # Shared utilities
├── config/               # App configuration
└── tooling/              # Shared tooling configs
```

## ⚠️ Project Status: ~35% Complete

**This is a work-in-progress foundation, not a complete SaaS starter kit.**

See [Implementation Status](./implementation-status.md) for detailed breakdown.

### ✅ What's Working (Backend/Infrastructure)

-   🔐 **Authentication** - Email/password, magic links, OAuth (Google, GitHub), passkeys
-   📧 **Email** - Transactional emails with React Email and Resend
-   📦 **Storage** - S3-compatible file storage with presigned URLs
-   🌍 **i18n** - Multi-language support with next-intl (English, German)
-   👤 **User Management** - Profile updates, avatar upload, session management (backend only)
-   🗄️ **Database** - Prisma ORM with PostgreSQL (complete schema)
-   ⚙️ **Configuration** - Centralized config with feature flags
-   📝 **Logging** - Structured JSON logging
-   🛠️ **Development** - Biome for linting/formatting, TypeScript strict mode

### ❌ What's Missing (Frontend/Features)

-   🚫 **No Dashboard** - No SaaS application pages
-   🚫 **No Settings UI** - Backend works, but no frontend pages
-   🚫 **No UI Components** - No Shadcn UI component library
-   🚫 **No Theme Switcher** - No dark mode functionality
-   🚫 **No Marketing Pages** - No homepage, pricing, blog
-   🚫 **No Payments** - Stripe/DodoPayments not integrated
-   🚫 **No AI** - OpenAI not integrated
-   🚫 **No API** - ORPC not set up
-   🚫 **No Tests** - No test suite

## Development

### Available Scripts

-   `pnpm dev` - Start development server
-   `pnpm build` - Build for production
-   `pnpm start` - Start production server
-   `pnpm lint` - Run linter
-   `pnpm format` - Format code
-   `pnpm type-check` - Check TypeScript types

### Monorepo Structure

This project uses pnpm workspaces and Turborepo for efficient monorepo management. Each package in `packages/` is independently versioned and can be developed in isolation.

## Contributing

See individual package documentation for contribution guidelines.

## License

MIT
