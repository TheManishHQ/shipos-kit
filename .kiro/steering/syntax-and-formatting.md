---
inclusion: always
---

# Syntax and Formatting

This document describes syntax and formatting rules used across the codebase.

## Function Declarations

-   Use the `function` keyword for pure functions
-   Example:
    ```typescript
    function calculateTotal(items: Item[]): number {
    	return items.reduce((sum, item) => sum + item.price, 0);
    }
    ```

## Conditionals

-   Avoid unnecessary curly braces in conditionals
-   Use concise syntax for simple statements
-   Example:

    ```typescript
    // Good
    if (isLoading) return <Spinner />;

    // Avoid
    if (isLoading) {
    	return <Spinner />;
    }
    ```

## JSX

-   Use declarative JSX
-   Keep JSX clean and readable
-   Extract complex logic into helper functions
-   Example:
    ```typescript
    function UserCard({ user }: { user: User }) {
    	const displayName = getDisplayName(user);
    	const avatarUrl = getAvatarUrl(user);

    	return (
    		<div className="card">
    			<img src={avatarUrl} alt={displayName} />
    			<h3>{displayName}</h3>
    		</div>
    	);
    }
    ```

## Code Organization

-   Keep files focused and modular
-   Extract reusable logic into separate functions
-   Use early returns to reduce nesting
