# TypeScript Configuration

The project uses TypeScript for type safety across all packages and applications. This guide covers the TypeScript setup, path aliases, and best practices.

## Overview

TypeScript provides:

-   Type safety across the entire codebase
-   Intelligent code completion
-   Compile-time error detection
-   Better refactoring support
-   Self-documenting code

## Configuration Structure

### Base Configuration

The project uses shared TypeScript configurations in `tooling/typescript/`:

```
tooling/typescript/
├── base.json           # Base TypeScript config
├── nextjs.json         # Next.js-specific config
└── react-library.json  # React library config
```

### Web App Configuration

The web application extends the Next.js configuration:

```json
{
	"extends": "@repo/tsconfig/nextjs.json",
	"compilerOptions": {
		"plugins": [{ "name": "next" }],
		"paths": {
			// Path aliases
		}
	},
	"include": [
		"next-env.d.ts",
		"**/*.ts",
		"**/*.tsx",
		"**/*.cjs",
		"**/*.mjs",
		".next/types/**/*.ts"
	],
	"exclude": ["node_modules"]
}
```

## Path Aliases

Path aliases simplify imports and make code more maintainable.

### Available Aliases

#### Root Aliases

```typescript
// @/* - Root of web app
import { Component } from "@/components/Component";
import { helper } from "@/lib/helper";

// @repo/* or @shipos/* - Workspace packages
import { prisma } from "@repo/database";
import { logger } from "@shipos/logs";
import { authClient } from "@shipos/auth";

// @config - Application configuration
import { config } from "@config";
```

#### Module Aliases

```typescript
// @analytics - Analytics module
import { trackEvent } from "@analytics";

// @marketing/* - Marketing pages and components
import { Hero } from "@marketing/components/Hero";
import { PricingTable } from "@marketing/components/PricingTable";

// @saas/* - SaaS application modules
import { useSession } from "@saas/auth/hooks/use-session";
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { UserAvatarForm } from "@saas/settings/components/UserAvatarForm";

// @ui/* - UI component library
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Form } from "@ui/components/form";

// @i18n or @i18n/* - Internationalization
import { useTranslations } from "@i18n";
import { getMessages } from "@i18n/lib/messages";

// @shared/* - Shared utilities and components
import { UserAvatar } from "@shared/components/UserAvatar";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useRouter } from "@shared/hooks/router";
```

### Module Structure

The web app is organized into feature modules:

```
apps/web/modules/
├── analytics/          # Analytics integration (@analytics)
├── marketing/          # Marketing pages (@marketing/*)
│   ├── components/
│   ├── lib/
│   └── hooks/
├── saas/              # SaaS application (@saas/*)
│   ├── auth/          # Authentication UI
│   ├── settings/      # User settings
│   └── shared/        # Shared SaaS components
├── ui/                # UI components (@ui/*)
│   ├── components/    # Shadcn UI components
│   └── lib/           # UI utilities
├── i18n/              # Internationalization (@i18n/*)
│   └── lib/
└── shared/            # Shared utilities (@shared/*)
    ├── components/    # Shared components
    ├── hooks/         # Shared hooks
    └── lib/           # Shared utilities
```

## Usage Examples

### Importing Components

```typescript
// UI components
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Card } from "@ui/components/card";

// Shared components
import { UserAvatar } from "@shared/components/UserAvatar";
import { Spinner } from "@shared/components/Spinner";

// SaaS components
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { UserAvatarForm } from "@saas/settings/components/UserAvatarForm";
```

### Importing Utilities

```typescript
// Workspace packages
import { prisma } from "@shipos/database";
import { logger } from "@shipos/logs";
import { cn } from "@shipos/utils";

// Configuration
import { config } from "@config";

// Shared utilities
import { orpc } from "@shared/lib/orpc-query-utils";
import { queryClient } from "@shared/lib/query-client";
```

### Importing Hooks

```typescript
// SaaS hooks
import { useSession } from "@saas/auth/hooks/use-session";

// Shared hooks
import { useRouter } from "@shared/hooks/router";
import { useCookieConsent } from "@shared/hooks/cookie-consent";

// i18n hooks
import { useTranslations } from "next-intl";
```

## Type Definitions

### Generating Types

```bash
# Generate Prisma types
pnpm db:generate

# Type check entire project
pnpm type-check
```

### Using Generated Types

```typescript
// Prisma types
import type { User, Session, Purchase } from "@prisma/client";

// Auth types
import type { Session as AuthSession } from "@shipos/auth";

// Config types
import type { Config } from "@config/types";
```

### Custom Type Definitions

Create type definition files for custom types:

```typescript
// types/index.ts
export interface UserProfile {
	id: string;
	name: string;
	email: string;
	avatar?: string;
}

export type UserRole = "admin" | "user" | "guest";
```

## Strict Mode

The project uses TypeScript strict mode for maximum type safety:

```json
{
	"compilerOptions": {
		"strict": true,
		"noUncheckedIndexedAccess": true,
		"noImplicitAny": true,
		"strictNullChecks": true,
		"strictFunctionTypes": true
	}
}
```

### Handling Strict Mode

```typescript
// Good - Explicit null checks
function getUserName(user: User | null): string {
	if (!user) return "Guest";
	return user.name;
}

// Good - Optional chaining
const email = user?.email ?? "no-email@example.com";

// Avoid - Non-null assertion (use sparingly)
const name = user!.name; // Only when you're certain user exists
```

## File Inclusion

The TypeScript configuration includes:

```json
{
	"include": [
		"next-env.d.ts", // Next.js type definitions
		"**/*.ts", // TypeScript files
		"**/*.tsx", // TypeScript React files
		"**/*.cjs", // CommonJS files
		"**/*.mjs", // ES modules
		".next/types/**/*.ts" // Next.js generated types
	]
}
```

## Best Practices

### Use Path Aliases

```typescript
// Good - Use path aliases
import { Button } from "@ui/components/button";
import { useSession } from "@saas/auth/hooks/use-session";

// Avoid - Relative imports for distant files
import { Button } from "../../../modules/ui/components/button";
```

### Organize Imports

```typescript
// 1. External dependencies
import { useState } from "react";
import { useTranslations } from "next-intl";

// 2. Workspace packages
import { prisma } from "@shipos/database";
import { logger } from "@shipos/logs";

// 3. Module imports
import { Button } from "@ui/components/button";
import { useSession } from "@saas/auth/hooks/use-session";

// 4. Relative imports
import { helper } from "./helper";
```

### Type Imports

Use `type` keyword for type-only imports:

```typescript
// Good - Type-only import
import type { User } from "@prisma/client";
import type { Config } from "@config/types";

// Also good - Inline type import
import { type User, prisma } from "@shipos/database";
```

### Avoid `any` Type

```typescript
// Good - Use specific types
function processUser(user: User): void {
	logger.info("Processing user", { userId: user.id });
}

// Good - Use unknown for truly unknown types
function handleError(error: unknown): void {
	if (error instanceof Error) {
		logger.error("Error occurred", error);
	}
}

// Avoid - Using any
function processData(data: any): void {
	// Type safety lost
}
```

## IDE Integration

### VS Code

TypeScript works automatically with VS Code. The project includes a `.vscode/settings.json` file with recommended settings:

**Key TypeScript Settings:**

```json
{
	"typescript.tsdk": "node_modules/typescript/lib",
	"typescript.enablePromptUseWorkspaceTsdk": true,
	"typescript.autoClosingTags": false,
	"editor.codeActionsOnSave": {
		"source.organizeImports.biome": "explicit"
	}
}
```

**Settings Explanation:**

-   `typescript.tsdk` - Use workspace TypeScript version for consistency
-   `typescript.enablePromptUseWorkspaceTsdk` - Prompt to use workspace TS
-   `typescript.autoClosingTags` - Disabled to prevent conflicts with Biome formatting
-   `editor.codeActionsOnSave` - Auto-organize imports with Biome on save

**Note:** The `.vscode/settings.json` file is committed to the repository to ensure consistent settings across the team.

### Path Alias Autocomplete

Path aliases provide autocomplete in your IDE:

1. Type `@ui/` - Shows available UI components
2. Type `@saas/` - Shows SaaS modules
3. Type `@shared/` - Shows shared utilities

## Troubleshooting

### Common Issues

**Issue: "Cannot find module '@ui/components/button'"**

Solution: Ensure TypeScript configuration is correct and restart your IDE:

```bash
# Restart TypeScript server in VS Code
# Command Palette > TypeScript: Restart TS Server
```

**Issue: "Type errors after adding new package"**

Solution: Regenerate types and restart TypeScript:

```bash
pnpm install
pnpm db:generate
# Restart IDE or TS server
```

**Issue: "Path alias not resolving"**

Solution: Check `tsconfig.json` paths configuration and ensure the module exists:

```json
{
	"compilerOptions": {
		"paths": {
			"@ui/*": ["./modules/ui/*"]
		}
	}
}
```

**Issue: "Types not updating after schema change"**

Solution: Regenerate Prisma client:

```bash
pnpm db:generate
```

## Adding New Path Aliases

To add a new path alias:

1. Update `apps/web/tsconfig.json`:

```json
{
	"compilerOptions": {
		"paths": {
			"@newmodule/*": ["./modules/newmodule/*"]
		}
	}
}
```

2. Create the module directory:

```bash
mkdir -p apps/web/modules/newmodule
```

3. Restart TypeScript server in your IDE

4. Use the new alias:

```typescript
import { Component } from "@newmodule/components/Component";
```

## Type Checking

### Manual Type Check

```bash
# Check types in entire project
pnpm type-check

# Check types in specific package
pnpm --filter web type-check
```

### Continuous Type Checking

```bash
# Watch mode for type checking
pnpm type-check --watch
```

### Pre-commit Type Checking

Type checking runs automatically before commits via Husky hooks.

## Next Steps

-   [Development Guide](./development.md) - Development workflow
-   [Setup Guide](./setup.md) - Initial project setup
-   [Project Structure](../reference/.cursor/rules/project-structure.mdc) - Project organization

## Resources

-   [TypeScript Documentation](https://www.typescriptlang.org/docs/)
-   [Next.js TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
-   [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
