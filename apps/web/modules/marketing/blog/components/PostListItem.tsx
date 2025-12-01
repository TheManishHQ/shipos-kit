"use client";

import Link from "next/link";
import type { Post } from "../utils/posts";

export function PostListItem({ post }: { post: Post }) {
	return (
		<Link
			href={`/blog/${post.path}`}
			className="block rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
		>
			<div className="mb-3 flex flex-wrap gap-2">
				{post.tags.map((tag) => (
					<span
						key={tag}
						className="text-xs text-primary"
					>
						#{tag}
					</span>
				))}
			</div>
			<h3 className="mb-2 text-xl font-bold">{post.title}</h3>
			{post.excerpt && (
				<p className="mb-4 text-foreground/60">{post.excerpt}</p>
			)}
			<div className="flex items-center gap-3 text-sm text-foreground/50">
				<span>{post.authorName}</span>
				<span>•</span>
				<time>{new Date(post.date).toLocaleDateString()}</time>
			</div>
		</Link>
	);
}
