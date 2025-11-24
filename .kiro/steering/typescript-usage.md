---
inclusion: always
---

# TypeScript Usage

This document describes how to use TypeScript across the Shipos Kit project.

## General Rules

-   Use TypeScript for all code
-   Enable strict mode (already configured in tsconfig)
-   Prefer interfaces over types for object shapes
-   Use type aliases for unions, intersections, and utility types

## Interfaces vs Types

```typescript
// Good - Use interfaces for object shapes
interface User {
	id: string;
	name: string;
	email: string;
}

// Good - Use types for unions and utilities
type Status = "pending" | "active" | "inactive";
type PartialUser = Partial<User>;

// Avoid - Don't use types for simple object shapes
type User = {
	id: string;
	name: string;
};
```

## Enums

-   Avoid enums; use maps or const objects instead
-   Enums have runtime overhead and can cause issues

```typescript
// Good - Use const object
const UserRole = {
	ADMIN: "admin",
	USER: "user",
	GUEST: "guest",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Avoid - Don't use enums
enum UserRole {
	ADMIN = "admin",
	USER = "user",
	GUEST = "guest",
}
```

## Components

-   Use functional components with TypeScript interfaces
-   Define prop interfaces inline or separately

```typescript
interface ButtonProps {
	variant?: "primary" | "secondary";
	size?: "sm" | "md" | "lg";
	onClick?: () => void;
	children: React.ReactNode;
}

export function Button({
	variant = "primary",
	size = "md",
	onClick,
	children,
}: ButtonProps) {
	return (
		<button
			className={cn(buttonVariants({ variant, size }))}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
```

## Type Safety

-   Avoid `any` type; use `unknown` if type is truly unknown
-   Use type guards for runtime type checking
-   Leverage TypeScript's inference when possible
