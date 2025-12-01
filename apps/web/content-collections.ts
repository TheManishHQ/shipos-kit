import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import {
	createDocSchema,
	createMetaSchema,
	transformMDX,
} from "@fumadocs/content-collections/configuration";
import rehypeShiki from "rehype-shiki";
import { remarkImage } from "fumadocs-core/mdx-plugins";
import { z } from "zod";
import { config } from "@shipos/config";

const posts = defineCollection({
	name: "posts",
	directory: "content/posts",
	include: "**/*.mdx",
	schema: (z) => ({
		title: z.string(),
		date: z.string(),
		image: z.string().optional(),
		authorName: z.string(),
		authorImage: z.string().optional(),
		authorLink: z.string().optional(),
		excerpt: z.string().optional(),
		tags: z.array(z.string()),
		published: z.boolean(),
	}),
	transform: async (document, context) => {
		const body = await compileMDX(context, document, {
			rehypePlugins: [
				[
					rehypeShiki,
					{
						theme: "nord",
					},
				],
			],
		});

		// Extract locale from filename (e.g., "post.de.mdx" -> "de")
		const localeMatch = document._meta.fileName.match(
			/\.([a-zA-Z-]{2,5})\.(md|mdx)$/,
		);
		const locale = localeMatch ? localeMatch[1] : "en";

		// Sanitize path
		let path = document._meta.path
			.replace(/\.([a-zA-Z-]{2,5})\.(md|mdx)$/, "")
			.replace(/\/$/, "")
			.replace(/\/index$/, "");

		return {
			...document,
			body,
			path,
			locale,
		};
	},
});

function sanitizePath(path: string) {
	return path
		.replace(/(\.[a-zA-Z-]{2,5})$/, "")
		.replace(/^\//, "")
		.replace(/\/$/, "")
		.replace(/index$/, "");
}

function getLocaleFromFilePath(path: string) {
	return (
		path
			.match(/(\.[a-zA-Z-]{2,5})+\.(md|mdx|json)$/)?.[1]
			?.replace(".", "") ?? config.i18n.defaultLocale
	);
}

const docs = defineCollection({
	name: "docs",
	directory: "content/docs",
	include: "**/*.mdx",
	schema: z.object(createDocSchema(z)),
	transform: async (document, context) =>
		transformMDX(document, context, {
			remarkPlugins: [
				[
					remarkImage,
					{
						publicDir: "public",
					},
				],
			],
		}),
});

const docsMeta = defineCollection({
	name: "docsMeta",
	directory: "content/docs",
	include: "**/meta*.json",
	parser: "json",
	schema: z.object(createMetaSchema(z)),
});

export default defineConfig({
	collections: [posts, docs, docsMeta],
});
