# API System

The API system uses [ORPC](https://orpc.dev/) v1.8.6 to provide type-safe, end-to-end typed API routes with automatic OpenAPI schema generation.

## Implementation Status

⚠️ **Status: In Progress (~50%)**

**What's Working:**

-   ✅ ORPC infrastructure fully set up
-   ✅ Base procedures (public, protected, admin)
-   ✅ Authentication middleware with session validation
-   ✅ Admin role check middleware
-   ✅ Error handling with proper HTTP status codes
-   ✅ OpenAPI schema generation configured
-   ✅ **Payments API module** - Checkout, portal, purchases endpoints
-   ✅ **Users API module** - Avatar upload URL generation
-   ✅ **Contact API module** - Types defined (endpoint in progress)

**What's In Progress (Task 24):**

-   🚧 Contact form submission endpoint
-   🚧 Newsletter subscription endpoint
-   🚧 Additional user management endpoints

**What's Not Implemented:**

-   ❌ **Admin API module** - User/organization management (optional for simple apps)
-   ❌ **AI API module** - Chat CRUD operations (requires OpenAI integration - Task 25)
-   ❌ API client generation utilities
-   ❌ Comprehensive API documentation pages

**Note:** The admin and AI modules are optional. Most applications only need the payments and users modules that are already implemented.

## Overview

The API package (`@shipos/api`) provides:

-   Type-safe API routes with ORPC
-   Automatic OpenAPI schema generation
-   RPC and REST-style endpoints
-   Authentication middleware (public, protected, admin)
-   Automatic API documentation with Scalar
-   Client-side React Query integration
-   Error handling and logging

## Architecture

```
packages/api/
├── orpc/
│   ├── handler.ts          # RPC and OpenAPI handlers
│   ├── procedures.ts       # Base procedures with auth
│   └── router.ts           # Main API router
├── modules/
│   └── users/
│       ├── router.ts       # Users module router
│       └── procedures/
│           └── create-avatar-upload-url.ts
├── lib/
│   └── openapi-schema.ts   # OpenAPI schema merging
├── index.ts                # Hono app with middleware
└── package.json

apps/web/modules/shared/
├── lib/
│   ├── orpc-client.ts      # ORPC client configuration
│   ├── orpc-query-utils.ts # TanStack Query utilities
│   └── query-client.ts     # Query client setup
└── components/
    └── ApiClientProvider.tsx # React Query provider
```

## Base Procedures

### Public Procedure

Available to all users without authentication.

**Definition:**

```typescript
import { os } from "@orpc/server";

export const publicProcedure = os.$context<{
	headers: Headers;
}>();
```

**Usage:**

```typescript
import { publicProcedure } from "../../orpc/procedures";

export const getPublicData = publicProcedure
	.input(z.object({ id: z.string() }))
	.handler(async ({ input }) => {
		return { data: "public" };
	});
```

### Protected Procedure

Requires user authentication.

**Definition:**

```typescript
export const protectedProcedure = publicProcedure.use(
	async ({ context, next }) => {
		const session = await auth.api.getSession({
			headers: context.headers,
		});

		if (!session) {
			throw new ORPCError("UNAUTHORIZED");
		}

		return await next({
			context: {
				session: session.session,
				user: session.user,
			},
		});
	}
);
```

**Context:**

-   `context.user` - Authenticated user object
-   `context.session` - Session object
-   `context.headers` - Request headers

**Usage:**

```typescript
import { protectedProcedure } from "../../orpc/procedures";

export const getUserProfile = protectedProcedure.handler(
	async ({ context }) => {
		return {
			user: context.user,
		};
	}
);
```

### Admin Procedure

Requires admin role.

**Definition:**

```typescript
export const adminProcedure = protectedProcedure.use(
	async ({ context, next }) => {
		if (context.user.role !== "admin") {
			throw new ORPCError("FORBIDDEN");
		}

		return await next();
	}
);
```

**Usage:**

```typescript
import { adminProcedure } from "../../orpc/procedures";

export const deleteUser = adminProcedure
	.input(z.object({ userId: z.string() }))
	.handler(async ({ input }) => {
		// Admin-only logic
	});
```

## Creating API Endpoints

### Basic Endpoint

```typescript
// packages/api/modules/users/procedures/get-user.ts
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const getUser = protectedProcedure
	.input(
		z.object({
			userId: z.string(),
		})
	)
	.route({
		method: "GET",
		path: "/users/:userId",
		tags: ["Users"],
		summary: "Get user by ID",
		description: "Retrieve user information by user ID",
	})
	.handler(async ({ input, context }) => {
		const user = await prisma.user.findUnique({
			where: { id: input.userId },
		});

		if (!user) {
			throw new ORPCError("NOT_FOUND", "User not found");
		}

		return { user };
	});
```

### POST Endpoint with Validation

```typescript
// packages/api/modules/users/procedures/update-profile.ts
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const updateProfile = protectedProcedure
	.input(
		z.object({
			name: z.string().min(3),
			bio: z.string().max(500).optional(),
		})
	)
	.route({
		method: "POST",
		path: "/users/profile",
		tags: ["Users"],
		summary: "Update user profile",
	})
	.handler(async ({ input, context }) => {
		const user = await prisma.user.update({
			where: { id: context.user.id },
			data: {
				name: input.name,
				bio: input.bio,
			},
		});

		return { user };
	});
```

### Register in Router

```typescript
// packages/api/modules/users/router.ts
import { getUser } from "./procedures/get-user";
import { updateProfile } from "./procedures/update-profile";
import { createAvatarUploadUrl } from "./procedures/create-avatar-upload-url";

export const usersRouter = {
	get: getUser,
	updateProfile: updateProfile,
	avatarUploadUrl: createAvatarUploadUrl,
};
```

## Main Router

The main router combines all module routers:

```typescript
// packages/api/orpc/router.ts
import type { RouterClient } from "@orpc/server";
import { usersRouter } from "../modules/users/router";
import { publicProcedure } from "./procedures";

export const router = publicProcedure.prefix("/api").router({
	users: usersRouter,
});

export type ApiRouterClient = RouterClient<typeof router>;
```

## Server Configuration

### Hono App

The API is served through a Hono application:

```typescript
// packages/api/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";

export const app = new Hono()
	.basePath("/api")
	// Logger middleware
	.use(honoLogger((message) => logger.info(message)))
	// CORS middleware
	.use(
		cors({
			origin: getBaseUrl(),
			allowHeaders: ["Content-Type", "Authorization"],
			allowMethods: ["POST", "GET", "OPTIONS"],
			credentials: true,
		})
	)
	// Auth handler
	.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw))
	// OpenAPI schema
	.get("/openapi", async (c) => {
		// Schema generation
	})
	// API documentation
	.get("/docs", Scalar({ theme: "saturn", url: "/api/openapi" }))
	// Webhooks
	.post("/webhooks/stripe", (c) => paymentsWebhookHandler(c.req.raw))
	// Health check
	.get("/health", (c) => c.text("OK"))
	// ORPC handlers
	.use("*", async (c, next) => {
		// RPC and OpenAPI handling
	});
```

### Handlers

```typescript
// packages/api/orpc/handler.ts
import { RPCHandler } from "@orpc/server/fetch";
import { OpenAPIHandler } from "@orpc/openapi/fetch";

export const rpcHandler = new RPCHandler(router, {
	clientInterceptors: [
		onError((error) => {
			logger.error("RPC Error", error);
		}),
	],
});

export const openApiHandler = new OpenAPIHandler(router, {
	plugins: [new SmartCoercionPlugin()],
	clientInterceptors: [
		onError((error) => {
			logger.error("OpenAPI Error", error);
		}),
	],
});
```

## Client-Side Usage

### Setup

The client is configured with automatic header forwarding:

```typescript
// apps/web/modules/shared/lib/orpc-client.ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ApiRouterClient } from "@repo/api/orpc/router";

const link = new RPCLink({
	url: `${getBaseUrl()}/api/rpc`,
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return Object.fromEntries(await headers());
	},
});

export const orpcClient: ApiRouterClient = createORPCClient(link);
```

### React Query Integration

```typescript
// apps/web/modules/shared/lib/orpc-query-utils.ts
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { orpcClient } from "./orpc-client";

export const orpc = createTanstackQueryUtils(orpcClient);
```

### Provider Setup

```typescript
// apps/web/modules/shared/components/ApiClientProvider.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";

export function ApiClientProvider({ children }: PropsWithChildren) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
```

### Using in Components

#### Query Example

```typescript
"use client";

import { orpc } from "@shared/lib/orpc-query-utils";

function UserProfile({ userId }: { userId: string }) {
	const { data, isLoading, error } = orpc.users.get.useQuery({
		input: { userId },
	});

	if (isLoading) return <Spinner />;
	if (error) return <Error message={error.message} />;

	return <div>{data.user.name}</div>;
}
```

#### Mutation Example

```typescript
"use client";

import { orpc } from "@shared/lib/orpc-query-utils";
import { toast } from "sonner";

function UpdateProfileForm() {
	const updateProfile = orpc.users.updateProfile.useMutation({
		onSuccess: () => {
			toast.success("Profile updated");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleSubmit = (data: FormData) => {
		updateProfile.mutate({
			name: data.get("name") as string,
			bio: data.get("bio") as string,
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<input name="name" />
			<textarea name="bio" />
			<button type="submit" disabled={updateProfile.isPending}>
				Save
			</button>
		</form>
	);
}
```

#### Server-Side Usage

```typescript
// app/users/[id]/page.tsx
import { orpcClient } from "@shared/lib/orpc-client";

export default async function UserPage({ params }: { params: { id: string } }) {
	const { user } = await orpcClient.users.get({ userId: params.id });

	return <div>{user.name}</div>;
}
```

## OpenAPI Documentation

### Accessing Documentation

The API documentation is automatically generated and available at:

-   **Interactive Docs**: `http://localhost:3000/api/docs`
-   **OpenAPI Schema**: `http://localhost:3000/api/openapi`
-   **ORPC Schema**: `http://localhost:3000/api/orpc-openapi`

### Schema Merging

The OpenAPI schema merges both ORPC routes and better-auth routes:

```typescript
// packages/api/lib/openapi-schema.ts
export function mergeOpenApiSchemas({
	appSchema,
	authSchema,
}: {
	appSchema: MergeInput[number]["oas"];
	authSchema: MergeInput[number]["oas"];
}) {
	const mergedSchema = merge([
		{ oas: appSchema },
		{
			oas: authSchema,
			pathModification: {
				prepend: "/api/auth",
			},
		},
	]);

	// Tag auth routes
	Object.entries(output.paths).forEach(([path, pathItem]) => {
		if (path.startsWith("/api/auth")) {
			// Add "Auth" tag to all auth endpoints
		}
	});

	return output;
}
```

## Error Handling

### ORPC Errors

```typescript
import { ORPCError } from "@orpc/server";

// Throw typed errors
throw new ORPCError("UNAUTHORIZED");
throw new ORPCError("FORBIDDEN");
throw new ORPCError("NOT_FOUND", "User not found");
throw new ORPCError("BAD_REQUEST", "Invalid input");
throw new ORPCError("INTERNAL_SERVER_ERROR", "Something went wrong");
```

### Error Codes

-   `UNAUTHORIZED` - 401 - Not authenticated
-   `FORBIDDEN` - 403 - Not authorized
-   `NOT_FOUND` - 404 - Resource not found
-   `BAD_REQUEST` - 400 - Invalid input
-   `INTERNAL_SERVER_ERROR` - 500 - Server error

### Client-Side Error Handling

```typescript
const { data, error } = orpc.users.get.useQuery({
	input: { userId },
});

if (error) {
	if (error.code === "UNAUTHORIZED") {
		// Redirect to login
	} else if (error.code === "NOT_FOUND") {
		// Show 404 page
	} else {
		// Show generic error
	}
}
```

## Type Safety

### End-to-End Types

Types are automatically inferred from server to client:

```typescript
// Server
export const getUser = protectedProcedure
	.input(z.object({ userId: z.string() }))
	.handler(async ({ input }) => {
		return { user: { id: "1", name: "John" } };
	});

// Client - Fully typed!
const { data } = orpc.users.get.useQuery({
	input: { userId: "123" }, // Type-checked
});

// data.user.name is typed as string
```

### Router Client Type

Export the router client type for use in the frontend:

```typescript
// packages/api/orpc/router.ts
export type ApiRouterClient = RouterClient<typeof router>;

// apps/web/modules/shared/lib/orpc-client.ts
import type { ApiRouterClient } from "@repo/api/orpc/router";

export const orpcClient: ApiRouterClient = createORPCClient(link);
```

## Best Practices

### Input Validation

Always validate input with Zod:

```typescript
export const createPost = protectedProcedure
	.input(
		z.object({
			title: z.string().min(1).max(100),
			content: z.string().min(1),
			tags: z.array(z.string()).max(5),
		})
	)
	.handler(async ({ input }) => {
		// Input is validated and typed
	});
```

### Error Messages

Provide clear error messages:

```typescript
if (!post) {
	throw new ORPCError("NOT_FOUND", "Post not found");
}

if (post.authorId !== context.user.id) {
	throw new ORPCError("FORBIDDEN", "You can only edit your own posts");
}
```

### Logging

Log important operations:

```typescript
import { logger } from "@shipos/logs";

export const deletePost = protectedProcedure
	.input(z.object({ postId: z.string() }))
	.handler(async ({ input, context }) => {
		logger.info("Deleting post", {
			postId: input.postId,
			userId: context.user.id,
		});

		await prisma.post.delete({
			where: { id: input.postId },
		});

		return { success: true };
	});
```

### Organize by Module

Group related procedures into modules:

```
packages/api/modules/
├── users/
│   ├── router.ts
│   └── procedures/
│       ├── get-user.ts
│       ├── update-profile.ts
│       └── delete-account.ts
├── posts/
│   ├── router.ts
│   └── procedures/
│       ├── create-post.ts
│       ├── update-post.ts
│       └── delete-post.ts
└── comments/
    ├── router.ts
    └── procedures/
```

## Testing

### Unit Testing Procedures

```typescript
import { createAvatarUploadUrl } from "./create-avatar-upload-url";

describe("createAvatarUploadUrl", () => {
	it("should generate upload URL", async () => {
		const result = await createAvatarUploadUrl.handler({
			input: {
				path: "user-123.png",
				bucket: "avatars",
			},
			context: {
				user: { id: "123" },
				session: {},
				headers: new Headers(),
			},
		});

		expect(result.signedUploadUrl).toContain("user-123.png");
	});
});
```

### Integration Testing

```typescript
import { orpcClient } from "@shared/lib/orpc-client";

describe("Users API", () => {
	it("should get user profile", async () => {
		const { user } = await orpcClient.users.get({
			userId: "test-user-id",
		});

		expect(user.id).toBe("test-user-id");
	});
});
```

## Troubleshooting

### Common Issues

**Issue: "Type error: Cannot find module '@repo/api'"**

-   Solution: Ensure workspace packages are installed: `pnpm install`

**Issue: "UNAUTHORIZED error on protected routes"**

-   Solution: Verify session cookie is being sent with requests

**Issue: "CORS error in browser"**

-   Solution: Check CORS configuration in `packages/api/index.ts`

**Issue: "OpenAPI schema not generating"**

-   Solution: Ensure all procedures have `.route()` configuration

## Next Steps

-   [Authentication](./authentication.md) - Protect API routes
-   [Database](./database.md) - Query data in procedures
-   [User Management](./user-management.md) - Build user APIs
-   [Storage](./storage.md) - File upload APIs

## Resources

-   [ORPC Documentation](https://orpc.dev/)
-   [Hono Documentation](https://hono.dev/)
-   [TanStack Query](https://tanstack.com/query/latest)
-   [Zod Documentation](https://zod.dev/)
