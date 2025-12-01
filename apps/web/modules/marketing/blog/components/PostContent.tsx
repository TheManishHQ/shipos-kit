"use client";

import { MDXContent } from "@content-collections/mdx/react";
import type { Post } from "../utils/posts";

export function PostContent({ post }: { post: Post }) {
	return (
		<div className="prose prose-lg dark:prose-invert max-w-none">
			<MDXContent code={post.body} />
		</div>
	);
}
