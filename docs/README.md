# Shipos Kit Documentation

Welcome to the Shipos Kit documentation. This is a production-ready SaaS starter kit built with Next.js 15, React 19, and TypeScript.

## Documentation Structure

-   [Authentication](./authentication.md) - Authentication system with better-auth
-   [Database](./database.md) - Prisma database setup and schema
-   [Configuration](./configuration.md) - Application configuration and feature flags
-   [API](./api.md) - Type-safe API with ORPC (coming soon)
-   [Payments](./payments.md) - Payment provider integration (coming soon)
-   [AI](./ai.md) - AI chat system with OpenAI (coming soon)
-   [Email](./email.md) - Email system and templates (coming soon)
-   [Storage](./storage.md) - File storage with S3 (coming soon)
-   [Internationalization](./i18n.md) - Multi-language support (coming soon)

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

## Key Features

-   🔐 **Authentication** - Email/password, magic links, OAuth, passkeys, 2FA
-   💳 **Payments** - Stripe and DodoPayments integration
-   🤖 **AI** - OpenAI integration for chat and image generation
-   🌍 **i18n** - Multi-language support with next-intl
-   📧 **Email** - Transactional emails with React Email
-   📦 **Storage** - S3-compatible file storage
-   🎨 **UI** - Shadcn UI + Radix UI + Tailwind CSS
-   🔒 **Security** - Best practices for auth, payments, and data protection

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
