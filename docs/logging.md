# Logging

The logging package (`@shipos/logs`) provides structured logging for the application with JSON output format.

## Overview

The logging package provides:

-   Structured JSON logging
-   Multiple log levels (info, warn, error, debug)
-   Timestamp inclusion
-   Error stack trace capture
-   Metadata support
-   Development-only debug logging

## Architecture

```
packages/logs/
├── index.ts         # Logger implementation
├── package.json
└── tsconfig.json
```

## Logger API

### `logger.info()`

Log informational messages.

**Signature:**

```typescript
logger.info(message: string, meta?: LogMetadata): void
```

**Usage:**

```typescript
import { logger } from "@shipos/logs";

logger.info("User logged in", { userId: "123", email: "user@example.com" });
```

**Output:**

```json
{
	"level": "info",
	"message": "User logged in",
	"timestamp": "2025-11-24T10:30:00.000Z",
	"userId": "123",
	"email": "user@example.com"
}
```

### `logger.warn()`

Log warning messages.

**Signature:**

```typescript
logger.warn(message: string, meta?: LogMetadata): void
```

**Usage:**

```typescript
import { logger } from "@shipos/logs";

logger.warn("Rate limit approaching", {
	userId: "123",
	requestCount: 95,
	limit: 100,
});
```

**Output:**

```json
{
	"level": "warn",
	"message": "Rate limit approaching",
	"timestamp": "2025-11-24T10:30:00.000Z",
	"userId": "123",
	"requestCount": 95,
	"limit": 100
}
```

### `logger.error()`

Log error messages with optional Error object.

**Signature:**

```typescript
logger.error(message: string, error?: Error | unknown, meta?: LogMetadata): void
```

**Usage:**

```typescript
import { logger } from "@shipos/logs";

try {
	await riskyOperation();
} catch (error) {
	logger.error("Operation failed", error, {
		operation: "riskyOperation",
		userId: "123",
	});
}
```

**Output:**

```json
{
	"level": "error",
	"message": "Operation failed",
	"timestamp": "2025-11-24T10:30:00.000Z",
	"error": {
		"message": "Connection timeout",
		"stack": "Error: Connection timeout\n    at ...",
		"name": "Error"
	},
	"operation": "riskyOperation",
	"userId": "123"
}
```

### `logger.debug()`

Log debug messages (development only).

**Signature:**

```typescript
logger.debug(message: string, meta?: LogMetadata): void
```

**Usage:**

```typescript
import { logger } from "@shipos/logs";

logger.debug("Cache hit", { key: "user:123", ttl: 3600 });
```

**Output (development only):**

```json
{
	"level": "debug",
	"message": "Cache hit",
	"timestamp": "2025-11-24T10:30:00.000Z",
	"key": "user:123",
	"ttl": 3600
}
```

**Note:** Debug logs are only output when `NODE_ENV === 'development'`.

## Type Definitions

### LogMetadata

Metadata object for additional context:

```typescript
interface LogMetadata {
	[key: string]: unknown;
}
```

**Examples:**

```typescript
// User context
{ userId: '123', email: 'user@example.com' }

// Request context
{ method: 'POST', path: '/api/users', statusCode: 201 }

// Performance metrics
{ duration: 1234, cacheHit: true }

// Business context
{ orderId: 'ord_123', amount: 9900, currency: 'USD' }
```

### LogEntry

Internal log entry structure:

```typescript
interface LogEntry {
	level: string;
	message: string;
	timestamp: string;
	[key: string]: unknown;
}
```

## Usage Examples

### Authentication Logging

```typescript
import { logger } from "@shipos/logs";

// Successful login
logger.info("User authenticated", {
	userId: user.id,
	email: user.email,
	method: "email",
	ipAddress: request.ip,
});

// Failed login attempt
logger.warn("Authentication failed", {
	email: email,
	reason: "invalid_password",
	ipAddress: request.ip,
});

// Account locked
logger.error("Account locked due to failed attempts", null, {
	userId: user.id,
	failedAttempts: 5,
});
```

### API Request Logging

```typescript
import { logger } from "@shipos/logs";

export async function handleRequest(request: Request) {
	const startTime = Date.now();

	try {
		const response = await processRequest(request);
		const duration = Date.now() - startTime;

		logger.info("API request completed", {
			method: request.method,
			path: request.url,
			statusCode: response.status,
			duration,
		});

		return response;
	} catch (error) {
		const duration = Date.now() - startTime;

		logger.error("API request failed", error, {
			method: request.method,
			path: request.url,
			duration,
		});

		throw error;
	}
}
```

### Database Operation Logging

```typescript
import { logger } from "@shipos/logs";
import { prisma } from "@shipos/database";

export async function createUser(data: CreateUserInput) {
	logger.debug("Creating user", { email: data.email });

	try {
		const user = await prisma.user.create({ data });

		logger.info("User created", {
			userId: user.id,
			email: user.email,
		});

		return user;
	} catch (error) {
		logger.error("Failed to create user", error, {
			email: data.email,
		});
		throw error;
	}
}
```

### Payment Processing Logging

```typescript
import { logger } from "@shipos/logs";

export async function processPayment(paymentData: PaymentData) {
	logger.info("Processing payment", {
		userId: paymentData.userId,
		amount: paymentData.amount,
		currency: paymentData.currency,
	});

	try {
		const result = await paymentProvider.charge(paymentData);

		logger.info("Payment successful", {
			userId: paymentData.userId,
			transactionId: result.id,
			amount: paymentData.amount,
		});

		return result;
	} catch (error) {
		logger.error("Payment failed", error, {
			userId: paymentData.userId,
			amount: paymentData.amount,
			errorCode: error.code,
		});
		throw error;
	}
}
```

### Webhook Logging

```typescript
import { logger } from "@shipos/logs";

export async function handleWebhook(request: Request) {
	const signature = request.headers.get("stripe-signature");

	logger.debug("Webhook received", {
		provider: "stripe",
		signature: signature?.substring(0, 20),
	});

	try {
		const event = await verifyWebhook(request, signature);

		logger.info("Webhook verified", {
			provider: "stripe",
			eventType: event.type,
			eventId: event.id,
		});

		await processWebhookEvent(event);

		logger.info("Webhook processed", {
			provider: "stripe",
			eventType: event.type,
			eventId: event.id,
		});
	} catch (error) {
		logger.error("Webhook processing failed", error, {
			provider: "stripe",
			signature: signature?.substring(0, 20),
		});
		throw error;
	}
}
```

## Best Practices

### Use Appropriate Log Levels

-   **info**: Normal operations, successful actions
-   **warn**: Potential issues, degraded performance
-   **error**: Failures, exceptions, critical issues
-   **debug**: Detailed debugging information (development only)

```typescript
// Good
logger.info("User created successfully");
logger.warn("Cache miss, fetching from database");
logger.error("Database connection failed", error);
logger.debug("Query executed", { sql, params });

// Avoid
logger.info("Error occurred"); // Use error level
logger.error("User logged in"); // Use info level
```

### Include Relevant Context

Always include metadata that helps with debugging:

```typescript
// Good - Includes context
logger.error("Payment failed", error, {
	userId: user.id,
	amount: payment.amount,
	paymentMethod: payment.method,
});

// Avoid - Missing context
logger.error("Payment failed", error);
```

### Avoid Logging Sensitive Data

Never log passwords, tokens, or PII:

```typescript
// Good - Redacted sensitive data
logger.info("User authenticated", {
	userId: user.id,
	email: user.email.replace(/(?<=.{2}).*(?=@)/, "***"),
});

// Avoid - Logs sensitive data
logger.info("User authenticated", {
	userId: user.id,
	password: user.password, // NEVER DO THIS
	token: session.token, // NEVER DO THIS
});
```

### Use Structured Metadata

Use objects for metadata, not string concatenation:

```typescript
// Good - Structured metadata
logger.info("Order created", {
	orderId: order.id,
	userId: user.id,
	amount: order.total,
});

// Avoid - String concatenation
logger.info(`Order ${order.id} created by user ${user.id} for ${order.total}`);
```

### Log Performance Metrics

Track operation duration for performance monitoring:

```typescript
const startTime = Date.now();

try {
	const result = await expensiveOperation();
	const duration = Date.now() - startTime;

	logger.info("Operation completed", {
		operation: "expensiveOperation",
		duration,
		success: true,
	});
} catch (error) {
	const duration = Date.now() - startTime;

	logger.error("Operation failed", error, {
		operation: "expensiveOperation",
		duration,
	});
}
```

## Log Aggregation

The JSON format makes logs easy to parse and aggregate with tools like:

-   **Datadog**: Structured log ingestion
-   **Logtail**: Real-time log streaming
-   **CloudWatch**: AWS log aggregation
-   **Elasticsearch**: Log search and analysis

**Example Datadog query:**

```
@level:error @userId:123
```

**Example CloudWatch Insights query:**

```
fields @timestamp, message, userId, error.message
| filter level = "error"
| sort @timestamp desc
```

## Environment Configuration

### Development

In development, all log levels are output to console:

```bash
NODE_ENV=development
```

### Production

In production, consider:

-   Filtering debug logs (already handled)
-   Sending logs to aggregation service
-   Setting up alerts for error logs

## Troubleshooting

### Common Issues

**Issue: "Debug logs not appearing"**

-   Solution: Debug logs only appear in development (`NODE_ENV=development`)

**Issue: "Logs not formatted as JSON"**

-   Solution: Ensure you're using the logger, not console.log directly

**Issue: "Too many logs in production"**

-   Solution: Use appropriate log levels and avoid excessive info logging

## Next Steps

-   [API](./api.md) - Add logging to API endpoints
-   [Authentication](./authentication.md) - Log authentication events
-   [Payments](./payments.md) - Log payment processing
