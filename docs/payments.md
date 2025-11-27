# Payment System (Stripe)

The payment system provides Stripe integration for subscriptions and one-time payments.

## Overview

The payments package (`@shipos/payments`) provides:

-   Stripe checkout session creation
-   Customer portal links
-   Subscription management
-   Webhook handling for payment events
-   Purchase tracking in database

## Architecture

```
packages/payments/
├── provider/
│   └── stripe/
│       └── index.ts        # Stripe implementation
├── types.ts                # TypeScript interfaces
├── index.ts                # Package exports
├── package.json
└── tsconfig.json
```

## Configuration

### Environment Variables

```bash
# Stripe Configuration (Required)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Payment Plans

Payment plans are configured in `config/index.ts`:

```typescript
payments: {
  plans: {
    free: {
      isFree: true,
      prices: [],
    },
    pro: {
      recommended: true,
      prices: [
        {
          productId: 'price_pro_monthly',
          amount: 2900,  // $29.00
          currency: 'USD',
          type: 'recurring',
          interval: 'month',
          trialPeriodDays: 14,
        },
        {
          productId: 'price_pro_yearly',
          amount: 29000,  // $290.00
          currency: 'USD',
          type: 'recurring',
          interval: 'year',
        },
      ],
    },
    lifetime: {
      prices: [
        {
          productId: 'price_lifetime',
          amount: 99900,  // $999.00
          currency: 'USD',
          type: 'one-time',
        },
      ],
    },
    enterprise: {
      isEnterprise: true,
      prices: [],
    },
  },
}
```

## Stripe Setup

### 1. Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Add keys to `.env`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Create Products and Prices

In Stripe Dashboard:

1. Go to **Products** → **Add Product**
2. Create products for each plan (Pro, Lifetime, etc.)
3. Add prices for each product
4. Copy the price IDs (e.g., `price_1234...`)
5. Update `config/index.ts` with the price IDs

### 3. Configure Webhook

1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
4. Copy the webhook signing secret
5. Add to `.env` as `STRIPE_WEBHOOK_SECRET`

## Usage

### Create Checkout Session

```typescript
import { createCheckoutLink } from "@shipos/payments";

const checkoutUrl = await createCheckoutLink({
	type: "subscription",
	productId: "price_pro_monthly",
	email: user.email,
	userId: user.id,
	redirectUrl: "https://yourdomain.com/app/billing/success",
	trialPeriodDays: 14,
});

// Redirect user to checkout
window.location.href = checkoutUrl;
```

**Parameters:**

-   `type` - `'subscription'` or `'one-time'`
-   `productId` - Stripe price ID
-   `email` - Customer email (if no customerId)
-   `userId` - User ID to associate purchase
-   `redirectUrl` - URL to redirect after successful payment
-   `customerId` - Existing Stripe customer ID (optional)
-   `trialPeriodDays` - Trial period length (optional)
-   `seats` - Number of seats for team plans (optional)

### Create Customer Portal Link

```typescript
import { createCustomerPortalLink } from "@shipos/payments";

const portalUrl = await createCustomerPortalLink({
	customerId: user.paymentsCustomerId,
	redirectUrl: "https://yourdomain.com/app/billing",
});

// Redirect user to portal
window.location.href = portalUrl;
```

**Features:**

-   Update payment method
-   View invoices
-   Cancel subscription
-   Update billing information

### Cancel Subscription

```typescript
import { cancelSubscription } from "@shipos/payments";

await cancelSubscription(subscriptionId);
```

### Update Subscription Seats

```typescript
import { setSubscriptionSeats } from "@shipos/payments";

await setSubscriptionSeats({
	id: subscriptionId,
	seats: 5,
});
```

## Webhook Handling

The webhook endpoint automatically handles Stripe events:

**Endpoint:** `POST /api/webhooks/stripe`

**Handled Events:**

1. **checkout.session.completed** (one-time payments)

    - Creates purchase record
    - Associates customer ID with user

2. **customer.subscription.created**

    - Creates subscription purchase record
    - Associates customer ID with user

3. **customer.subscription.updated**

    - Updates subscription status
    - Updates product ID if changed

4. **customer.subscription.deleted**
    - Deletes purchase record

**Implementation:**

```typescript
// apps/web/app/api/webhooks/stripe/route.ts
import { webhookHandler } from "@shipos/payments";

export async function POST(req: Request) {
	return webhookHandler(req);
}
```

## Database Integration

### Purchase Model

Purchases are tracked in the database:

```prisma
model Purchase {
  id              String       @id @default(cuid())
  userId          String?
  type            PurchaseType
  customerId      String
  subscriptionId  String?      @unique
  productId       String
  status          String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  user            User?        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([subscriptionId])
}

enum PurchaseType {
  SUBSCRIPTION
  ONE_TIME
}
```

### Query Functions

```typescript
import {
	getPurchaseById,
	getPurchasesByUserId,
	getPurchaseBySubscriptionId,
	createPurchase,
	updatePurchase,
	deletePurchaseBySubscriptionId,
} from "@shipos/database";

// Get user's purchases
const purchases = await getPurchasesByUserId(userId);

// Get active subscription
const subscription = await getPurchaseBySubscriptionId(subscriptionId);

// Create purchase
await createPurchase({
	userId: user.id,
	customerId: "cus_123",
	type: "SUBSCRIPTION",
	productId: "price_123",
	subscriptionId: "sub_123",
	status: "active",
});

// Update purchase
await updatePurchase({
	id: purchase.id,
	status: "canceled",
});

// Delete purchase
await deletePurchaseBySubscriptionId(subscriptionId);
```

## Type Definitions

### PaymentProvider

```typescript
interface PaymentProvider {
	createCheckoutLink: CreateCheckoutLink;
	createCustomerPortalLink: CreateCustomerPortalLink;
	webhookHandler: WebhookHandler;
	setSubscriptionSeats?: SetSubscriptionSeats;
	cancelSubscription?: CancelSubscription;
}
```

### CreateCheckoutLink

```typescript
type CreateCheckoutLink = (params: {
	type: "subscription" | "one-time";
	productId: string;
	email?: string;
	name?: string;
	redirectUrl?: string;
	customerId?: string;
	userId?: string;
	trialPeriodDays?: number;
	seats?: number;
}) => Promise<string | null>;
```

### CreateCustomerPortalLink

```typescript
type CreateCustomerPortalLink = (params: {
	subscriptionId?: string;
	customerId: string;
	redirectUrl?: string;
}) => Promise<string | null>;
```

## Example Flows

### Subscription Checkout Flow

```typescript
// 1. User clicks "Subscribe to Pro"
async function handleSubscribe() {
	const checkoutUrl = await createCheckoutLink({
		type: "subscription",
		productId: config.payments.plans.pro.prices[0].productId,
		email: user.email,
		userId: user.id,
		redirectUrl: `${window.location.origin}/app/billing/success`,
		trialPeriodDays: 14,
	});

	window.location.href = checkoutUrl;
}

// 2. User completes payment on Stripe
// 3. Stripe sends webhook to /api/webhooks/stripe
// 4. Webhook creates purchase record
// 5. User is redirected to success page
```

### Customer Portal Flow

```typescript
// 1. User clicks "Manage Billing"
async function handleManageBilling() {
	if (!user.paymentsCustomerId) {
		toast.error("No billing information found");
		return;
	}

	const portalUrl = await createCustomerPortalLink({
		customerId: user.paymentsCustomerId,
		redirectUrl: `${window.location.origin}/app/billing`,
	});

	window.location.href = portalUrl;
}

// 2. User manages subscription in Stripe portal
// 3. Changes are synced via webhooks
```

### Cancel Subscription Flow

```typescript
// 1. User clicks "Cancel Subscription"
async function handleCancelSubscription() {
	const purchase = await getPurchaseBySubscriptionId(subscriptionId);

	if (!purchase) {
		toast.error("Subscription not found");
		return;
	}

	await cancelSubscription(purchase.subscriptionId);

	toast.success("Subscription canceled");
}

// 2. Stripe sends webhook
// 3. Purchase record is deleted
```

## Testing

### Test Mode

Use Stripe test mode for development:

```bash
# Test API keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Test Cards

Stripe provides test card numbers:

-   **Success:** `4242 4242 4242 4242`
-   **Decline:** `4000 0000 0000 0002`
-   **3D Secure:** `4000 0025 0000 3155`

Use any future expiry date and any CVC.

### Testing Webhooks Locally

Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Get webhook secret
stripe listen --print-secret
```

## Security

### Webhook Verification

Webhooks are verified using the signing secret:

```typescript
const event = await stripeClient.webhooks.constructEventAsync(
	await req.text(),
	req.headers.get("stripe-signature") as string,
	process.env.STRIPE_WEBHOOK_SECRET as string
);
```

### Customer ID Association

Customer IDs are securely associated with users:

```typescript
await updateUser({
	id: userId,
	paymentsCustomerId: customerId,
});
```

### Metadata

User IDs are stored in Stripe metadata for tracking:

```typescript
metadata: {
  user_id: userId,
}
```

## Error Handling

### Checkout Errors

```typescript
try {
	const checkoutUrl = await createCheckoutLink({
		/* ... */
	});
	window.location.href = checkoutUrl;
} catch (error) {
	console.error("Checkout error:", error);
	toast.error("Failed to create checkout session");
}
```

### Webhook Errors

```typescript
try {
	// Process webhook
	return new Response(null, { status: 204 });
} catch (error) {
	logger.error("Stripe webhook processing error", error);
	return new Response("Webhook error", { status: 400 });
}
```

## Best Practices

### Use Customer Portal

Always use Stripe's customer portal for subscription management:

```typescript
// Good - Use customer portal
const portalUrl = await createCustomerPortalLink({
	customerId: user.paymentsCustomerId,
	redirectUrl: returnUrl,
});

// Avoid - Building custom billing UI
// Don't recreate Stripe's functionality
```

### Handle Webhook Idempotency

Stripe may send duplicate webhooks. Handle them idempotently:

```typescript
// Check if purchase already exists
const existing = await getPurchaseBySubscriptionId(subscriptionId);
if (existing) {
	// Update instead of create
	await updatePurchase({ id: existing.id, status });
}
```

### Store Minimal Data

Store only necessary data in your database:

-   Customer ID
-   Subscription ID
-   Product ID
-   Status

Don't store:

-   Payment methods
-   Card details
-   Full customer data

### Use Metadata

Store your IDs in Stripe metadata for easy tracking:

```typescript
metadata: {
  user_id: userId,
}
```

## Troubleshooting

### Common Issues

**Issue: "Missing env variable STRIPE_SECRET_KEY"**

-   Solution: Add `STRIPE_SECRET_KEY` to `.env`

**Issue: "Webhook signature verification failed"**

-   Solution: Verify `STRIPE_WEBHOOK_SECRET` is correct
-   Check webhook endpoint URL matches Stripe dashboard

**Issue: "Customer not found"**

-   Solution: Ensure customer ID is stored in user record
-   Check `paymentsCustomerId` field

**Issue: "Product ID not found"**

-   Solution: Verify price IDs in `config/index.ts` match Stripe dashboard

## Next Steps

-   [Configuration](./configuration.md) - Configure payment plans
-   [Database](./database.md) - Purchase model details
-   [API](./api.md) - Build payment API endpoints

## Resources

-   [Stripe Documentation](https://stripe.com/docs)
-   [Stripe API Reference](https://stripe.com/docs/api)
-   [Stripe Webhooks](https://stripe.com/docs/webhooks)
-   [Stripe Testing](https://stripe.com/docs/testing)

## Last Updated

November 27, 2024
