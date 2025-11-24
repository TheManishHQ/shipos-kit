---
inclusion: always
---

# Performance Optimization

This document describes how to optimize code for performance in Shipos Kit.

## React Server Components

-   Minimize use of `'use client'` directive
-   Favor React Server Components (RSC) by default
-   Only use Client Components when necessary (interactivity, browser APIs, hooks)

```typescript
// Good - Server Component (default)
async function UserProfile({ userId }: { userId: string }) {
	const user = await db.user.findUnique({ where: { id: userId } });
	return <div>{user.name}</div>;
}

// Only when needed - Client Component
("use client");
function InteractiveButton() {
	const [count, setCount] = useState(0);
	return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## State Management

-   Minimize `useEffect` and `setState`
-   Prefer server-side data fetching
-   Use React Query for client-side data fetching when needed

```typescript
// Good - Server-side data fetching
async function PostList() {
	const posts = await db.post.findMany();
	return <PostGrid posts={posts} />;
}

// Avoid - Unnecessary client-side fetching
("use client");
function PostList() {
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		fetch("/api/posts")
			.then((r) => r.json())
			.then(setPosts);
	}, []);
	return <PostGrid posts={posts} />;
}
```

## Suspense Boundaries

-   Wrap client components in Suspense with fallback
-   Provide meaningful loading states
-   Stream content progressively

```typescript
import { Suspense } from "react";

function Page() {
	return (
		<div>
			<Suspense fallback={<Skeleton />}>
				<UserProfile userId="123" />
			</Suspense>
			<Suspense fallback={<Spinner />}>
				<PostList />
			</Suspense>
		</div>
	);
}
```

## Dynamic Loading

-   Use dynamic loading for non-critical components
-   Reduce initial bundle size
-   Load components on demand

```typescript
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), {
	loading: () => <Skeleton />,
	ssr: false, // Disable SSR if not needed
});

function Dashboard() {
	return (
		<div>
			<h1>Dashboard</h1>
			<HeavyChart data={data} />
		</div>
	);
}
```

## Image Optimization

-   Use Next.js Image component
-   Optimize images: use WebP format when possible
-   Include size data to prevent layout shift
-   Implement lazy loading for below-the-fold images

```typescript
import Image from "next/image";

function ProductCard({ product }: { product: Product }) {
	return (
		<div>
			<Image
				src={product.imageUrl}
				alt={product.name}
				width={400}
				height={300}
				loading="lazy"
				placeholder="blur"
				blurDataURL={product.blurDataUrl}
			/>
		</div>
	);
}
```

## Bundle Size

-   Avoid importing entire libraries
-   Use tree-shakeable imports
-   Monitor bundle size with Next.js analyzer

```typescript
// Good - Tree-shakeable import
import { format } from "date-fns/format";

// Avoid - Imports entire library
import { format } from "date-fns";
```

## Database Queries

-   Use Prisma's select to fetch only needed fields
-   Implement pagination for large datasets
-   Use database indexes for frequently queried fields
-   Leverage Prisma's query optimization

```typescript
// Good - Select only needed fields
const users = await db.user.findMany({
	select: {
		id: true,
		name: true,
		email: true,
	},
	take: 20,
	skip: page * 20,
});

// Avoid - Fetching all fields
const users = await db.user.findMany();
```
