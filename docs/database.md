# Database

The database layer uses [Prisma ORM](https://www.prisma.io/) with PostgreSQL for type-safe database access and schema management.

## Overview

The database package (`@shipos/database`) provides:

-   Prisma schema with all required models
-   Type-safe database client
-   Zod schema generation for validation
-   Query helpers for common operations
-   Migration management

## Architecture

```
packages/database/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── client.ts           # Prisma client instance
│   ├── index.ts            # Package exports
│   ├── queries/            # Query helpers
│   │   └── index.ts
│   └── zod-generator.config.json  # Zod generation config
└── index.ts
```

## Database Schema

### User Model

Core user authentication and profile data:

```prisma
model User {
  id                  String       @id @default(cuid())
  name                String
  email               String       @unique
  emailVerified       DateTime?
  image               String?
  username            String?      @unique
  role                String?
  banned              Boolean      @default(false)
  banReason           String?
  banExpires          DateTime?
  onboardingComplete  Boolean      @default(false)
  paymentsCustomerId  String?
  locale              String?
  twoFactorEnabled    Boolean      @default(false)
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  // Relations
  sessions            Session[]
  accounts            Account[]
  passkeys            Passkey[]
  twoFactor           TwoFactor?
  purchases           Purchase[]
  aiChats             AiChat[]

  @@index([email])
}
```

**Fields:**

-   `id` - Unique user identifier (CUID)
-   `name` - User's display name
-   `email` - Email address (unique, indexed)
-   `emailVerified` - Timestamp of email verification
-   `image` - Avatar URL
-   `username` - Optional unique username
-   `role` - User role (e.g., "admin")
-   `banned` - Ban status
-   `banReason` - Reason for ban
-   `banExpires` - Ban expiration date
-   `onboardingComplete` - Onboarding completion status
-   `paymentsCustomerId` - Payment provider customer ID
-   `locale` - Preferred language
-   `twoFactorEnabled` - 2FA status

### Session Model

User session management:

```prisma
model Session {
  id             String    @id @default(cuid())
  expiresAt      DateTime
  token          String    @unique
  userId         String
  ipAddress      String?
  userAgent      String?
  impersonatedBy String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}
```

**Fields:**

-   `token` - Session token (unique, indexed)
-   `expiresAt` - Session expiration timestamp
-   `ipAddress` - Client IP address
-   `userAgent` - Client user agent string
-   `impersonatedBy` - Admin user ID if impersonating

### Account Model

OAuth and authentication provider accounts:

```prisma
model Account {
  id                      String    @id @default(cuid())
  accountId               String
  providerId              String
  userId                  String
  accessToken             String?
  refreshToken            String?
  idToken                 String?
  password                String?
  expiresAt               DateTime?
  accessTokenExpiresAt    DateTime?
  refreshTokenExpiresAt   DateTime?
  scope                   String?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt

  user                    User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
}
```

**Fields:**

-   `accountId` - Provider-specific account ID
-   `providerId` - Provider name (e.g., "google", "github")
-   `accessToken` - OAuth access token
-   `refreshToken` - OAuth refresh token
-   `password` - Hashed password (for email/password auth)

### Verification Model

Email verification and password reset tokens:

```prisma
model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, value])
}
```

**Fields:**

-   `identifier` - Email or user ID
-   `value` - Verification token
-   `expiresAt` - Token expiration

### Passkey Model

WebAuthn passkey credentials:

```prisma
model Passkey {
  id           String   @id @default(cuid())
  name         String?
  publicKey    String
  credentialID String   @unique
  userId       String
  counter      Int
  deviceType   String
  backedUp     Boolean
  transports   String?
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Fields:**

-   `publicKey` - WebAuthn public key
-   `credentialID` - Unique credential identifier
-   `counter` - Signature counter for replay protection
-   `deviceType` - Device type (e.g., "platform", "cross-platform")
-   `backedUp` - Whether credential is backed up
-   `transports` - Supported transports (USB, NFC, BLE, internal)

### TwoFactor Model

Two-factor authentication data:

```prisma
model TwoFactor {
  id          String @id @default(cuid())
  secret      String
  backupCodes String
  userId      String @unique

  user        User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Fields:**

-   `secret` - TOTP secret key
-   `backupCodes` - JSON array of backup codes

### Purchase Model

Payment and subscription records:

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

**Fields:**

-   `type` - Purchase type (subscription or one-time)
-   `customerId` - Payment provider customer ID
-   `subscriptionId` - Subscription ID (indexed)
-   `productId` - Product/plan ID
-   `status` - Subscription status (active, canceled, etc.)

### AiChat Model

AI chat conversations:

```prisma
model AiChat {
  id        String   @id @default(cuid())
  userId    String?
  title     String?
  messages  Json     @default("[]")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Fields:**

-   `title` - Chat title
-   `messages` - JSON array of chat messages

**Message Format:**

```typescript
interface ChatMessage {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
	createdAt: string;
}
```

## Database Client

### Prisma Client

```typescript
// packages/database/prisma/client.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
```

### Usage

```typescript
import { prisma } from "@shipos/database";

// Find user by email
const user = await prisma.user.findUnique({
	where: { email: "user@example.com" },
});

// Create user
const newUser = await prisma.user.create({
	data: {
		name: "John Doe",
		email: "john@example.com",
	},
});

// Update user
await prisma.user.update({
	where: { id: userId },
	data: { name: "Jane Doe" },
});

// Delete user (cascade deletes related records)
await prisma.user.delete({
	where: { id: userId },
});
```

## Query Helpers

Common database queries abstracted for reuse:

```typescript
// packages/database/prisma/queries/index.ts
import { prisma } from "../client";

export const queries = {
	user: {
		findByEmail: (email: string) =>
			prisma.user.findUnique({ where: { email } }),

		findById: (id: string) => prisma.user.findUnique({ where: { id } }),

		updateLocale: (id: string, locale: string) =>
			prisma.user.update({ where: { id }, data: { locale } }),
	},

	purchase: {
		findActiveSubscription: (userId: string) =>
			prisma.purchase.findFirst({
				where: {
					userId,
					type: "SUBSCRIPTION",
					status: "active",
				},
			}),
	},

	aiChat: {
		findUserChats: (userId: string) =>
			prisma.aiChat.findMany({
				where: { userId },
				orderBy: { updatedAt: "desc" },
			}),
	},
};
```

## Zod Schema Generation

Prisma schemas are automatically converted to Zod schemas for validation.

### Configuration

```json
// packages/database/prisma/zod-generator.config.json
{
	"output": "./zod",
	"useDecimalJs": false,
	"imports": null,
	"prismaJsonNullability": true
}
```

### Generated Schemas

```typescript
import { z } from "zod";

// Auto-generated from Prisma schema
export const UserSchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	email: z.string().email(),
	emailVerified: z.date().nullable(),
	image: z.string().nullable(),
	username: z.string().nullable(),
	role: z.string().nullable(),
	banned: z.boolean(),
	banReason: z.string().nullable(),
	banExpires: z.date().nullable(),
	onboardingComplete: z.boolean(),
	paymentsCustomerId: z.string().nullable(),
	locale: z.string().nullable(),
	twoFactorEnabled: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Use for validation
const validatedUser = UserSchema.parse(userData);
```

## Migrations

### Create Migration

```bash
# Generate migration from schema changes
pnpm db:migrate:dev

# Name your migration
# Migration name: add_user_locale_field
```

### Apply Migrations

```bash
# Apply pending migrations
pnpm db:migrate:deploy
```

### Reset Database

```bash
# Reset database (WARNING: deletes all data)
pnpm db:reset
```

## Database Scripts

Add these scripts to `package.json`:

```json
{
	"scripts": {
		"db:generate": "prisma generate",
		"db:migrate:dev": "prisma migrate dev",
		"db:migrate:deploy": "prisma migrate deploy",
		"db:push": "prisma db push",
		"db:reset": "prisma migrate reset",
		"db:studio": "prisma studio"
	}
}
```

## Environment Variables

```bash
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/shipos?schema=public
```

### Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=[schema]
```

**Examples:**

```bash
# Local PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/shipos

# Railway
DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway

# Supabase
DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres

# Neon
DATABASE_URL=postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb
```

## Indexes

Indexes improve query performance on frequently searched fields:

```prisma
model User {
  // ...
  @@index([email])
}

model Session {
  // ...
  @@index([userId])
  @@index([token])
}

model Purchase {
  // ...
  @@index([subscriptionId])
}
```

## Cascade Deletes

When a user is deleted, related records are automatically deleted:

```prisma
model Session {
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Cascaded models:**

-   Sessions
-   Accounts
-   Passkeys
-   TwoFactor
-   Purchases
-   AiChats

## Type Safety

Prisma generates TypeScript types from your schema:

```typescript
import type { User, Session, Purchase } from "@prisma/client";

// Type-safe function
function getUserWithPurchases(userId: string): Promise<
	User & {
		purchases: Purchase[];
	}
> {
	return prisma.user.findUnique({
		where: { id: userId },
		include: { purchases: true },
	});
}
```

## Best Practices

### Use Transactions

For operations that must succeed or fail together:

```typescript
await prisma.$transaction(async (tx) => {
	// Create user
	const user = await tx.user.create({
		data: { name: "John", email: "john@example.com" },
	});

	// Create initial session
	await tx.session.create({
		data: {
			userId: user.id,
			token: generateToken(),
			expiresAt: new Date(Date.now() + 86400000),
		},
	});
});
```

### Select Only Needed Fields

Reduce data transfer by selecting specific fields:

```typescript
const users = await prisma.user.findMany({
	select: {
		id: true,
		name: true,
		email: true,
	},
});
```

### Use Pagination

For large datasets:

```typescript
const users = await prisma.user.findMany({
	take: 20,
	skip: page * 20,
	orderBy: { createdAt: "desc" },
});
```

### Handle Unique Constraint Errors

```typescript
try {
	await prisma.user.create({
		data: { name: "John", email: "john@example.com" },
	});
} catch (error) {
	if (error.code === "P2002") {
		throw new Error("Email already exists");
	}
	throw error;
}
```

## Troubleshooting

### Common Issues

**Issue: "Can't reach database server"**

-   Solution: Verify DATABASE_URL is correct and database is running

**Issue: "Prisma Client not generated"**

-   Solution: Run `pnpm db:generate`

**Issue: "Migration failed"**

-   Solution: Check migration SQL for errors, ensure database is accessible

**Issue: "Type errors after schema change"**

-   Solution: Regenerate Prisma Client with `pnpm db:generate`

## Prisma Studio

Visual database browser:

```bash
pnpm db:studio
```

Opens at `http://localhost:5555` with GUI for:

-   Viewing records
-   Editing data
-   Running queries
-   Managing relationships

## Next Steps

-   [Authentication](./authentication.md) - Learn about auth models
-   [Configuration](./configuration.md) - Configure database settings
-   [API](./api.md) - Build type-safe API with database queries
