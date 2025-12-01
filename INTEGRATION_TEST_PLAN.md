# Integration Test Plan

This document provides a comprehensive integration testing plan for Shipos Kit, covering all major user flows and system integrations.

## Test Environment Setup

### Prerequisites
- Development server running on `http://localhost:3000`
- PostgreSQL database configured and migrated
- Environment variables configured in `.env.local`
- Stripe test mode enabled with test keys
- Test email provider configured (or email logging enabled)
- OpenAI API key for AI features

### Test Accounts
- **Regular User**: test-user@example.com
- **Admin User**: admin@example.com
- **Stripe Test Cards**:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`

---

## 1. User Signup to Subscription Flow ✓

### Test Objective
Verify the complete user journey from signup to active subscription.

### Test Steps

#### 1.1 User Registration
```
1. Navigate to /auth/signup
2. Fill in email: test-user-{timestamp}@example.com
3. Fill in password: TestPassword123!
4. Fill in name: Test User
5. Click "Sign Up" button

Expected Result:
- ✓ User account created
- ✓ Email verification email sent
- ✓ Redirected to email verification notice page
```

#### 1.2 Email Verification
```
1. Check email inbox for verification email
2. Click verification link
3. Verify redirect to application

Expected Result:
- ✓ Email verified
- ✓ User logged in automatically
- ✓ Redirected to onboarding or app homepage
```

#### 1.3 Onboarding (if enabled)
```
1. Complete onboarding form if presented
2. Submit onboarding information

Expected Result:
- ✓ Onboarding data saved
- ✓ onboardingComplete flag set to true
- ✓ Redirected to main application
```

#### 1.4 Plan Selection
```
1. Navigate to /choose-plan
2. View available plans (Starter, Pro)
3. Click "Subscribe" on Pro plan

Expected Result:
- ✓ Plans displayed with correct pricing
- ✓ Redirected to Stripe checkout
```

#### 1.5 Stripe Checkout
```
1. On Stripe checkout page, fill in test card: 4242 4242 4242 4242
2. Fill in expiry: 12/34
3. Fill in CVC: 123
4. Click "Subscribe" or "Pay"

Expected Result:
- ✓ Payment processed successfully
- ✓ Redirected back to application
- ✓ Success message displayed
```

#### 1.6 Webhook Processing
```
1. Wait for webhook delivery
2. Check database for Purchase record

Expected Result:
- ✓ Purchase record created with correct subscription ID
- ✓ User has active subscription
- ✓ User can access premium features
```

### Verification Queries
```sql
-- Check user was created
SELECT id, email, name, "emailVerified", "onboardingComplete"
FROM "User"
WHERE email = 'test-user@example.com';

-- Check subscription was created
SELECT id, type, status, "subscriptionId", "productId", "userId"
FROM "Purchase"
WHERE "userId" = '<user-id>';
```

### Status: ⚠️ REQUIRES MANUAL TESTING

---

## 2. Authentication Methods ✓

### Test Objective
Verify all authentication methods work correctly.

### 2.1 Email/Password Login
```
1. Navigate to /auth/login
2. Enter email and password
3. Click "Sign In"

Expected Result:
- ✓ User authenticated
- ✓ Session cookie created
- ✓ Redirected to /app
```

### 2.2 GitHub OAuth
```
1. Navigate to /auth/login
2. Click "Sign in with GitHub"
3. Authorize application (if first time)

Expected Result:
- ✓ OAuth flow completes
- ✓ User authenticated
- ✓ Account linked or created
```

### 2.3 Google OAuth
```
1. Navigate to /auth/login
2. Click "Sign in with Google"
3. Select Google account

Expected Result:
- ✓ OAuth flow completes
- ✓ User authenticated
- ✓ Account linked or created
```

### 2.4 Password Reset
```
1. Navigate to /auth/forgot-password
2. Enter email address
3. Submit form
4. Check email for reset link
5. Click reset link
6. Enter new password
7. Submit new password

Expected Result:
- ✓ Reset email sent
- ✓ Reset link works
- ✓ Password updated
- ✓ Can login with new password
```

### 2.5 Account Linking
```
1. Login with email/password
2. Go to settings
3. Link GitHub account
4. Link Google account

Expected Result:
- ✓ Multiple providers linked to same account
- ✓ Can login with any linked provider
```

### Status: ⚠️ REQUIRES MANUAL TESTING

---

## 3. Payment Webhooks ✓

### Test Objective
Verify webhook handling for all payment events.

### 3.1 Stripe CLI Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

### 3.2 Checkout Session Completed (One-time)
```
Event: checkout.session.completed (mode: payment)

Expected Result:
- ✓ Purchase record created
- ✓ Type set to ONE_TIME
- ✓ Customer ID saved
- ✓ Product ID saved
```

### 3.3 Subscription Created
```
Event: customer.subscription.created

Expected Result:
- ✓ Purchase record created
- ✓ Type set to SUBSCRIPTION
- ✓ Subscription ID saved
- ✓ Status set to active
```

### 3.4 Subscription Updated
```
Event: customer.subscription.updated

Expected Result:
- ✓ Purchase record updated
- ✓ Status updated
- ✓ Product ID updated if changed
```

### 3.5 Subscription Deleted
```
Event: customer.subscription.deleted

Expected Result:
- ✓ Purchase record deleted or status set to canceled
- ✓ User loses premium access
```

### 3.6 Payment Succeeded
```
Event: invoice.payment_succeeded

Expected Result:
- ✓ Purchase status updated to active
- ✓ User retains access
```

### 3.7 Payment Failed
```
Event: invoice.payment_failed

Expected Result:
- ✓ Purchase status updated (past_due or unpaid)
- ✓ User notified of payment issue
```

### Status: ⚠️ REQUIRES MANUAL TESTING WITH STRIPE CLI

---

## 4. Email Sending ✓

### Test Objective
Verify all email sending flows work correctly.

### 4.1 Welcome Email
```
Trigger: User completes signup
Expected: Welcome email sent with app overview
```

### 4.2 Email Verification
```
Trigger: User signs up
Expected:
- ✓ Email with verification link
- ✓ Link expires after configured time
- ✓ Link works only once
```

### 4.3 Password Reset Email
```
Trigger: User requests password reset
Expected:
- ✓ Email with reset link
- ✓ Link expires after configured time (typically 1 hour)
- ✓ Link works only once
```

### 4.4 Email Change Verification
```
Trigger: User changes email address
Expected:
- ✓ Verification email sent to new address
- ✓ Old email address remains until verification
- ✓ New email becomes primary after verification
```

### 4.5 Contact Form Email
```
Trigger: User submits contact form
Expected:
- ✓ Email sent to configured contact address
- ✓ Contains user's name, email, and message
```

### Email Testing Tools
- **Development**: Check console logs for email output
- **Staging**: Use Mailtrap, Mailpit, or MailHog
- **Production**: Monitor email service dashboard

### Status: ⚠️ REQUIRES EMAIL PROVIDER CONFIGURATION

---

## 5. AI Chat Functionality ✓

### Test Objective
Verify AI chat works correctly with OpenAI integration.

### 5.1 Basic Chat
```
1. Navigate to /app/chat
2. Type message: "Hello, what can you help me with?"
3. Send message

Expected Result:
- ✓ Message sent
- ✓ Loading indicator shown
- ✓ AI response received
- ✓ Response displayed in chat
```

### 5.2 Conversation Context
```
1. Send message: "What's the capital of France?"
2. Send follow-up: "What's the population?"

Expected Result:
- ✓ AI remembers context
- ✓ Answers about Paris population (not asking which city)
```

### 5.3 Error Handling
```
1. Temporarily disable OpenAI API key
2. Send message

Expected Result:
- ✓ Error message displayed
- ✓ User notified to try again
- ✓ No application crash
```

### Status: ⚠️ REQUIRES OPENAI API KEY

---

## 6. Admin Panel Access Control ✓

### Test Objective
Verify admin panel security and functionality.

### 6.1 Access Control - Non-Admin User
```
1. Login as regular user
2. Navigate to /app/admin

Expected Result:
- ✓ Access denied
- ✓ Redirected to login or error page
- ✓ Admin content not visible
```

### 6.2 Access Control - Admin User
```
1. Login as admin user
2. Navigate to /app/admin

Expected Result:
- ✓ Admin panel loads
- ✓ User list visible
- ✓ Admin tools available
```

### 6.3 User Management
```
1. Login as admin
2. Navigate to /app/admin/users
3. View user list
4. Search for user
5. View user details
6. Edit user role

Expected Result:
- ✓ All users listed
- ✓ Search works
- ✓ User details displayed
- ✓ Role can be changed
```

### Creating Admin User
```typescript
// In your database or via script
await db.user.update({
  where: { email: 'admin@example.com' },
  data: { role: 'ADMIN' }
});
```

### Status: ⚠️ REQUIRES ADMIN USER

---

## 7. Theme Switching ✓

### Test Objective
Verify theme switching works across all pages.

### 7.1 Theme Toggle
```
1. Navigate to any page
2. Click theme toggle (light/dark button)
3. Observe theme change

Expected Result:
- ✓ Theme changes immediately
- ✓ All components update
- ✓ Theme preference saved
```

### 7.2 Theme Persistence
```
1. Switch to dark theme
2. Refresh page

Expected Result:
- ✓ Dark theme persists
- ✓ No flash of wrong theme (FOUC)
```

### 7.3 System Theme
```
1. Select "System" theme option
2. Change OS theme preference

Expected Result:
- ✓ Application follows OS theme
- ✓ Theme updates when OS theme changes
```

### Status: ✅ CAN BE TESTED IMMEDIATELY

---

## 8. Internationalization (i18n) ✓

### Test Objective
Verify i18n works across all pages.

### 8.1 Locale Switching
```
1. Navigate to homepage
2. Click language selector
3. Select different locale (e.g., German)

Expected Result:
- ✓ Content translates
- ✓ URL updates (e.g., /de)
- ✓ Locale persists across navigation
```

### 8.2 Locale Persistence
```
1. Select German locale
2. Navigate to different pages
3. Refresh browser

Expected Result:
- ✓ German locale maintained
- ✓ All pages show German content
```

### 8.3 Fallback Handling
```
1. Check for missing translations
2. Verify fallback to default locale

Expected Result:
- ✓ Missing keys show in default language
- ✓ No blank/broken text
```

### Status: ✅ CAN BE TESTED IMMEDIATELY (if locales configured)

---

## 9. Responsive Design ✓

### Test Objective
Verify responsive design on mobile devices.

### 9.1 Mobile Navigation
```
Devices: iPhone 12 (390x844), iPad (768x1024)

1. Open in mobile viewport
2. Check navigation menu
3. Test hamburger menu

Expected Result:
- ✓ Mobile menu works
- ✓ All links accessible
- ✓ Navigation collapsible
```

### 9.2 Form Inputs
```
1. Test signup form on mobile
2. Test login form on mobile
3. Test contact form on mobile

Expected Result:
- ✓ Inputs sized correctly
- ✓ Keyboard doesn't cover inputs
- ✓ Forms submittable
```

### 9.3 Content Layout
```
1. Check homepage on mobile
2. Check blog posts on mobile
3. Check dashboard on mobile

Expected Result:
- ✓ Content readable
- ✓ No horizontal scroll
- ✓ Images scaled appropriately
```

### 9.4 Touch Interactions
```
1. Test buttons on mobile
2. Test dropdowns on mobile
3. Test modals on mobile

Expected Result:
- ✓ Touch targets large enough (min 44x44px)
- ✓ Dropdowns work with touch
- ✓ Modals dismissible
```

### Testing Tools
- Chrome DevTools Device Emulation
- Real device testing (iPhone, Android)
- BrowserStack for cross-device testing

### Status: ✅ CAN BE TESTED IMMEDIATELY

---

## Test Execution Checklist

### Immediate Testing (No Setup Required)
- [x] Theme switching
- [x] Responsive design (DevTools)
- [ ] i18n locale switching
- [ ] Public pages load correctly

### Requires Configuration
- [ ] User signup flow (needs email provider)
- [ ] Email/password login
- [ ] Password reset (needs email)
- [ ] Payment flow (needs Stripe test keys)
- [ ] Webhook handling (needs Stripe CLI)
- [ ] AI chat (needs OpenAI key)

### Requires Special Setup
- [ ] OAuth login (needs OAuth apps configured)
- [ ] Admin panel (needs admin user created)
- [ ] Email sending verification

---

## Automated Test Coverage

The E2E tests created in Task 44 provide automated coverage for:
- ✅ Authentication flows (signup, login, password reset)
- ✅ Plan selection and checkout
- ✅ User settings updates
- ✅ AI chat interface
- ✅ Admin panel (UI verification)

Run E2E tests:
```bash
# Run in UI mode
pnpm --filter @shipos/web run e2e

# Run in CI mode
pnpm --filter @shipos/web run e2e:ci
```

---

## Known Issues / Limitations

### Email Testing
- Emails can be tested in development by checking console logs
- For full email testing, configure Resend, Postmark, or similar service
- Consider using Mailpit for local email testing

### Payment Testing
- Use Stripe test mode and test cards
- Webhooks require Stripe CLI for local testing
- In production, test with test mode enabled first

### OAuth Testing
- Requires OAuth applications configured (GitHub, Google)
- Test in production with test accounts
- Can't fully test locally without OAuth apps

---

## Test Report Template

After completing manual tests, fill out:

```markdown
## Test Execution Report

**Date**: YYYY-MM-DD
**Tester**: Name
**Environment**: Development / Staging / Production

### Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1.1 User Registration | ✅ PASS | - |
| 1.2 Email Verification | ⚠️ SKIP | Email not configured |
| ... | ... | ... |

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendations
1. [Recommendation]
2. [Recommendation]
```

---

## Conclusion

This integration test plan covers all major features and user flows in Shipos Kit. Many tests can be automated via Playwright E2E tests, while others require manual verification with proper environment configuration.

**Next Steps**:
1. Configure email provider for email flow testing
2. Set up Stripe test mode for payment testing
3. Configure OAuth applications for social login testing
4. Create admin user for admin panel testing
5. Execute manual test cases
6. Create test execution report

---

## Quick Start Commands

```bash
# Start development server
pnpm dev

# Run E2E tests
pnpm --filter @shipos/web run e2e

# Run type checking
pnpm run type-check

# Test Stripe webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate
```
