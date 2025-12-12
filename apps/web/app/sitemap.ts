import { getAllPosts } from "@marketing/blog/utils/posts";
import { config } from "@shipos/config";
import { getBaseUrl } from "@shipos/utils";
import { allLegalPages } from ".content-collections/generated";
import type { MetadataRoute } from "next";
import { docsSource } from "./docs-source";

const baseUrl = getBaseUrl();
const locales = [config.i18n.defaultLocale];

const staticMarketingPages = ["", "/changelog", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllPosts();

	return [
		...staticMarketingPages.flatMap((page) =>
			locales.map((locale) => ({
				url: new URL(`/${locale}${page}`, baseUrl).href,
				lastModified: new Date(),
			})),
		),
		...posts.map((post) => ({
			url: new URL(`/blog/${post.path}`, baseUrl).href,
			lastModified: new Date(),
		})),
		...allLegalPages.map((page) => ({
			url: new URL(`/legal/${page.path}`, baseUrl).href,
			lastModified: new Date(),
		})),
		...docsSource.getPages().map((page) => ({
			url: new URL(`/docs/${page.slugs.join("/")}`, baseUrl).href,
			lastModified: new Date(),
		})),
	];
}
