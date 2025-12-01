import { PostListItem } from "@marketing/blog/components/PostListItem";
import { getAllPosts } from "@marketing/blog/utils/posts";
import { Footer } from "@marketing/shared/components/Footer";
import { NavBar } from "@marketing/shared/components/NavBar";

export const metadata = {
	title: "Blog - Shipos Kit",
	description:
		"Read our latest articles about building SaaS applications with Next.js, React, and modern web technologies.",
};

export default async function BlogPage() {
	const allPosts = await getAllPosts();
	const posts = allPosts
		.filter((post) => post.published)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return (
		<div className="min-h-screen">
			<NavBar />
			<main className="container max-w-5xl pt-32 pb-16">
				<div className="mb-12">
					<h1 className="mb-4 text-4xl font-bold lg:text-5xl">Blog</h1>
					<p className="text-lg text-foreground/60">
						Insights and tutorials about building SaaS applications
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					{posts.map((post) => (
						<PostListItem key={post.path} post={post} />
					))}
				</div>

				{posts.length === 0 && (
					<p className="text-center text-foreground/60">
						No posts published yet. Check back soon!
					</p>
				)}
			</main>
			<Footer />
		</div>
	);
}
