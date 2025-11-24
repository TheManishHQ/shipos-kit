---
inclusion: always
---

# UI and Styling

This document describes guidelines for creating UI and styling components in Shipos Kit.

## Component Libraries

-   Use Shadcn UI for pre-built components
-   Use Radix UI for accessible primitives
-   Use Tailwind CSS 4 for styling

## Responsive Design

-   Implement responsive design with Tailwind CSS
-   Use a mobile-first approach
-   Start with mobile styles, then add breakpoints for larger screens

```typescript
// Mobile-first approach
<div className="flex flex-col md:flex-row lg:gap-8">
	<aside className="w-full md:w-64">Sidebar</aside>
	<main className="flex-1">Content</main>
</div>
```

## Class Name Utilities

-   Use the `cn` function for class name concatenation
-   Combine conditional classes cleanly

```typescript
import { cn } from "@/lib/utils";

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

## Theme Variables

-   Global theme variables are defined in `tooling/tailwind/theme.css`
-   Use CSS variables for colors and design tokens
-   Support both light and dark modes

```css
/* Access theme variables */
.custom-component {
	background-color: hsl(var(--background));
	color: hsl(var(--foreground));
}
```

## Tailwind Configuration

-   Extend Tailwind config when needed
-   Use semantic color names (primary, secondary, accent, etc.)
-   Leverage Tailwind's utility classes for consistency

## Accessibility

-   Use Radix UI primitives for built-in accessibility
-   Include proper ARIA labels
-   Ensure keyboard navigation works
-   Test with screen readers
