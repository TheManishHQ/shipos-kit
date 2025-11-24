---
inclusion: always
---

# Project Structure

This document describes the project structure of Shipos Kit and where to find or add different parts of the application.

## Monorepo Structure

```
shipos-kit/
├── apps/
│   └── web/              # Next.js 15 App Router application
├── packages/
│   ├── ai/               # AI integration (OpenAI)
│   ├── api/              # ORPC API routes
│   ├── auth/             # better-auth configuration
│   ├── database/         # Prisma schema and client
│   ├── i18n/             # Internationalization
│   ├── logs/             # Logging utilities
│   ├── mail/             # Email templates and providers
│   ├── payments/         # Payment providers (Stripe, DodoPayments)
│   ├── storage/          # File storage (S3)
│   └── utils/            # Shared utilities
├── config/               # Application configuration
└── tooling/              # Shared tooling configs
    ├── typescript/       # TypeScript configs
    └── tailwind/         # Tailwind theme
```

## Frontend Code

-   **Location**: `apps/web/app/`
-   **Purpose**: Next.js App Router application
-   **Contains**: Pages, layouts, components, client-side logic
-   Put all frontend-only code in this directory

## Backend Logic

Put all backend logic into the appropriate `packages/` directory:

### `packages/ai`

-   AI-related code
-   OpenAI integration
-   Chat functionality

### `packages/api`

-   ORPC API routes
-   Type-safe API definitions
-   API middleware

### `packages/auth`

-   better-auth configuration
-   Authentication helpers
-   Session management

### `packages/database`

-   Prisma schema
-   Database client
-   Auto-generated types
-   Query helpers

### `packages/i18n`

-   Translation files
-   Internationalization helpers
-   Locale management

### `packages/logs`

-   Logging configuration
-   Logger utilities

### `packages/mail`

-   Email providers
-   Email templates (React Email)
-   Email sending logic

### `packages/payments`

-   Payment provider implementations
-   Stripe integration
-   DodoPayments integration
-   Webhook handlers

### `packages/storage`

-   File storage providers
-   S3 integration
-   Upload/download helpers

### `packages/utils`

-   Shared utility functions
-   Common helpers

### `config`

-   Application configuration
-   Feature flags
-   Environment-specific settings

## Adding New Features

1. **Frontend feature**: Add to `apps/web/app/` or `apps/web/components/`
2. **Backend logic**: Add to appropriate `packages/` directory
3. **Shared types**: Add to relevant package or `packages/utils`
4. **Configuration**: Add to `config/index.ts`
