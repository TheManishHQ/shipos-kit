import { PostContent } from "@marketing/blog/components/PostContent";
import { getPostBySlug } from "@marketing/blog/utils/posts";
import { Footer } from "@marketing/shared/components/Footer";
import { NavBar } from "@marketing/shared/components/NavBar";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ path: string[] }>;
}) {
	const { path } = await params;
	const slug = path.join("/");
	const post = await getPostBySlug(slug);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	return {
		title: `${post.title} - Blog`,
		description: post.excerpt || post.title,
	};
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ path: string[] }>;
}) {
	const { path } = await params;
	const slug = path.join("/");
	const post = await getPostBySlug(slug);

	if (!post || !post.published) {
		notFound();
	}

	return (
		<div className="min-h-screen">
			<NavBar />
			<main className="container max-w-3xl pt-32 pb-16">
				<article>
					<div className="mb-8">
						<div className="mb-4 flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
								>
									#{tag}
								</span>
							))}
						</div>
						<h1 className="mb-4 text-4xl font-bold lg:text-5xl">
							{post.title}
						</h1>
						<div className="flex items-center gap-4 text-foreground/60">
							<span>{post.authorName}</span>
							<span>•</span>
							<time>{new Date(post.date).toLocaleDateString()}</time>
						</div>
					</div>

					<PostContent post={post} />
				</article>
			</main>
			<Footer />
		</div>
	);
}
