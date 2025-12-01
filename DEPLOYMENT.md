# Deployment Guide

This guide covers the deployment process for Shipos Kit, a production-ready SaaS starter kit built with Next.js 15.

## Prerequisites

- Node.js 20 or higher
- pnpm 10.14.0
- PostgreSQL database (production-ready)
- GitHub account (for OAuth)
- Stripe account (for payments)
- OpenAI API key (for AI features)

## Environment Setup

### 1. Environment Variables

Copy the `.env.local.example` file to `.env.local` and configure all required variables:

```bash
cp .env.local.example .env.local
```

### Required Environment Variables

#### Database Configuration
```env
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"
```

For production, use a connection pooler URL for `DATABASE_URL` and a direct connection for `DIRECT_URL`.

#### Authentication
```env
BETTER_AUTH_SECRET="your-random-secret-string"
BETTER_AUTH_URL="https://your-domain.com"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Generate a secure random secret for `BETTER_AUTH_SECRET`:
```bash
openssl rand -base64 32
```

#### Payment Provider (Stripe)
```env
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Product Price IDs
STRIPE_PRICE_ID_STARTER="price_..."
STRIPE_PRICE_ID_PRO="price_..."
```

#### Email Provider
Configure one of the supported email providers (nodemailer, Plunk, Resend, Postmark, or Mailgun).

Example with Resend:
```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

#### Storage (S3)
```env
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
S3_REGION="us-east-1"
S3_ENDPOINT="https://s3.amazonaws.com"
NEXT_PUBLIC_AVATARS_BUCKET_NAME="avatars"
```

#### AI Features
```env
OPENAI_API_KEY="sk-..."
```

## Build Process

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Generate Prisma Client

```bash
pnpm db:generate
```

This generates the Prisma Client and Zod schemas based on your database schema.

### 3. Build the Application

```bash
pnpm build
```

This command:
- Builds all packages in the monorepo
- Generates optimized production bundles
- Creates static assets

## Database Setup

### Development and Staging

For development or staging environments, you can use `db:push` to sync your schema without migrations:

```bash
pnpm db:push
```

### Production

For production deployments, always use migrations:

```bash
# Generate a new migration (do this in development)
pnpm db:migrate

# Apply migrations (do this in production)
cd packages/database
pnpm prisma migrate deploy --schema=./prisma/schema.prisma
```

**Important**: Never use `db:push` in production. Always use proper migrations to track schema changes.

## Deployment to Vercel

### 1. Install Vercel CLI (Optional)

```bash
pnpm add -g vercel
```

### 2. Connect to Vercel

```bash
vercel login
vercel link
```

### 3. Configure Build Settings

In your Vercel project settings:

- **Framework Preset**: Next.js
- **Root Directory**: `./apps/web`
- **Build Command**: `cd ../.. && pnpm install && pnpm build --filter=@shipos/web`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install`
- **Node Version**: 20.x

### 4. Environment Variables

Add all required environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from your `.env.local` file
4. Make sure to add them for all environments (Production, Preview, Development)

### 5. Database Migration Command

In Vercel project settings, add a build command that runs migrations:

**Build Command**:
```bash
cd ../.. && pnpm install && pnpm db:generate && cd packages/database && pnpm prisma migrate deploy --schema=./prisma/schema.prisma && cd ../.. && pnpm build --filter=@shipos/web
```

Alternatively, use Vercel's build hooks or a separate migration job.

### 6. Deploy

```bash
vercel --prod
```

Or push to your main branch if you have automatic deployments enabled.

## Webhook Configuration

### Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add a new endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Database migrations have been applied successfully
- [ ] Test user registration and email verification
- [ ] Test OAuth login (GitHub, Google)
- [ ] Test password reset flow
- [ ] Test Stripe checkout and webhook handling
- [ ] Test AI chat functionality
- [ ] Verify file uploads to S3 work correctly
- [ ] Check that emails are being sent correctly
- [ ] Test admin panel access
- [ ] Verify sitemap.xml is accessible
- [ ] Check robots.txt is properly configured
- [ ] Test all critical user flows with Playwright tests

## Running in Production

After deployment, your application will be available at your configured domain.

To run the production build locally for testing:

```bash
pnpm build
pnpm start
```

This starts the Next.js production server on port 3000.

## Troubleshooting

### Build Failures

**Issue**: Build fails with module not found errors

**Solution**: Ensure all dependencies are installed and the monorepo structure is intact:
```bash
pnpm install
pnpm db:generate
pnpm build
```

### Database Connection Issues

**Issue**: Cannot connect to database

**Solution**:
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check database server is accessible from your deployment environment
- Ensure database user has proper permissions
- For connection pooling (like Supabase), use pooled URL for `DATABASE_URL` and direct URL for `DIRECT_URL`

### Prisma Client Errors

**Issue**: `@prisma/client did not initialize yet`

**Solution**: Run Prisma generate before building:
```bash
pnpm db:generate
```

### Environment Variables Not Loading

**Issue**: Environment variables are undefined in production

**Solution**:
- Verify all variables are added in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding new variables
- For `NEXT_PUBLIC_*` variables, they must be set at build time

### Webhook Failures

**Issue**: Stripe webhooks failing

**Solution**:
- Verify webhook endpoint is publicly accessible
- Check `STRIPE_WEBHOOK_SECRET` matches the one from Stripe dashboard
- Review webhook logs in Stripe dashboard
- Ensure webhook signature verification is working

### Email Sending Issues

**Issue**: Emails not being sent

**Solution**:
- Verify email provider credentials are correct
- Check email provider rate limits and quotas
- Test with a different email address
- Review email provider logs
- Ensure `FROM_EMAIL` domain is verified with your provider

## Monitoring and Logging

The application uses structured logging with the `@shipos/logs` package. In production:

- All logs are output in JSON format
- Errors include stack traces
- Each log entry includes timestamps and metadata

To monitor your application:
- Use Vercel's built-in logging
- Set up external monitoring (e.g., Sentry, LogRocket)
- Monitor database performance
- Track API endpoint performance
- Set up alerts for critical errors

## Scaling Considerations

As your application grows:

1. **Database**: Consider upgrading to a more powerful database instance or implementing read replicas
2. **File Storage**: Monitor S3 costs and implement CDN caching
3. **API Rate Limiting**: Implement rate limiting on API endpoints
4. **Caching**: Add Redis for session and data caching
5. **Background Jobs**: Consider implementing a job queue for long-running tasks

## Security Checklist

- [ ] All environment variables are stored securely
- [ ] Database credentials are rotated regularly
- [ ] HTTPS is enforced on all endpoints
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled on API routes
- [ ] File upload size limits are enforced
- [ ] Webhook signatures are verified
- [ ] SQL injection protection is in place (Prisma handles this)
- [ ] XSS protection is enabled (React escaping)
- [ ] CSRF protection is implemented (Better Auth handles this)

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Better Auth Documentation](https://better-auth.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
