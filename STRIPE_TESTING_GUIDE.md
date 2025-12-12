# Stripe Testing Guide

Complete guide for testing Stripe integration in Shipos Kit.

## Prerequisites

1. **Stripe Account** - Sign up at [stripe.com](https://stripe.com) (free)
2. **Development Server** - Your app running on `http://localhost:3000`
3. **Stripe CLI** (optional, for webhook testing)

---

## Step 1: Get Stripe Test API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top right)
3. Navigate to **Developers** → **API keys**
4. Copy your **Secret key** (starts with `sk_test_...`)
5. Copy your **Publishable key** (starts with `pk_test_...`) - if needed

---

## Step 2: Create Test Products and Prices

You need to create products in Stripe that match your `config/index.ts`:

### In Stripe Dashboard:

1. Go to **Products** → **Add Product**

2. **Create "Pro Monthly" Product:**
   - Name: `Pro Monthly`
   - Description: `Pro plan billed monthly`
   - Pricing: Recurring, Monthly, $29.00 USD
   - Copy the **Price ID** (starts with `price_...`)

3. **Create "Pro Yearly" Product:**
   - Name: `Pro Yearly`
   - Description: `Pro plan billed yearly`
   - Pricing: Recurring, Yearly, $290.00 USD
   - Copy the **Price ID**

4. **Create "Lifetime" Product:**
   - Name: `Lifetime`
   - Description: `One-time lifetime purchase`
   - Pricing: One-time, $999.00 USD
   - Copy the **Price ID**

### Update Config

Update `config/index.ts` with your actual Stripe Price IDs:

```typescript
payments: {
  plans: {
    pro: {
      recommended: true,
      prices: [
        {
          productId: 'price_YOUR_MONTHLY_PRICE_ID',  // Replace with actual ID
          amount: 2900,
          currency: 'USD',
          type: 'recurring' as const,
          interval: 'month' as const,
          trialPeriodDays: 14,
        },
        {
          productId: 'price_YOUR_YEARLY_PRICE_ID',  // Replace with actual ID
          amount: 29000,
          currency: 'USD',
          type: 'recurring' as const,
          interval: 'year' as const,
        },
      ],
    },
    lifetime: {
      prices: [
        {
          productId: 'price_YOUR_LIFETIME_PRICE_ID',  // Replace with actual ID
          amount: 99900,
          currency: 'USD',
          type: 'one-time' as const,
        },
      ],
    },
  },
}
```

---

## Step 3: Configure Environment Variables

Add to your `.env.local` file:

```bash
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

**Note:** For local webhook testing, you'll get the webhook secret from Stripe CLI (see Step 5).

---

## Step 4: Test Checkout Flow

### 4.1 Start Your Development Server

```bash
pnpm dev
```

### 4.2 Test Subscription Checkout

1. Navigate to `/choose-plan` (or wherever your pricing page is)
2. Click "Subscribe" on a Pro plan
3. You'll be redirected to Stripe Checkout
4. Use Stripe test cards:

#### Test Cards

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | ✅ Success - Visa |
| `4000 0000 0000 0002` | ❌ Decline - Card declined |
| `4000 0025 0000 3155` | 🔒 3D Secure - Requires authentication |
| `4000 0000 0000 9995` | ❌ Insufficient funds |

**For all test cards:**
- **Expiry:** Any future date (e.g., 12/25)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

### 4.3 Complete Test Payment

1. Fill in test card: `4242 4242 4242 4242`
2. Use any future expiry date
3. Use any CVC
4. Complete checkout
5. You should be redirected back to your app
6. Check your database - a `Purchase` record should be created

---

## Step 5: Test Webhooks Locally

Webhooks are crucial for syncing payment events. Test them locally using Stripe CLI.

### 5.1 Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux/Windows:**
See [Stripe CLI Installation](https://stripe.com/docs/stripe-cli)

### 5.2 Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authorize the CLI.

### 5.3 Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will:
- Forward webhook events to your local server
- Print a webhook signing secret (starts with `whsec_...`)
- Show all webhook events in real-time

**Copy the webhook secret** and add it to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_CLI_WEBHOOK_SECRET
```

### 5.4 Trigger Test Events

In a **new terminal**, trigger test events:

```bash
# Test subscription created
stripe trigger customer.subscription.created

# Test checkout completed (one-time payment)
stripe trigger checkout.session.completed

# Test subscription updated
stripe trigger customer.subscription.updated

# Test subscription canceled
stripe trigger customer.subscription.deleted

# Test payment succeeded
stripe trigger invoice.payment_succeeded

# Test payment failed
stripe trigger invoice.payment_failed
```

Watch your first terminal to see webhook events being received and processed.

---

## Step 6: Verify Database Records

After completing a test checkout, verify the data:

### Check Purchase Record

```sql
SELECT * FROM "Purchase" ORDER BY "createdAt" DESC LIMIT 5;
```

You should see:
- `userId` - Your user ID
- `customerId` - Stripe customer ID (starts with `cus_...`)
- `subscriptionId` - For subscriptions (starts with `sub_...`)
- `productId` - Your Stripe price ID
- `type` - `SUBSCRIPTION` or `ONE_TIME`
- `status` - `active`, `canceled`, etc.

### Check User Record

```sql
SELECT id, email, "paymentsCustomerId" FROM "User" WHERE email = 'your-test-email@example.com';
```

The `paymentsCustomerId` should be set to the Stripe customer ID.

---

## Step 7: Test Customer Portal

The customer portal allows users to manage their subscriptions.

### 7.1 Access Portal

1. Go to `/app/settings/billing`
2. Click "Manage Billing" or similar button
3. You'll be redirected to Stripe Customer Portal

### 7.2 Test Portal Features

In the portal, you can:
- ✅ Update payment method
- ✅ View invoices
- ✅ Cancel subscription
- ✅ Update billing information

### 7.3 Verify Changes Sync

After canceling a subscription in the portal:
1. Check your database - purchase status should update
2. Check Stripe CLI terminal - you should see `customer.subscription.updated` event
3. Refresh your app - subscription status should reflect changes

---

## Step 8: Test Different Scenarios

### 8.1 Test Subscription with Trial

1. Subscribe to Pro Monthly (has 14-day trial)
2. Check database - status should be `trialing`
3. After trial ends, Stripe will charge automatically

### 8.2 Test One-Time Payment

1. Purchase Lifetime plan
2. Check database - type should be `ONE_TIME`
3. No subscription ID should be created

### 8.3 Test Payment Failure

1. Use card `4000 0000 0000 0002` (declined)
2. Checkout should fail
3. No purchase record should be created

### 8.4 Test Subscription Cancellation

1. Create a subscription
2. Cancel via Customer Portal
3. Check database - status should update to `canceled`
4. User should lose premium access

---

## Step 9: Monitor Webhook Events

### View Webhook Logs

In Stripe Dashboard:
1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. View event logs and responses

### Check Application Logs

Your application logs webhook processing:

```bash
# Check server logs for webhook events
# Look for:
# - "Stripe webhook error" (if verification fails)
# - "Stripe webhook processing error" (if processing fails)
# - Successful 204 responses
```

---

## Step 10: Common Issues & Solutions

### Issue: "Missing env variable STRIPE_SECRET_KEY"

**Solution:**
- Add `STRIPE_SECRET_KEY` to your `.env.local`
- Restart your development server

### Issue: "Webhook signature verification failed"

**Solution:**
- Ensure `STRIPE_WEBHOOK_SECRET` matches the one from Stripe CLI
- If using Stripe Dashboard webhooks, use that secret instead
- Make sure you're using the correct secret for test mode

### Issue: "Product ID not found"

**Solution:**
- Verify price IDs in `config/index.ts` match Stripe Dashboard
- Make sure you're using **test mode** price IDs (not live mode)
- Check that products exist in Stripe Dashboard

### Issue: "Customer not found"

**Solution:**
- Ensure `paymentsCustomerId` is saved in user record after first purchase
- Check database: `SELECT "paymentsCustomerId" FROM "User" WHERE id = '...'`

### Issue: Webhooks not received locally

**Solution:**
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check that your server is running on port 3000
- Verify webhook endpoint exists: `/api/webhooks/stripe`
- Check firewall/network settings

---

## Quick Test Checklist

- [ ] Stripe test API keys configured
- [ ] Products created in Stripe Dashboard
- [ ] Price IDs updated in `config/index.ts`
- [ ] Environment variables set
- [ ] Development server running
- [ ] Can create checkout session
- [ ] Can complete test payment
- [ ] Purchase record created in database
- [ ] Customer ID saved to user
- [ ] Stripe CLI forwarding webhooks
- [ ] Webhook events processed successfully
- [ ] Customer portal accessible
- [ ] Subscription cancellation works
- [ ] Payment failures handled correctly

---

## Production Testing

Before going live:

1. **Switch to Live Mode:**
   - Get live API keys from Stripe Dashboard
   - Update environment variables
   - Use live price IDs

2. **Test with Real Card:**
   - Use a real card with small amount
   - Verify webhook endpoint is accessible publicly
   - Test full flow end-to-end

3. **Monitor:**
   - Check Stripe Dashboard for errors
   - Monitor application logs
   - Verify database records

---

## Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Dashboard](https://dashboard.stripe.com)

---

## Need Help?

- Check application logs for errors
- Review Stripe Dashboard webhook logs
- Verify environment variables are set correctly
- Ensure you're using test mode keys (not live keys)

