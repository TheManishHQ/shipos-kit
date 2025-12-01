import { allPosts } from ".content-collections/generated";

export type Post = (typeof allPosts)[0];

export async function getAllPosts(): Promise<Post[]> {
	return allPosts;
}

export async function getPostBySlug(
	slug: string,
	options?: { locale?: string },
): Promise<Post | null> {
	const post = allPosts.find((p) => {
		const matchesSlug = p.path === slug;
		const matchesLocale = options?.locale ? p.locale === options.locale : true;
		return matchesSlug && matchesLocale;
	});

	return post || null;
}
