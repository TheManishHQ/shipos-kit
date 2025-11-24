# Configuration

The configuration system provides centralized management of application settings, feature flags, and environment-specific options.

## Overview

The configuration package (`@shipos/config`) provides:

-   Centralized configuration object
-   Feature flags for enabling/disabling features
-   Type-safe configuration access
-   Environment-specific settings
-   Payment plan definitions
-   Locale and currency settings

## Architecture

```
config/
├── index.ts         # Main configuration
├── types.ts         # TypeScript types
├── package.json
└── tsconfig.json
```

## Configuration Structure

### Main Configuration

```typescript
// config/index.ts
export const config = {
	appName: "Shipos Kit",

	i18n: {
		/* ... */
	},
	users: {
		/* ... */
	},
	auth: {
		/* ... */
	},
	mails: {
		/* ... */
	},
	storage: {
		/* ... */
	},
	ui: {
		/* ... */
	},
	contactForm: {
		/* ... */
	},
	payments: {
		/* ... */
	},
} as const;
```

## Feature Flags

### Internationalization (i18n)

```typescript
i18n: {
  enabled: true,
  locales: {
    en: {
      currency: 'USD',
      label: 'English',
    },
    de: {
      currency: 'USD',
      label: 'Deutsch',
    },
  },
  defaultLocale: 'en',
  defaultCurrency: 'USD',
  localeCookieName: 'NEXT_LOCALE',
}
```

**Options:**

-   `enabled` - Enable/disable i18n system
-   `locales` - Supported locales with currency and label
-   `defaultLocale` - Fallback locale
-   `defaultCurrency` - Default currency for pricing
-   `localeCookieName` - Cookie name for storing locale preference

### User Features

```typescript
users: {
  enableBilling: true,
  enableOnboarding: true,
}
```

**Options:**

-   `enableBilling` - Enable subscription and payment features
-   `enableOnboarding` - Show onboarding flow for new users

### Authentication

```typescript
auth: {
  enableSignup: true,
  enableMagicLink: true,
  enableSocialLogin: true,
  enablePasskeys: true,
  enablePasswordLogin: true,
  enableTwoFactor: true,
  redirectAfterSignIn: '/app',
  redirectAfterLogout: '/',
  sessionCookieMaxAge: 30 * 24 * 60 * 60, // 30 days
}
```

**Options:**

-   `enableSignup` - Allow new user registration
-   `enableMagicLink` - Enable passwordless authentication
-   `enableSocialLogin` - Enable OAuth providers (Google, GitHub)
-   `enablePasskeys` - Enable WebAuthn/passkey authentication
-   `enablePasswordLogin` - Enable email/password authentication
-   `enableTwoFactor` - Enable two-factor authentication (TOTP)
-   `redirectAfterSignIn` - URL to redirect after successful login
-   `redirectAfterLogout` - URL to redirect after logout
-   `sessionCookieMaxAge` - Session duration in seconds

### Email Configuration

```typescript
mails: {
  from: 'noreply@example.com',
}
```

**Options:**

-   `from` - Default "from" address for transactional emails

### Storage Configuration

```typescript
storage: {
  bucketNames: {
    avatars: process.env.NEXT_PUBLIC_AVATARS_BUCKET_NAME || 'avatars',
  },
}
```

**Options:**

-   `bucketNames.avatars` - S3 bucket name for user avatars

### UI Configuration

```typescript
ui: {
  enabledThemes: ['light', 'dark'] as const,
  defaultTheme: 'light' as const,
  saas: {
    enabled: true,
    useSidebarLayout: true,
  },
  marketing: {
    enabled: true,
  },
}
```

**Options:**

-   `enabledThemes` - Available theme options
-   `defaultTheme` - Default theme on first visit
-   `saas.enabled` - Enable SaaS application routes
-   `saas.useSidebarLayout` - Use sidebar navigation layout
-   `marketing.enabled` - Enable marketing pages

### Contact Form

```typescript
contactForm: {
  enabled: true,
  to: 'contact@example.com',
  subject: 'New Contact Form Submission',
}
```

**Options:**

-   `enabled` - Enable contact form
-   `to` - Email address to receive submissions
-   `subject` - Email subject line

## Payment Plans

### Plan Structure

```typescript
payments: {
  plans: {
    free: { /* ... */ },
    pro: { /* ... */ },
    lifetime: { /* ... */ },
    enterprise: { /* ... */ },
  },
}
```

### Free Plan

```typescript
free: {
  isFree: true,
  prices: [],
}
```

**Properties:**

-   `isFree` - Marks plan as free tier
-   `prices` - Empty array (no payment required)

### Pro Plan

```typescript
pro: {
  recommended: true,
  prices: [
    {
      productId: 'price_pro_monthly',
      amount: 2900,
      currency: 'USD',
      type: 'recurring',
      interval: 'month',
      trialPeriodDays: 14,
    },
    {
      productId: 'price_pro_yearly',
      amount: 29000,
      currency: 'USD',
      type: 'recurring',
      interval: 'year',
    },
  ],
}
```

**Properties:**

-   `recommended` - Display as recommended plan
-   `prices` - Array of pricing options

**Price Object:**

-   `productId` - Payment provider product/price ID
-   `amount` - Price in cents (2900 = $29.00)
-   `currency` - Currency code (USD, EUR, etc.)
-   `type` - `'recurring'` or `'one-time'`
-   `interval` - `'month'` or `'year'` (for recurring)
-   `trialPeriodDays` - Trial period length (optional)

### Lifetime Plan

```typescript
lifetime: {
  prices: [
    {
      productId: 'price_lifetime',
      amount: 99900,
      currency: 'USD',
      type: 'one-time',
    },
  ],
}
```

**Properties:**

-   `prices` - One-time payment options

### Enterprise Plan

```typescript
enterprise: {
  isEnterprise: true,
  prices: [],
}
```

**Properties:**

-   `isEnterprise` - Marks plan as enterprise (contact sales)
-   `prices` - Empty array (custom pricing)

## Type Definitions

### Configuration Types

```typescript
// config/types.ts
export interface Config {
	appName: string;
	i18n: I18nConfig;
	users: UsersConfig;
	auth: AuthConfig;
	mails: MailsConfig;
	storage: StorageConfig;
	ui: UIConfig;
	contactForm: ContactFormConfig;
	payments: PaymentsConfig;
}

export interface I18nConfig {
	enabled: boolean;
	locales: Record<string, LocaleConfig>;
	defaultLocale: string;
	defaultCurrency: string;
	localeCookieName: string;
}

export interface LocaleConfig {
	currency: string;
	label: string;
}

export interface AuthConfig {
	enableSignup: boolean;
	enableMagicLink: boolean;
	enableSocialLogin: boolean;
	enablePasskeys: boolean;
	enablePasswordLogin: boolean;
	enableTwoFactor: boolean;
	redirectAfterSignIn: string;
	redirectAfterLogout: string;
	sessionCookieMaxAge: number;
}

export interface PaymentPlan {
	isFree?: boolean;
	isEnterprise?: boolean;
	recommended?: boolean;
	prices: PriceOption[];
}

export interface PriceOption {
	productId: string;
	amount: number;
	currency: string;
	type: "recurring" | "one-time";
	interval?: "month" | "year";
	trialPeriodDays?: number;
}
```

## Usage

### Importing Configuration

```typescript
import { config } from "@shipos/config";

// Access configuration
const appName = config.appName;
const enableSignup = config.auth.enableSignup;
const defaultLocale = config.i18n.defaultLocale;
```

### Type-Safe Access

```typescript
import type { Config } from "@shipos/config/types";

function getAuthConfig(config: Config) {
	return config.auth;
}
```

### Conditional Features

```typescript
import { config } from "@shipos/config";

// Show signup form only if enabled
function AuthPage() {
	return (
		<div>
			<LoginForm />
			{config.auth.enableSignup && <SignupForm />}
		</div>
	);
}
```

### Plan Selection

```typescript
import { config } from "@shipos/config";

function PricingTable() {
	const plans = Object.entries(config.payments.plans);

	return (
		<div>
			{plans.map(([key, plan]) => (
				<PlanCard
					key={key}
					name={key}
					plan={plan}
					recommended={plan.recommended}
				/>
			))}
		</div>
	);
}
```

## Environment Variables

Configuration can reference environment variables:

```typescript
storage: {
  bucketNames: {
    avatars: process.env.NEXT_PUBLIC_AVATARS_BUCKET_NAME || 'avatars',
  },
}
```

**Required Environment Variables:**

```bash
# Storage
NEXT_PUBLIC_AVATARS_BUCKET_NAME=avatars

# Payment Provider
PAYMENT_PROVIDER=stripe  # or 'dodo'

# OAuth (if enabled)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

## Customization

### Adding New Configuration

1. Update configuration object:

```typescript
// config/index.ts
export const config = {
	// ... existing config

	newFeature: {
		enabled: true,
		option1: "value1",
		option2: 42,
	},
} as const;
```

2. Add TypeScript types:

```typescript
// config/types.ts
export interface Config {
	// ... existing types
	newFeature: NewFeatureConfig;
}

export interface NewFeatureConfig {
	enabled: boolean;
	option1: string;
	option2: number;
}
```

3. Use in application:

```typescript
import { config } from "@shipos/config";

if (config.newFeature.enabled) {
	// Feature logic
}
```

### Overriding Configuration

For environment-specific overrides:

```typescript
// config/index.ts
const baseConfig = {
	// ... base configuration
};

const envOverrides =
	process.env.NODE_ENV === "production"
		? {
				auth: {
					...baseConfig.auth,
					sessionCookieMaxAge: 7 * 24 * 60 * 60, // 7 days in production
				},
		  }
		: {};

export const config = {
	...baseConfig,
	...envOverrides,
} as const;
```

## Best Practices

### Use Feature Flags

Enable/disable features without code changes:

```typescript
// Good
if (config.auth.enableMagicLink) {
	return <MagicLinkButton />;
}

// Avoid
if (process.env.ENABLE_MAGIC_LINK === "true") {
	return <MagicLinkButton />;
}
```

### Centralize Configuration

Keep all configuration in one place:

```typescript
// Good
import { config } from "@shipos/config";
const redirectUrl = config.auth.redirectAfterSignIn;

// Avoid
const redirectUrl = "/app"; // Hardcoded
```

### Type Safety

Use TypeScript types for configuration:

```typescript
import type { PaymentPlan } from "@shipos/config/types";

function validatePlan(plan: PaymentPlan) {
	if (plan.isFree && plan.prices.length > 0) {
		throw new Error("Free plan should not have prices");
	}
}
```

### Document Configuration

Add comments for complex options:

```typescript
export const config = {
	auth: {
		// Session duration in seconds (30 days)
		sessionCookieMaxAge: 30 * 24 * 60 * 60,

		// Redirect URL after successful login
		// Can be absolute or relative path
		redirectAfterSignIn: "/app",
	},
};
```

## Configuration Examples

### Minimal Configuration

For a simple app without advanced features:

```typescript
export const config = {
	appName: "My App",

	auth: {
		enableSignup: true,
		enablePasswordLogin: true,
		enableMagicLink: false,
		enableSocialLogin: false,
		enablePasskeys: false,
		enableTwoFactor: false,
	},

	users: {
		enableBilling: false,
		enableOnboarding: false,
	},

	ui: {
		enabledThemes: ["light"],
		defaultTheme: "light",
	},
};
```

### Full-Featured Configuration

For a complete SaaS application:

```typescript
export const config = {
	appName: "SaaS Platform",

	auth: {
		enableSignup: true,
		enablePasswordLogin: true,
		enableMagicLink: true,
		enableSocialLogin: true,
		enablePasskeys: true,
		enableTwoFactor: true,
	},

	users: {
		enableBilling: true,
		enableOnboarding: true,
	},

	i18n: {
		enabled: true,
		locales: {
			en: { currency: "USD", label: "English" },
			de: { currency: "EUR", label: "Deutsch" },
			fr: { currency: "EUR", label: "Français" },
		},
	},

	payments: {
		plans: {
			free: { isFree: true, prices: [] },
			pro: {
				/* ... */
			},
			enterprise: { isEnterprise: true, prices: [] },
		},
	},
};
```

## Troubleshooting

### Common Issues

**Issue: "Cannot find module '@shipos/config'"**

-   Solution: Ensure package is installed and workspace is configured

**Issue: "Configuration not updating"**

-   Solution: Restart dev server after configuration changes

**Issue: "Type errors with configuration"**

-   Solution: Update types in `config/types.ts` to match configuration

## Next Steps

-   [Authentication](./authentication.md) - Configure authentication features
-   [Database](./database.md) - Database configuration
-   [Payments](./payments.md) - Configure payment plans
-   [Internationalization](./i18n.md) - Set up locales and translations
