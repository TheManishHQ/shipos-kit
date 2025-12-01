# Implementation Plan

-   [x] 1. Set up monorepo infrastructure

    -   Initialize pnpm workspace with workspaces configuration in root package.json
    -   Install and configure Turborepo with turbo.json for build orchestration
    -   Create directory structure: apps/web/, packages/, config/, tooling/
    -   Set up shared TypeScript configs in tooling/typescript/ with base, nextjs, and react library configs
    -   Configure path aliases in tsconfig files (@repo/_, @saas/_, @ui/_, @i18n/_)
    -   _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 21.2, 21.3, 21.7_

-   [x] 2. Configure development tooling

    -   Install and configure Biome in tooling/biome/ for linting and formatting
    -   Create Biome config with TypeScript, React, and Next.js rules
    -   Set up Tailwind CSS 4.1.12 in tooling/tailwind/ with theme variables
    -   Create theme.css with CSS variables for light and dark modes
    -   Add package.json scripts: dev, build, start, lint, format, check, clean
    -   _Requirements: 21.1, 21.4, 21.6, 18.3_

-   [x] 3. Initialize Next.js application

    -   Create Next.js 15.5.2 app in apps/web/ with App Router
    -   Configure next.config.ts with i18n and image optimization settings
    -   Set up root layout with metadata and theme provider
    -   Create basic app structure with app/, components/, and lib/ directories
    -   Install core dependencies: React 19.1.1, TypeScript 5.9.2
    -   _Requirements: 1.3, 21.4_

-   [x] 4. Set up database with Prisma

    -   Initialize Prisma in packages/database/
    -   Create Prisma schema with User, Session, Account, Verification, Passkey, TwoFactor, Purchase, AiChat models
    -   Configure PostgreSQL connection with DATABASE_URL
    -   Generate Prisma client and Zod schemas
    -   Create database client abstraction with type-safe query helpers
    -   Add migration scripts to package.json
    -   _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10_

-   [x] 5. Implement configuration system

    -   Create config/index.ts with centralized configuration object
    -   Define feature flags for i18n, auth methods, billing, onboarding, themes
    -   Configure locale settings with supported languages and currencies
    -   Define payment plans with pricing, intervals, and trial periods
    -   Export typed configuration for use across packages
    -   _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6, 25.7, 25.8, 25.9_

-   [x] 6. Set up authentication system with better-auth

    -   Install better-auth v1.3.7 in packages/auth/
    -   Configure better-auth with Prisma adapter
    -   Enable email/password authentication with validation
    -   Configure session management with 30-day expiration
    -   Set up session tracking with IP address and user agent
    -   Create auth client for frontend usage
    -   _Requirements: 2.1, 2.2, 2.5, 6.1, 6.2, 6.5, 23.1, 23.2_

-   [x] 7. Implement email verification flow

    -   Configure email verification in better-auth
    -   Set up verification token generation and storage
    -   Create email verification endpoint
    -   Implement auto sign-in after verification
    -   Add email verification status checks
    -   Create i18n package with translations
    -   Create mail package with email templates
    -   Integrate email sending in auth flows
    -   _Requirements: 2.2, 2.3, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 15.1, 15.2_

-   [x] 8. Add passwordless authentication

    -   Enable magic link authentication in better-auth config
    -   Configure magic link email sending
    -   Set up magic link verification endpoint
    -   Add magic link request UI component
    -   _Requirements: 3.1, 3.2_

-   [x] 9. Integrate OAuth providers

    -   Configure Google OAuth with email and profile scopes
    -   Configure GitHub OAuth with user:email scope
    -   Set up OAuth callback handlers
    -   Implement account linking for trusted providers
    -   Add social login buttons to auth pages
    -   _Requirements: 3.3, 3.4, 3.5, 23.6_

-   [x] 10. Implement passkey authentication

    -   Enable passkey/WebAuthn in better-auth config
    -   Create passkey registration flow
    -   Implement passkey authentication flow
    -   Store passkey metadata (device type, backed up status)
    -   Add passkey management UI in settings
    -   _Requirements: 4.1, 4.2_

-   [x] 11. ~~Add two-factor authentication~~ (REMOVED - Not needed for this project)

    -   ~~Enable 2FA/TOTP in better-auth config~~
    -   ~~Implement TOTP secret generation~~
    -   ~~Create backup codes generation and storage~~
    -   ~~Build 2FA setup flow with QR code display~~
    -   ~~Add 2FA verification step in login flow~~
    -   ~~Implement backup code usage and invalidation~~
    -   _Requirements: 4.3, 4.4, 4.5, 23.5_

-   [x] 12. Build user account management

    -   Create user profile update endpoint and UI
    -   Implement avatar upload with image cropping (CropperJS)
    -   Build email change flow with verification
    -   Create password change functionality
    -   Add "set password" option for social login users
    -   Implement connected accounts display
    -   _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

-   [x] 13. Implement session management

    -   Create active sessions list endpoint
    -   Build sessions management UI showing device info
    -   Implement session revocation functionality
    -   Add current session indicator
    -   _Requirements: 6.3, 6.4_

-   [ ] ~~14. Add user roles and banning system~~ (OPTIONAL - Skip for simple applications)

    -   ~~Implement role assignment functionality (admin only)~~
    -   ~~Create user banning system with reason and expiration~~
    -   ~~Add ban check in authentication flow~~
    -   ~~Build admin UI for role and ban management~~
    -   ~~Implement admin route protection middleware~~
    -   _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
    -   _Note: Only implement if you need multi-role systems or user moderation_

-   [x] 15. Set up email system

    -   Create email provider abstraction in packages/mail/
    -   Implement email provider (Console/Resend)
    -   Build React email templates: EmailVerification, ForgotPassword, MagicLink, NewsletterSignup, NewUser
    -   Implement locale-aware email sending
    -   Create email sending service with template rendering
    -   _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_

-   [x] 16. Implement storage system

    -   Create storage provider abstraction in packages/storage/
    -   Implement S3 storage provider with AWS SDK
    -   Build presigned upload URL generation (60s expiration)
    -   Build presigned download URL generation
    -   Create image proxy endpoint for secure serving
    -   Set up avatars bucket configuration
    -   _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

-   [x] 17. Set up internationalization

    -   Install and configure next-intl 4.3.5 in packages/i18n/
    -   Create translation files for English and German
    -   Set up locale detection from cookie and headers
    -   Implement locale-aware routing with /[locale]/ prefix
    -   Create language selector component
    -   Configure locale cookie management
    -   _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

-   [x] 18. Build payment provider abstraction

    -   Create unified PaymentProvider interface in packages/payments/
    -   Define WebhookEvent interface for normalized events
    -   Implement provider selection logic based on environment variable
    -   Create checkout session, customer portal, and subscription management methods
    -   _Requirements: 9.3, 9.4, 9.5_

-   [x] 19. Integrate Stripe payment provider

    -   Install Stripe SDK in packages/payments/
    -   Implement StripeProvider class with PaymentProvider interface
    -   Create checkout session creation with Stripe API
    -   Implement customer portal link generation
    -   Build subscription cancellation and update methods
    -   Implement webhook signature verification using stripe-signature header
    -   Map Stripe events to unified WebhookEvent format
    -   _Requirements: 9.1, 11.1_

-   [x] 20. ~~Integrate DodoPayments provider~~ (REMOVED - Using Stripe only)

    -   ~~Install DodoPayments SDK in packages/payments/~~
    -   ~~Implement DodoPaymentsProvider class with PaymentProvider interface~~
    -   ~~Create checkout session creation with DodoPayments API~~
    -   ~~Implement customer portal link generation~~
    -   ~~Build subscription management methods~~
    -   ~~Implement HMAC SHA256 webhook signature verification~~
    -   ~~Map DodoPayments events to unified WebhookEvent format~~
    -   _Requirements: 9.2, 11.2_

-   [x] 21. Build subscription management

    -   Create plan configuration in config with Free, Pro, Lifetime, Enterprise plans
    -   Build checkout session creation endpoint
    -   Implement customer portal link endpoint
    -   Create active subscription display component
    -   Build pricing table component with plan comparison
    -   Implement subscription cancellation flow
    -   Add trial period support in checkout
    -   _Requirements: 10.1, 10.2, 10.5, 10.6, 10.7_

-   [x] 22. Implement payment webhooks

    -   Create webhook handler endpoint for Stripe
    -   Implement signature verification for Stripe
    -   Handle checkout.session.completed events
    -   Handle subscription.created events
    -   Handle subscription.updated events
    -   Handle subscription.deleted/cancelled events
    -   Create/update Purchase records in database
    -   Update User.paymentsCustomerId field
    -   Add error logging for webhook failures
    -   _Requirements: 10.3, 10.4, 11.3, 11.4, 11.5, 11.6, 11.7, 23.3_

-   [x] 23. Set up ORPC API infrastructure

    -   Install ORPC packages in packages/api/
    -   Create base procedures: publicProcedure, protectedProcedure, adminProcedure
    -   Implement authentication middleware for protected routes
    -   Implement admin role check middleware
    -   Set up error handling with proper HTTP status codes
    -   Configure OpenAPI schema generation
    -   _Requirements: 20.1, 20.2, 20.9, 20.10, 20.11_

-   [x] 24. Build API modules

    -   Create admin API module with listUsers and listOrganizations endpoints
    -   Create AI API module with chat CRUD operations
    -   Create contact API module with form submission endpoint
    -   Create newsletter API module with subscription endpoint
    -   Create payments API module with checkout, portal, and purchases endpoints
    -   Create users API module with avatar upload and user management endpoints
    -   _Requirements: 20.3, 20.4, 20.5, 20.6, 20.7, 20.8_

-   [x] 25. Implement AI chat system

    -   Install OpenAI SDK in packages/ai/
    -   Configure OpenAI client with API key
    -   Create chat response generation with GPT-4o-mini
    -   Implement streaming text responses using AI SDK
    -   Build chat creation endpoint
    -   Build add message endpoint with AI response generation
    -   Create chat listing endpoint (user-scoped)
    -   Implement chat update and delete endpoints
    -   _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

-   [x] 26. Add AI image and audio features

    -   Implement image generation with DALL-E 3
    -   Implement audio transcription with Whisper-1
    -   Create API endpoints for image and audio operations
    -   _Requirements: 12.7, 12.8_

-   [x] 27. Build UI component library

    -   Install Shadcn UI and Radix UI packages
    -   Create form components with React Hook Form and Zod
    -   Build button, input, select, textarea components
    -   Create dialog and alert dialog components
    -   Implement toast notifications with Sonner
    -   Build table components with TanStack Table
    -   Create avatar component with boring-avatars fallback
    -   Implement image cropper with react-cropper
    -   Build file upload dropzone with react-dropzone
    -   Create pagination, tabs, accordion, tooltip components
    -   _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 19.10, 19.11_

-   [x] 28. Implement theme system

    -   Create ThemeProvider component with context
    -   Build theme switcher component
    -   Implement theme persistence in localStorage
    -   Apply theme class to document root
    -   Configure Tailwind with theme CSS variables
    -   _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

-   [x] 29. Build authentication pages

    -   Create login page with email/password form
    -   Create signup page with validation
    -   Build forgot password page
    -   Create reset password page
    -   Build email verification page
    -   Add social login buttons
    -   Implement magic link request form
    -   Style with centered auth layout
    -   _Requirements: 27.8_

-   [x] 30. Create SaaS application dashboard

    -   Build main dashboard page at /app
    -   Create sidebar navigation component (if enabled)
    -   Build navigation bar with user menu
    -   Implement user dropdown with profile and logout
    -   Add active plan display
    -   Create dashboard layout wrapper
    -   _Requirements: 27.9, 28.1, 28.6, 28.7_

-   [x] 31. Build user settings pages

    -   Create settings layout with tabs
    -   Build general settings page (profile, avatar, locale)
    -   Create billing settings page (active plan, manage subscription)
    -   Build security settings page (password, 2FA, passkeys, sessions)
    -   Create danger zone page (account deletion)
    -   Implement account deletion with subscription cancellation
    -   _Requirements: 27.10, 5.7, 28.3_

-   [x] 32. Implement AI chat interface

    -   Create chat list sidebar component
    -   Build chat message display component
    -   Implement message input with streaming response
    -   Add new chat creation button
    -   Build chat deletion confirmation
    -   Create chat title editing
    -   _Requirements: 27.11_

-   [x] 33. Build admin panel

    -   Create admin layout with navigation
    -   Build users list page with pagination
    -   Implement user details view
    -   Add role management UI
    -   Create ban user functionality
    -   Implement admin route protection
    -   _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 27.12_

-   [ ] 34. Create marketing homepage

    -   Build hero section with CTA
    -   Create features section
    -   Build FAQ section with accordion
    -   Create pricing section with plan cards
    -   Add contact form section
    -   Implement newsletter signup
    -   Style with marketing layout
    -   _Requirements: 16.1, 16.7, 16.8, 27.1, 27.2, 28.2, 28.5_

-   [ ] 35. Set up blog system

    -   Configure MDX for blog posts
    -   Create blog listing page
    -   Build individual blog post page
    -   Implement blog post metadata parsing
    -   Add multi-language blog post support
    -   _Requirements: 16.2, 16.3, 16.4, 16.9, 27.3_

-   [ ] 36. Build documentation site

    -   Install and configure Fumadocs
    -   Create documentation pages with MDX
    -   Implement table of contents
    -   Add search functionality
    -   Support multi-language documentation
    -   _Requirements: 16.5, 16.9, 27.4_

-   [ ] 37. Create legal and changelog pages

    -   Build changelog page with updates
    -   Create Terms of Service page
    -   Create Privacy Policy page
    -   Support multi-language legal pages
    -   _Requirements: 16.6, 16.9, 27.5, 27.7_

-   [ ] 38. Implement contact form

    -   Create contact form component with validation
    -   Build contact form submission endpoint
    -   Implement email sending to configured address
    -   Add success/error notifications
    -   _Requirements: 16.7, 27.6_

-   [ ] 39. Build user onboarding flow

    -   Create onboarding page with form
    -   Implement onboarding completion tracking
    -   Add redirect logic for incomplete onboarding
    -   Make onboarding configurable via feature flag
    -   _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5, 27.13_

-   [ ] 40. Implement plan selection page

    -   Create plan selection page at /choose-plan
    -   Display all available plans with pricing
    -   Add checkout button for each plan
    -   Implement redirect to checkout session
    -   _Requirements: 27.13_

-   [ ] 41. Set up SEO and metadata

    -   Create dynamic sitemap generation at /sitemap.xml
    -   Generate robots.txt at /robots.txt
    -   Add metadata to all pages
    -   Implement Open Graph tags
    -   Add structured data for rich results
    -   Configure locale-aware URLs
    -   _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6_

-   [ ] 42. Implement logging system

    -   Create logger utility in packages/logs/
    -   Add structured logging with JSON format
    -   Implement log levels (info, warn, error)
    -   Add error logging with stack traces
    -   Include timestamps and metadata in logs
    -   _Requirements: 20.11_

-   [ ] 43. Set up Playwright testing

    -   Install Playwright in apps/web/
    -   Configure Playwright with test directory and base URL
    -   Set up video recording on failure
    -   Configure trace on first retry
    -   Add web server configuration for tests
    -   Create example homepage test
    -   _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6_

-   [ ]\* 44. Write E2E tests for critical flows

    -   Write signup and email verification test
    -   Create login test
    -   Write password reset flow test
    -   Create plan selection and checkout test (test mode)
    -   Write user settings update test
    -   Create AI chat test
    -   Write admin user management test
    -   _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6_

-   [ ] 45. Implement security measures

    -   Verify session cookie security settings (HTTP-only, secure, SameSite)
    -   Implement input validation with Zod on all API endpoints
    -   Add file type and size validation for uploads
    -   Verify webhook signature checks are in place
    -   Test XSS protection with React escaping
    -   _Requirements: 23.1, 23.2, 23.3, 23.4, 23.7, 23.8, 23.9_

-   [ ] 46. Add database indexing

    -   Add index on User.email field
    -   Add index on Purchase.subscriptionId field
    -   Add index on Session.token field
    -   Add index on Session.userId field
    -   Run migration to apply indexes
    -   _Requirements: 8.2, 8.3, 8.8_

-   [ ] 47. Set up environment variables

    -   Create .env.example with all required variables
    -   Document DATABASE_URL configuration
    -   Document authentication environment variables
    -   Document payment provider variables (both Stripe and DodoPayments)
    -   Document OpenAI API key
    -   Document email provider variables
    -   Document S3 storage variables
    -   Add environment variable validation on startup
    -   _Requirements: All requirements using external services_

-   [ ] 48. Create deployment documentation

    -   Document build process steps
    -   Create deployment guide for Vercel
    -   Add database migration instructions
    -   Document environment variable setup
    -   Create troubleshooting guide
    -   _Requirements: 21.6_

-   [ ] 49. Final integration and testing
    -   Test complete user signup to subscription flow
    -   Verify all authentication methods work
    -   Test payment webhooks with test events
    -   Verify email sending in all flows
    -   Test AI chat functionality
    -   Verify admin panel access control
    -   Test theme switching
    -   Verify i18n works across all pages
    -   Test responsive design on mobile
    -   _Requirements: All requirements_
