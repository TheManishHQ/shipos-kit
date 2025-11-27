# Setup Guide

This guide walks you through setting up Shipos Kit for development.

⚠️ **Important:** This project is ~35% complete. See [Implementation Status](./implementation-status.md) for what's actually working before you begin.

## Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** 18.x or higher
-   **pnpm** 8.x or higher
-   **PostgreSQL** 14.x or higher
-   **Git**

### Installing Prerequisites

**Node.js and pnpm:**

```bash
# Install Node.js (using nvm)
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm
```

**PostgreSQL:**

```bash
# macOS (using Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt-get install postgresql-14

# Windows
# Download from https://www.postgresql.org/download/windows/
```

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shipos-kit
```

### 2. Install Dependencies

Install all workspace dependencies:

```bash
pnpm install
```

This will:

-   Install dependencies for all packages
-   Link workspace packages together
-   Set up TypeScript configurations

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the required variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/shipos

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Generate a secure auth secret:**

```bash
openssl rand -base64 32
```

### 4. Set Up the Database

Create the database:

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE shipos;

# Exit psql
\q
```

Generate Prisma client:

```bash
pnpm db:generate
```

Run database migrations:

```bash
pnpm db:migrate
```

### 5. Start Development Server

Start the development server:

```bash
pnpm dev
```

The application will be available at:

-   **Web App**: http://localhost:3000
-   **API**: http://localhost:3000/api

## Verification

### Check Installation

Verify everything is working:

```bash
# Check TypeScript compilation
pnpm type-check

# Check linting
pnpm lint

# Check formatting
pnpm format:check
```

### Test Database Connection

Open Prisma Studio to verify database connection:

```bash
pnpm db:studio
```

This opens a GUI at http://localhost:5555 where you can view and edit database records.

## Development Workflow

### Available Scripts

From the root directory:

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run linter
pnpm format           # Format code
pnpm format:check     # Check formatting
pnpm type-check       # Check TypeScript types

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema changes (dev only)
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database (WARNING: deletes data)

# Testing
pnpm test             # Run tests (when implemented)
pnpm test:e2e         # Run E2E tests (when implemented)
```

### Package-Specific Scripts

Run scripts in specific packages:

```bash
# Run script in web app
pnpm --filter web dev

# Run script in auth package
pnpm --filter @shipos/auth build
```

## Project Structure

```
shipos-kit/
├── apps/
│   └── web/              # Next.js application
│       ├── app/          # App Router pages
│       ├── components/   # React components
│       ├── lib/          # Utilities
│       └── modules/      # Feature modules
│           ├── analytics/    # Analytics integration
│           ├── marketing/    # Marketing pages
│           ├── saas/         # SaaS application
│           ├── ui/           # UI components
│           ├── i18n/         # Internationalization
│           └── shared/       # Shared utilities
├── packages/
│   ├── auth/             # Authentication
│   ├── database/         # Prisma database
│   ├── config/           # Configuration
│   ├── utils/            # Utilities
│   └── logs/             # Logging
├── config/               # App configuration
├── tooling/              # Shared configs
│   ├── typescript/       # TypeScript configs
│   └── tailwind/         # Tailwind theme
├── docs/                 # Documentation
└── .gitignore            # Git ignore rules
```

## Git Configuration

The project uses `.gitignore` to exclude files from version control:

**Ignored directories:**

-   `node_modules/` - Dependencies (managed by pnpm)
-   `.next/`, `out/` - Next.js build output
-   `build/`, `dist/` - Production builds
-   `.turbo/` - Turborepo cache
-   `.vscode/`, `.idea/` - IDE configurations
-   `.vercel/` - Vercel deployment files
-   `prisma/migrations/` - Database migrations (generated)
-   `/reference/` - Reference implementation

**Ignored files:**

-   `.env*` - Environment variables (except `.env.example`)
-   `*.tsbuildinfo` - TypeScript build info
-   `*.log*` - Debug logs
-   `.DS_Store` - macOS system files
-   `*.pem` - Certificate files

**Committed files:**

-   `.env.example` - Environment variable template
-   Source code and configuration
-   Documentation

## Common Issues

### TypeScript Errors

**Issue: "Cannot find module '@shipos/...'"**

Solution: Install dependencies and generate Prisma client:

```bash
pnpm install
pnpm db:generate
```

**Issue: "File '@repo/tsconfig/base.json' not found"**

Solution: Ensure all workspace packages are installed:

```bash
pnpm install
```

### Database Issues

**Issue: "Can't reach database server"**

Solution: Verify PostgreSQL is running and DATABASE_URL is correct:

```bash
# Check PostgreSQL status
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Test connection
psql $DATABASE_URL
```

**Issue: "Prisma Client not generated"**

Solution: Generate the Prisma client:

```bash
pnpm db:generate
```

**Issue: "Migration failed"**

Solution: Reset the database (WARNING: deletes all data):

```bash
pnpm db:reset
```

### Port Already in Use

**Issue: "Port 3000 is already in use"**

Solution: Kill the process using port 3000:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

## OAuth Setup (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret to `.env`

## Next Steps

Now that you have Shipos Kit set up, explore the documentation:

-   [Configuration](./configuration.md) - Customize feature flags and settings
-   [Authentication](./authentication.md) - Learn about the auth system
-   [Database](./database.md) - Understand the database schema
-   [Utilities](./utilities.md) - Use shared utility functions
-   [Logging](./logging.md) - Implement structured logging

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#common-issues) section above
2. Review the relevant documentation
3. Check the GitHub issues
4. Ask for help in the community

## Production Deployment

For production deployment instructions, see:

-   [Deployment Guide](./deployment.md) (coming soon)
-   [Environment Variables](./configuration.md#environment-variables)
-   [Database Migrations](./database.md#migrations)
