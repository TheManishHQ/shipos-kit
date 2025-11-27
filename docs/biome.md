# Biome - Linting and Formatting

Shipos Kit uses [Biome](https://biomejs.dev/) v2.2.2 as the primary toolchain for code linting and formatting. Biome is a fast, all-in-one tool that replaces ESLint and Prettier.

## Overview

Biome provides:

-   Fast linting and formatting (written in Rust)
-   Automatic code fixes
-   Import organization
-   EditorConfig integration
-   Git/VCS integration
-   Consistent code style enforcement

## Configuration

### Root Configuration

The main configuration is in `biome.json` at the project root:

```json
{
	"$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
	"formatter": {
		"enabled": true,
		"useEditorconfig": true
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true
			// Custom rule overrides
		}
	},
	"assist": {
		"actions": {
			"source": {
				"organizeImports": "on"
			}
		}
	},
	"vcs": {
		"enabled": true,
		"clientKind": "git",
		"defaultBranch": "main",
		"useIgnoreFile": true
	}
}
```

### Package-Level Configuration

Individual packages extend the root configuration:

```json
// apps/web/biome.json
{
	"$schema": "../../node_modules/@biomejs/biome/configuration_schema.json",
	"extends": ["../../biome.json"]
}
```

This allows packages to inherit the base configuration while adding package-specific overrides if needed.

**Note:** Packages no longer need to specify `files.include` patterns as they inherit the default file discovery from the root configuration. Only add file patterns if you need to override the default behavior.

## Linting Rules

### Recommended Rules

All recommended Biome rules are enabled by default, providing a solid baseline for code quality.

### Correctness Rules

**Error Level:**

-   `noUnusedImports` - Remove unused imports automatically
    -   Level: `error`
    -   Fix: `safe` (auto-fixable)

**Warning Level:**

-   `noUnusedFunctionParameters` - Warn about unused function parameters

**Disabled:**

-   `useExhaustiveDependencies` - React hook dependencies not enforced
-   `useUniqueElementIds` - Allows duplicate element IDs

### Style Rules

**Error Level (Auto-fixable):**

-   `noUnusedTemplateLiteral` - Remove unnecessary template literals
-   `noParameterAssign` - Prevent parameter reassignment
-   `useAsConstAssertion` - Enforce `as const` for literal types
-   `useDefaultParameterLast` - Default parameters must be last
-   `useEnumInitializers` - Require enum initializers
-   `useSelfClosingElements` - Use self-closing JSX elements
-   `useSingleVarDeclarator` - One variable per declaration
-   `useNumberNamespace` - Use Number namespace methods
-   `noInferrableTypes` - Remove redundant type annotations
-   `noUselessElse` - Remove unnecessary else blocks

**Warning Level:**

-   `noNonNullAssertion` - Warn on non-null assertions (`!`)
-   `useBlockStatements` - Prefer block statements in conditionals

### Suspicious Rules

**Disabled:**

-   `noExplicitAny` - Allows `any` type when necessary
-   `noArrayIndexKey` - Allows array index as React key

### Complexity Rules

**Disabled:**

-   `noForEach` - Allows `.forEach()` method

## Formatting

### General Formatting

-   Uses EditorConfig settings (`.editorconfig`)
-   Consistent indentation and spacing
-   Automatic semicolon insertion
-   Import organization

### CSS Formatting

CSS formatting and linting are **disabled** in Biome:

```json
"css": {
  "formatter": {
    "enabled": false
  },
  "linter": {
    "enabled": false
  }
}
```

**Why:** Tailwind CSS classes should not be formatted, as their order can affect specificity.

## File Handling

### Included Files

Biome processes all files by default, with specific exclusions:

```json
"files": {
  "includes": ["**", "!zod/index.ts", "!tailwind-animate.css"]
}
```

### Excluded Files

-   `zod/index.ts` - Auto-generated Zod schemas
-   `tailwind-animate.css` - Tailwind animation styles
-   Files in `.gitignore` (via VCS integration)

## VCS Integration

Biome integrates with Git to respect version control settings:

```json
"vcs": {
  "enabled": true,
  "clientKind": "git",
  "defaultBranch": "main",
  "useIgnoreFile": true
}
```

**Features:**

-   Respects `.gitignore` patterns
-   Tracks default branch (main)
-   Integrates with Git workflows

## Usage

### Command Line

```bash
# Lint all files
pnpm lint

# Check linting and formatting
pnpm check

# Format all files
pnpm format

# Fix auto-fixable issues
biome check --write
```

### Package Scripts

From `package.json`:

```json
{
	"scripts": {
		"lint": "biome lint .",
		"check": "biome check",
		"format": "biome format . --write"
	}
}
```

### Pre-commit Hook

Biome runs automatically on staged files via Husky and lint-staged:

**Configuration:**

```json
// package.json
"lint-staged": {
  "*.{js,jsx,ts,tsx,json,css}": "biome check --write --no-errors-on-unmatched"
}
```

**Hook:**

```bash
# .husky/pre-commit
pnpm lint-staged
```

**What happens:**

1. You commit staged files
2. Husky triggers the pre-commit hook
3. lint-staged runs Biome on staged files only
4. Biome checks and auto-fixes issues
5. Fixed files are automatically staged
6. Commit proceeds if no errors remain

## IDE Integration

### VS Code

Install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome):

```bash
code --install-extension biomejs.biome
```

**Recommended Settings:**

```json
{
	"editor.defaultFormatter": "biomejs.biome",
	"editor.formatOnSave": true,
	"editor.codeActionsOnSave": {
		"quickfix.biome": "explicit",
		"source.organizeImports.biome": "explicit"
	}
}
```

### Other IDEs

-   [JetBrains IDEs](https://biomejs.dev/guides/integrate-in-editor/#jetbrains-ides)
-   [Neovim](https://biomejs.dev/guides/integrate-in-editor/#neovim)
-   [Sublime Text](https://biomejs.dev/guides/integrate-in-editor/#sublime-text)

## Import Organization

Biome automatically organizes imports on save or when running `biome check --write`:

```typescript
// Before
import { useState } from "react";
import { Button } from "./Button";
import type { User } from "./types";
import { config } from "@shipos/config";

// After (organized)
import type { User } from "./types";
import { useState } from "react";
import { config } from "@shipos/config";
import { Button } from "./Button";
```

**Order:**

1. Type imports
2. External dependencies
3. Internal packages
4. Relative imports

## JavaScript/JSX Configuration

```json
"javascript": {
  "jsxRuntime": "reactClassic"
}
```

Uses the classic JSX runtime (React 17+ automatic runtime is not used).

## Best Practices

### Use Auto-fix

Let Biome fix issues automatically:

```bash
# Fix all auto-fixable issues
pnpm check --write

# Or use format command
pnpm format
```

### Run Before Committing

Always run Biome before committing:

```bash
pnpm check
```

The pre-commit hook will run this automatically, but it's good practice to run it manually first.

### Disable Rules Sparingly

Only disable rules when absolutely necessary:

```typescript
// Disable for specific line
// biome-ignore lint/suspicious/noExplicitAny: Legacy code
const data: any = legacyFunction();

// Disable for file
/* biome-ignore lint/suspicious/noExplicitAny: Generated file */
```

### Understand Rule Levels

-   **Error**: Must be fixed (blocks commit)
-   **Warning**: Should be fixed (doesn't block commit)
-   **Off**: Rule is disabled

## Troubleshooting

### Common Issues

**Issue: "Biome not found"**

Solution: Install dependencies:

```bash
pnpm install
```

**Issue: "Configuration not found"**

Solution: Ensure you're in the project root or a package directory with `biome.json`.

**Issue: "Files not being formatted"**

Solution: Check if files are excluded in `biome.json` or `.gitignore`.

**Issue: "IDE not using Biome"**

Solution: Install the Biome extension and configure it as the default formatter.

### Bypassing Pre-commit Hook

Not recommended, but possible in emergencies:

```bash
git commit --no-verify -m "message"
```

## Migration from ESLint/Prettier

Biome replaces both ESLint and Prettier:

**Before:**

```json
{
	"scripts": {
		"lint": "eslint .",
		"format": "prettier --write ."
	}
}
```

**After:**

```json
{
	"scripts": {
		"lint": "biome lint .",
		"format": "biome format . --write",
		"check": "biome check"
	}
}
```

## Performance

Biome is significantly faster than ESLint + Prettier:

-   **Written in Rust**: Native performance
-   **Single tool**: No context switching
-   **Parallel processing**: Utilizes multiple CPU cores
-   **Incremental**: Only processes changed files

**Benchmark (approximate):**

-   ESLint + Prettier: ~10-15 seconds
-   Biome: ~1-2 seconds

## Configuration Reference

### Complete Rule List

See [Biome Rules Documentation](https://biomejs.dev/linter/rules/) for all available rules.

### Schema Validation

The configuration includes JSON schema validation:

```json
"$schema": "./node_modules/@biomejs/biome/configuration_schema.json"
```

This provides autocomplete and validation in your IDE.

## Next Steps

-   [Development Guide](./development.md) - Development workflow
-   [Setup Guide](./setup.md) - Initial project setup
-   [TypeScript Usage](../reference/.cursor/rules/typescript-usage.mdc) - TypeScript conventions

## Resources

-   [Biome Official Documentation](https://biomejs.dev/)
-   [Biome GitHub Repository](https://github.com/biomejs/biome)
-   [Biome VS Code Extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
