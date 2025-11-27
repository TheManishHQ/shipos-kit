# Utilities

The utilities package (`@shipos/utils`) provides shared helper functions used across the application.

## Overview

The utilities package provides:

-   Class name merging with Tailwind CSS
-   URL generation helpers
-   Type-safe utility functions

## Architecture

```
packages/utils/
├── lib/
│   ├── cn.ts           # Class name utility
│   └── url.ts          # URL helpers
├── index.ts            # Package exports
├── package.json
└── tsconfig.json
```

## Class Name Utility

### `cn()` Function

Merges class names with Tailwind CSS conflict resolution.

**Usage:**

```typescript
import { cn } from "@shipos/utils";

function Button({ variant, className }: ButtonProps) {
	return (
		<button
			className={cn(
				"rounded-md px-4 py-2",
				variant === "primary" && "bg-primary text-primary-foreground",
				variant === "secondary" &&
					"bg-secondary text-secondary-foreground",
				className
			)}
		>
			Click me
		</button>
	);
}
```

**Features:**

-   Combines multiple class names
-   Resolves Tailwind CSS conflicts (last class wins)
-   Handles conditional classes
-   Supports arrays and objects

**Implementation:**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

**Examples:**

```typescript
// Basic usage
cn("text-red-500", "font-bold");
// => 'text-red-500 font-bold'

// Conditional classes
cn("base-class", isActive && "active-class");
// => 'base-class active-class' (if isActive is true)

// Tailwind conflict resolution
cn("text-red-500", "text-blue-500");
// => 'text-blue-500' (last color wins)

// Array syntax
cn(["text-sm", "font-medium"], "text-gray-600");
// => 'text-sm font-medium text-gray-600'

// Object syntax
cn({
	"text-red-500": hasError,
	"text-green-500": isSuccess,
});
// => 'text-red-500' (if hasError is true)
```

## URL Helpers

### `getBaseUrl()` Function

Returns the application's base URL based on environment.

**Usage:**

```typescript
import { getBaseUrl } from "@shipos/utils";

const baseUrl = getBaseUrl();
// => 'http://localhost:3000' (development)
// => 'https://app.example.com' (production)
```

**Logic:**

1. **Browser**: Returns `window.location.origin`
2. **Server with BETTER_AUTH_URL**: Returns environment variable value
3. **Vercel**: Returns `https://${VERCEL_URL}`
4. **Fallback**: Returns `http://localhost:3000`

**Implementation:**

```typescript
export function getBaseUrl(): string {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}

	if (process.env.BETTER_AUTH_URL) {
		return process.env.BETTER_AUTH_URL;
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return "http://localhost:3000";
}
```

### `getApiUrl()` Function

Returns the API endpoint URL.

**Usage:**

```typescript
import { getApiUrl } from "@shipos/utils";

const apiUrl = getApiUrl();
// => 'http://localhost:3000/api' (development)
// => 'https://app.example.com/api' (production)
```

**Implementation:**

```typescript
export function getApiUrl(): string {
	return `${getBaseUrl()}/api`;
}
```

## Environment Variables

The URL helpers use these environment variables:

```bash
# Base URL for authentication and API calls
BETTER_AUTH_URL=https://app.example.com

# Vercel deployment URL (automatically set by Vercel)
VERCEL_URL=app-name.vercel.app
```

## Usage Examples

### Component Styling

```typescript
import { cn } from "@shipos/utils";

interface CardProps {
	variant?: "default" | "outlined" | "elevated";
	className?: string;
	children: React.ReactNode;
}

export function Card({ variant = "default", className, children }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-lg p-4",
				variant === "default" && "bg-card text-card-foreground",
				variant === "outlined" && "border border-border",
				variant === "elevated" && "shadow-lg",
				className
			)}
		>
			{children}
		</div>
	);
}
```

### API Client

```typescript
import { getApiUrl } from "@shipos/utils";

export async function fetchUser(userId: string) {
	const response = await fetch(`${getApiUrl()}/users/${userId}`);
	return response.json();
}
```

### Dynamic Links

```typescript
import { getBaseUrl } from "@shipos/utils";

export function generateVerificationLink(token: string): string {
	return `${getBaseUrl()}/auth/verify?token=${token}`;
}
```

## Best Practices

### Class Name Merging

**Do:**

-   Use `cn()` for all dynamic class names
-   Place base classes first, then variants, then custom classes
-   Use conditional classes for state-based styling

```typescript
// Good
cn("base-class", variant === "primary" && "variant-class", className);
```

**Don't:**

-   Manually concatenate class strings
-   Use template literals for Tailwind classes

```typescript
// Avoid
`base-class ${variant === "primary" ? "variant-class" : ""} ${className}`;
```

### URL Generation

**Do:**

-   Use `getBaseUrl()` for absolute URLs
-   Use `getApiUrl()` for API endpoints
-   Set BETTER_AUTH_URL in production

```typescript
// Good
const url = `${getApiUrl()}/users`;
```

**Don't:**

-   Hardcode URLs
-   Use relative URLs for external requests

```typescript
// Avoid
const url = "http://localhost:3000/api/users";
```

## Type Definitions

### ClassValue

From `clsx` package:

```typescript
type ClassValue =
	| ClassArray
	| ClassDictionary
	| string
	| number
	| null
	| boolean
	| undefined;

type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];
```

## Adding New Utilities

To add a new utility function:

1. Create a new file in `packages/utils/lib/`:

```typescript
// packages/utils/lib/format-date.ts
export function formatDate(date: Date, locale: string = "en"): string {
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}
```

2. Export from `packages/utils/index.ts`:

```typescript
export * from "./lib/cn";
export * from "./lib/url";
export * from "./lib/format-date";
```

3. Use in your application:

```typescript
import { formatDate } from "@shipos/utils";

const formatted = formatDate(new Date(), "en");
```

## Troubleshooting

### Common Issues

**Issue: "Cannot find module '@shipos/utils'"**

-   Solution: Ensure package is installed and workspace is configured

**Issue: "Tailwind classes not working with cn()"**

-   Solution: Verify Tailwind CSS is configured and classes are valid

**Issue: "getBaseUrl() returns localhost in production"**

-   Solution: Set BETTER_AUTH_URL environment variable

## Next Steps

-   [UI and Styling](./ui-styling.md) - Learn about component styling
-   [Configuration](./configuration.md) - Configure application settings
-   [Authentication](./authentication.md) - Build auth flows with URL helpers
