# Requirements Document

## Introduction

This document specifies the requirements for a production-ready SaaS starter kit built with Next.js 15, React 19, and TypeScript. The system provides a comprehensive foundation for building SaaS applications with authentication, payments, AI features, internationalization, and administrative capabilities. The architecture uses a monorepo structure with pnpm workspaces and Turborepo for optimal developer experience and scalability.

## Glossary

- **SaaS Application**: The main web application serving authenticated users
- **Marketing Site**: Public-facing pages for user acquisition and information
- **Authentication System**: The better-auth based system handling user identity and sessions
- **Payment Provider**: External service (Stripe or DodoPayments) processing payments
- **Monorepo**: Single repository containing multiple packages managed by pnpm workspaces
- **AI Chat System**: Feature allowing users to interact with AI models
- **Admin Panel**: Protected interface for administrative user management
- **Storage Provider**: S3-compatible service for file storage
- **Email Provider**: Service for sending transactional emails
- **i18n System**: Internationalization system supporting multiple languages

## Requirements

### Requirement 1: Monorepo Architecture

**User Story:** As a developer, I want a well-structured monorepo with clear separation of concerns, so that I can maintain and scale the codebase efficiently.

#### Acceptance Criteria

1. THE Monorepo SHALL use pnpm workspaces for package management
2. THE Monorepo SHALL use Turborepo for build orchestration and task running
3. THE Monorepo SHALL organize code into apps/web/ for the Next.js application
4. THE Monorepo SHALL organize shared code into packages/ directory with subdirectories for ai, api, auth, database, i18n, logs, mail, payments, storage, and utils
5. THE Monorepo SHALL provide config/ directory for application configuration

### Requirement 2: Authentication with Email and Password

**User Story:** As a user, I want to create an account and log in with email and password, so that I can securely access the application.

#### Acceptance Criteria

1. WHEN a user submits valid signup credentials, THE Authentication System SHALL create a new user account with hashed password
2. WHEN a user signs up, THE Authentication System SHALL send an email verification link to the provided email address
3. WHEN a user clicks the verification link, THE Authentication System SHALL mark the email as verified and sign in the user automatically
4. WHEN a user submits valid login credentials with a verified email, THE Authentication System SHALL create a session and redirect to the application
5. THE Authentication System SHALL validate email format and password strength during signup

### Requirement 3: Passwordless Authentication

**User Story:** As a user, I want to log in without a password using magic links or social providers, so that I can access my account more conveniently.

#### Acceptance Criteria

1. WHEN a user requests a magic link, THE Authentication System SHALL send an email with a time-limited authentication link
2. WHEN a user clicks a valid magic link, THE Authentication System SHALL authenticate the user and create a session
3. WHEN a user initiates Google OAuth, THE Authentication System SHALL redirect to Google authorization with email and profile scopes
4. WHEN a user initiates GitHub OAuth, THE Authentication System SHALL redirect to GitHub authorization with user:email scope
5. WHEN a user completes OAuth flow, THE Authentication System SHALL create or link the account and establish a session

### Requirement 4: Passkey and Two-Factor Authentication

**User Story:** As a security-conscious user, I want to use passkeys and two-factor authentication, so that my account has enhanced protection.

#### Acceptance Criteria

1. WHEN a user registers a passkey, THE Authentication System SHALL store the public key, credential ID, and device metadata
2. WHEN a user authenticates with a passkey, THE Authentication System SHALL verify the signature and create a session
3. WHEN a user enables 2FA, THE Authentication System SHALL generate a TOTP secret and backup codes
4. WHEN a user logs in with 2FA enabled, THE Authentication System SHALL require TOTP code verification after password validation
5. WHEN a user uses a backup code, THE Authentication System SHALL invalidate that code and allow authentication

### Requirement 5: User Account Management

**User Story:** As a user, I want to manage my account settings including profile, password, and connected accounts, so that I can maintain control over my account.

#### Acceptance Criteria

1. WHEN a user updates their profile name, THE SaaS Application SHALL save the new name to the database
2. WHEN a user uploads an avatar, THE SaaS Application SHALL provide image cropping functionality and store the cropped image
3. WHEN a user changes their email, THE SaaS Application SHALL send a verification email to the new address
4. WHEN a user changes their password, THE Authentication System SHALL validate the current password and update to the new hashed password
5. WHEN a user with social login sets a password, THE Authentication System SHALL enable password login for that account
6. WHEN a user views connected accounts, THE SaaS Application SHALL display all linked OAuth providers
7. WHEN a user requests account deletion, THE SaaS Application SHALL cancel active subscriptions and delete the user account

### Requirement 6: Session Management

**User Story:** As a user, I want to view and manage my active sessions, so that I can monitor account access and revoke suspicious sessions.

#### Acceptance Criteria

1. WHEN a user logs in, THE Authentication System SHALL create a session record with IP address and user agent
2. THE Authentication System SHALL set session expiration to 30 days by default
3. WHEN a user views active sessions, THE SaaS Application SHALL display all sessions with device information and last activity
4. WHEN a user revokes a session, THE Authentication System SHALL invalidate that session token
5. THE Authentication System SHALL store session tokens in secure HTTP-only cookies

### Requirement 7: User Roles and Banning

**User Story:** As an administrator, I want to assign roles and ban users, so that I can manage user access and enforce policies.

#### Acceptance Criteria

1. WHEN an admin assigns a role to a user, THE SaaS Application SHALL update the user's role field
2. WHEN an admin bans a user, THE SaaS Application SHALL set banned status, ban reason, and optional expiration date
3. WHEN a banned user attempts to log in, THE Authentication System SHALL deny access and display the ban reason
4. WHEN a ban expires, THE Authentication System SHALL allow the user to log in again
5. THE SaaS Application SHALL restrict admin routes to users with admin role

### Requirement 8: Database Schema and Management

**User Story:** As a developer, I want a well-defined database schema with type safety, so that I can build features with confidence and data integrity.

#### Acceptance Criteria

1. THE Database SHALL use Prisma ORM with PostgreSQL
2. THE Database SHALL define User model with fields: id, name, email, emailVerified, image, username, role, banned, banReason, banExpires, onboardingComplete, paymentsCustomerId, locale, twoFactorEnabled, createdAt, updatedAt
3. THE Database SHALL define Session model with fields: id, expiresAt, token, userId, ipAddress, userAgent, impersonatedBy, createdAt, updatedAt
4. THE Database SHALL define Account model with fields: id, accountId, providerId, userId, accessToken, refreshToken, idToken, password, expiresAt, accessTokenExpiresAt, refreshTokenExpiresAt, scope, createdAt, updatedAt
5. THE Database SHALL define Verification model with fields: id, identifier, value, expiresAt, createdAt, updatedAt
6. THE Database SHALL define Passkey model with fields: id, name, publicKey, credentialID, userId, counter, deviceType, backedUp, transports, createdAt
7. THE Database SHALL define TwoFactor model with fields: id, secret, backupCodes, userId
8. THE Database SHALL define Purchase model with fields: id, userId, type, customerId, subscriptionId, productId, status, createdAt, updatedAt
9. THE Database SHALL define AiChat model with fields: id, userId, title, messages, createdAt, updatedAt
10. THE Database SHALL generate Zod schemas from Prisma models for validation

### Requirement 9: Payment Provider Integration

**User Story:** As a business owner, I want to accept payments through multiple providers with a unified interface, so that I can monetize the application flexibly.

#### Acceptance Criteria

1. THE Payment Provider SHALL support Stripe integration with environment variables STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET
2. THE Payment Provider SHALL support DodoPayments integration with environment variables DODO_PAYMENTS_API_KEY and DODO_PAYMENTS_WEBHOOK_SECRET
3. WHEN creating a checkout session, THE Payment Provider SHALL accept product ID, customer ID, and return a checkout URL
4. WHEN generating a customer portal link, THE Payment Provider SHALL return a URL for the customer to manage billing
5. THE Payment Provider SHALL provide a unified interface for both Stripe and DodoPayments operations

### Requirement 10: Subscription Management

**User Story:** As a user, I want to subscribe to plans, manage my subscription, and access plan-specific features, so that I can use the service according to my needs.

#### Acceptance Criteria

1. THE SaaS Application SHALL offer Free, Pro, Lifetime, and Enterprise plans
2. WHEN a user selects a plan, THE SaaS Application SHALL create a checkout session with the Payment Provider
3. WHEN a checkout completes, THE Payment Provider SHALL create a Purchase record with subscription details
4. WHEN a user cancels a subscription, THE Payment Provider SHALL update the Purchase status to canceled
5. THE SaaS Application SHALL display the user's active plan and subscription status
6. WHERE a plan includes a trial period, THE Payment Provider SHALL configure the trial duration in the checkout session
7. THE SaaS Application SHALL assign Free plan automatically when no active subscription exists

### Requirement 11: Payment Webhooks

**User Story:** As a system, I want to process payment webhooks securely, so that subscription status stays synchronized with the payment provider.

#### Acceptance Criteria

1. WHEN receiving a Stripe webhook, THE SaaS Application SHALL verify the signature using stripe-signature header
2. WHEN receiving a DodoPayments webhook, THE SaaS Application SHALL verify the signature using HMAC SHA256 with webhook-id, webhook-signature, and webhook-timestamp headers
3. WHEN processing checkout.session.completed event, THE SaaS Application SHALL create or update Purchase record
4. WHEN processing subscription.created event, THE SaaS Application SHALL create Purchase record with subscription details
5. WHEN processing subscription.updated event, THE SaaS Application SHALL update Purchase record status
6. WHEN processing subscription.deleted or subscription.cancelled event, THE SaaS Application SHALL update Purchase status to canceled
7. WHEN webhook processing fails, THE SaaS Application SHALL log the error and return appropriate HTTP status code

### Requirement 12: AI Chat System

**User Story:** As a user, I want to have conversations with AI models and access my chat history, so that I can leverage AI capabilities for my tasks.

#### Acceptance Criteria

1. WHEN a user creates a chat, THE AI Chat System SHALL create an AiChat record with optional title
2. WHEN a user sends a message, THE AI Chat System SHALL append the message to the chat's messages array
3. WHEN processing a message, THE AI Chat System SHALL use OpenAI GPT-4o-mini model for text generation
4. THE AI Chat System SHALL stream responses using AI SDK React hooks
5. WHEN a user lists chats, THE SaaS Application SHALL return all chats belonging to that user
6. WHEN a user deletes a chat, THE AI Chat System SHALL remove the AiChat record from the database
7. THE AI Chat System SHALL support DALL-E 3 for image generation
8. THE AI Chat System SHALL support Whisper-1 for audio transcription

### Requirement 13: Email System

**User Story:** As a user, I want to receive transactional emails in my preferred language, so that I stay informed about account activities.

#### Acceptance Criteria

1. WHEN a user signs up, THE Email System SHALL send a welcome email using the NewUser template
2. WHEN a user requests email verification, THE Email System SHALL send an email using the EmailVerification template
3. WHEN a user requests password reset, THE Email System SHALL send an email using the ForgotPassword template
4. WHEN a user requests a magic link, THE Email System SHALL send an email using the MagicLink template
5. WHEN a user subscribes to newsletter, THE Email System SHALL send a confirmation using the NewsletterSignup template
6. THE Email System SHALL render emails using React components with proper HTML styling
7. WHERE a user has a locale preference, THE Email System SHALL send emails in that locale
8. THE Email System SHALL use the configured "from" address from application configuration

### Requirement 14: File Storage

**User Story:** As a user, I want to upload and access files securely, so that I can store avatars and other content.

#### Acceptance Criteria

1. THE Storage Provider SHALL use S3-compatible storage with environment variables S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
2. WHEN a user requests an upload URL, THE Storage Provider SHALL generate a presigned PUT URL with 60 second expiration
3. WHEN a user requests a download URL, THE Storage Provider SHALL generate a presigned GET URL with configurable expiration
4. THE Storage Provider SHALL store avatars in a bucket named by NEXT_PUBLIC_AVATARS_BUCKET_NAME
5. THE SaaS Application SHALL provide an image proxy endpoint for secure image serving

### Requirement 15: Internationalization

**User Story:** As a user, I want to use the application in my preferred language, so that I can understand and navigate the interface easily.

#### Acceptance Criteria

1. THE i18n System SHALL support English (en) and German (de) locales
2. THE i18n System SHALL set English as the default locale
3. WHEN a user selects a locale, THE i18n System SHALL store the preference in NEXT_LOCALE cookie
4. THE SaaS Application SHALL use locale-aware routing with /[locale]/ prefix
5. THE i18n System SHALL provide translation files in JSON format for each locale
6. THE i18n System SHALL assign USD currency to both English and German locales
7. THE SaaS Application SHALL display a language selector component
8. THE i18n System SHALL provide type-safe translations with TypeScript

### Requirement 16: Marketing Pages

**User Story:** As a visitor, I want to learn about the product through marketing pages, so that I can decide whether to sign up.

#### Acceptance Criteria

1. THE Marketing Site SHALL display a homepage with hero, features, FAQ, pricing, and contact sections
2. THE Marketing Site SHALL provide a blog listing page showing all blog posts
3. THE Marketing Site SHALL render individual blog posts from MDX files
4. THE Marketing Site SHALL display a changelog page with product updates
5. THE Marketing Site SHALL provide documentation pages using Fumadocs with table of contents and search
6. THE Marketing Site SHALL display legal pages for Terms of Service and Privacy Policy
7. THE Marketing Site SHALL provide a contact form that sends emails to the configured address
8. THE Marketing Site SHALL support newsletter signup functionality
9. WHERE content exists in multiple languages, THE Marketing Site SHALL display content in the user's selected locale

### Requirement 17: Admin Panel

**User Story:** As an administrator, I want to manage users through an admin panel, so that I can perform administrative tasks efficiently.

#### Acceptance Criteria

1. THE Admin Panel SHALL restrict access to users with admin role
2. WHEN an admin views the users page, THE Admin Panel SHALL display a paginated table of all users
3. THE Admin Panel SHALL display user details including name, email, email verification status, and role
4. THE Admin Panel SHALL provide user role management functionality
5. THE Admin Panel SHALL use a dedicated admin layout with navigation

### Requirement 18: UI Theme System

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the application comfortably in different environments.

#### Acceptance Criteria

1. THE SaaS Application SHALL support light and dark themes
2. THE SaaS Application SHALL provide a theme switcher component
3. THE SaaS Application SHALL use Tailwind CSS with custom theme variables
4. THE SaaS Application SHALL persist theme preference across sessions
5. THE SaaS Application SHALL apply theme consistently across all components

### Requirement 19: Component Library

**User Story:** As a developer, I want a comprehensive component library, so that I can build UI consistently and efficiently.

#### Acceptance Criteria

1. THE SaaS Application SHALL provide form components using React Hook Form and Zod validation
2. THE SaaS Application SHALL provide button, input, select, and textarea components
3. THE SaaS Application SHALL provide dialog and alert dialog components
4. THE SaaS Application SHALL provide toast notifications using Sonner
5. THE SaaS Application SHALL provide table components using TanStack Table
6. THE SaaS Application SHALL provide avatar components with boring-avatars fallback
7. THE SaaS Application SHALL provide image cropper using react-cropper
8. THE SaaS Application SHALL provide file upload dropzone using react-dropzone
9. THE SaaS Application SHALL provide pagination, tabs, accordion, and tooltip components
10. THE SaaS Application SHALL ensure all components are accessible with ARIA compliance via Radix UI
11. THE SaaS Application SHALL ensure all components support dark mode

### Requirement 20: Type-Safe API

**User Story:** As a developer, I want type-safe API routes with automatic client generation, so that I can build features with confidence and avoid runtime errors.

#### Acceptance Criteria

1. THE API SHALL use ORPC for type-safe API routes
2. THE API SHALL generate OpenAPI schema from route definitions
3. THE API SHALL provide admin module with endpoints for listing users and organizations
4. THE API SHALL provide AI module with endpoints for chat operations (create, add message, update, find, list, delete)
5. THE API SHALL provide contact module with endpoint for submitting contact form
6. THE API SHALL provide newsletter module with endpoint for subscribing
7. THE API SHALL provide payments module with endpoints for checkout, customer portal, and listing purchases
8. THE API SHALL provide users module with endpoints for avatar upload URL and user management
9. THE API SHALL support authentication middleware for protected procedures
10. THE API SHALL validate input using Zod schemas
11. THE API SHALL handle errors with proper HTTP status codes and logging

### Requirement 21: Developer Experience

**User Story:** As a developer, I want excellent tooling and developer experience, so that I can work efficiently and maintain code quality.

#### Acceptance Criteria

1. THE Monorepo SHALL use Biome for linting and formatting
2. THE Monorepo SHALL provide TypeScript with strict mode enabled
3. THE Monorepo SHALL provide shared TypeScript configs in tooling/typescript/
4. THE Monorepo SHALL support hot reload in development mode
5. THE Monorepo SHALL use Turborepo caching for build optimization
6. THE Monorepo SHALL provide scripts: dev, build, start, lint, format, check, clean
7. THE Monorepo SHALL provide path aliases for packages (@repo/_, @saas/_, @ui/_, @i18n/_)

### Requirement 22: Testing Infrastructure

**User Story:** As a developer, I want automated testing capabilities, so that I can ensure code quality and prevent regressions.

#### Acceptance Criteria

1. THE Monorepo SHALL use Playwright for end-to-end testing
2. THE Monorepo SHALL configure Playwright with test directory at apps/web/tests/
3. THE Monorepo SHALL configure Playwright to use base URL http://localhost:3000
4. THE Monorepo SHALL configure Playwright to record video on failure
5. THE Monorepo SHALL configure Playwright to capture trace on first retry
6. THE Monorepo SHALL provide example test for homepage load

### Requirement 23: Security Features

**User Story:** As a user, I want my data and account to be protected by security best practices, so that I can trust the application with my information.

#### Acceptance Criteria

1. THE Authentication System SHALL store session tokens in secure HTTP-only cookies
2. THE Authentication System SHALL implement CSRF protection
3. THE Payment Provider SHALL verify webhook signatures before processing events
4. THE Authentication System SHALL hash passwords using secure algorithms
5. THE Authentication System SHALL store 2FA backup codes securely
6. THE Authentication System SHALL link accounts only for trusted providers
7. THE SaaS Application SHALL validate all user input using Zod schemas
8. THE Database SHALL use Prisma ORM to prevent SQL injection
9. THE SaaS Application SHALL rely on React's built-in XSS protection

### Requirement 24: SEO and Metadata

**User Story:** As a business owner, I want the marketing site to be search engine optimized, so that potential users can discover the product.

#### Acceptance Criteria

1. THE Marketing Site SHALL generate a dynamic sitemap at /sitemap.xml
2. THE Marketing Site SHALL generate robots.txt at /robots.txt
3. THE Marketing Site SHALL provide metadata management for each page
4. THE Marketing Site SHALL include Open Graph tags for social sharing
5. THE Marketing Site SHALL support structured data for rich search results
6. THE Marketing Site SHALL use locale-aware URLs for SEO

### Requirement 25: Configuration System

**User Story:** As a developer, I want centralized configuration with feature flags, so that I can customize the application behavior without code changes.

#### Acceptance Criteria

1. THE SaaS Application SHALL provide centralized configuration in config/index.ts
2. THE Configuration SHALL include feature flags for i18n, billing, onboarding, signup, magic link, social login, passkeys, password login, and two-factor authentication
3. THE Configuration SHALL define supported locales with currency and label
4. THE Configuration SHALL define authentication redirects and session duration
5. THE Configuration SHALL define email "from" address
6. THE Configuration SHALL define storage bucket names
7. THE Configuration SHALL define UI theme options and layout preferences
8. THE Configuration SHALL define contact form settings
9. THE Configuration SHALL define payment plans with pricing, intervals, and trial periods

### Requirement 26: User Onboarding

**User Story:** As a new user, I want to complete an onboarding flow after signup, so that I can configure my account and get started quickly.

#### Acceptance Criteria

1. WHEN a user completes signup, THE SaaS Application SHALL redirect to onboarding flow if enabled in configuration
2. THE SaaS Application SHALL display a configurable onboarding form
3. WHEN a user completes onboarding, THE SaaS Application SHALL set onboardingComplete to true
4. WHEN a user with incomplete onboarding accesses the app, THE SaaS Application SHALL redirect to onboarding flow
5. WHERE onboarding is disabled in configuration, THE SaaS Application SHALL skip the onboarding flow

### Requirement 27: Application Routing

**User Story:** As a user, I want intuitive navigation and routing, so that I can access different parts of the application easily.

#### Acceptance Criteria

1. THE Marketing Site SHALL serve homepage at root path /
2. THE Marketing Site SHALL serve localized pages at /[locale]/ paths
3. THE Marketing Site SHALL serve blog at /[locale]/blog and /[locale]/blog/[...path]
4. THE Marketing Site SHALL serve documentation at /[locale]/docs/[...path]
5. THE Marketing Site SHALL serve changelog at /[locale]/changelog
6. THE Marketing Site SHALL serve contact form at /[locale]/contact
7. THE Marketing Site SHALL serve legal pages at /[locale]/legal/[...path]
8. THE Authentication System SHALL serve auth pages at /auth/login, /auth/signup, /auth/forgot-password, /auth/reset-password, /auth/verify
9. THE SaaS Application SHALL serve dashboard at /app
10. THE SaaS Application SHALL serve settings at /app/settings/general, /app/settings/billing, /app/settings/security, /app/settings/danger-zone
11. THE SaaS Application SHALL serve AI chat at /app/chatbot
12. THE Admin Panel SHALL serve admin pages at /app/admin/users and /app/admin/organizations
13. THE SaaS Application SHALL serve plan selection at /choose-plan
14. THE SaaS Application SHALL serve onboarding at /onboarding

### Requirement 28: Layout System

**User Story:** As a user, I want consistent layouts across different sections of the application, so that I have a cohesive experience.

#### Acceptance Criteria

1. WHERE sidebar layout is enabled, THE SaaS Application SHALL use sidebar layout for authenticated app pages
2. THE Marketing Site SHALL use full-width layout for marketing pages
3. THE SaaS Application SHALL use tabbed layout for settings pages
4. THE Authentication System SHALL use centered layout for auth pages
5. THE SaaS Application SHALL display navigation bar with user menu
6. THE Marketing Site SHALL display footer component
7. WHERE sidebar layout is enabled, THE SaaS Application SHALL display sidebar navigation
