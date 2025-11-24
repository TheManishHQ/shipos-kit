---
inclusion: always
---

# Naming Conventions

This document describes naming conventions for files, folders, components, and methods.

## Directory Names

-   Use lowercase with dashes for directories
-   Examples: `components/auth-wizard`, `lib/api-client`, `modules/user-settings`

## Component Names

-   Use PascalCase for component names
-   Examples: `UserProfile`, `AuthWizard`, `PaymentForm`
-   File names should match component names: `UserProfile.tsx`

## Variables and Methods

-   Use camelCase for variables and method names
-   Examples: `isLoading`, `hasError`, `fetchUserData`, `handleSubmit`

## Exports

-   Favor named exports for components
-   Example: `export function UserProfile() { ... }`
-   Avoid default exports except for pages and layouts
