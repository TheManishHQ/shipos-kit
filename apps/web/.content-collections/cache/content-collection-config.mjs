// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import {
  createDocSchema,
  createMetaSchema,
  transformMDX
} from "@fumadocs/content-collections/configuration";
import rehypeShiki from "rehype-shiki";
import { remarkImage } from "fumadocs-core/mdx-plugins";
import { z } from "zod";
import { config } from "@shipos/config";
var posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: (z2) => ({
    title: z2.string(),
    date: z2.string(),
    image: z2.string().optional(),
    authorName: z2.string(),
    authorImage: z2.string().optional(),
    authorLink: z2.string().optional(),
    excerpt: z2.string().optional(),
    tags: z2.array(z2.string()),
    published: z2.boolean()
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      rehypePlugins: [
        [
          rehypeShiki,
          {
            theme: "nord"
          }
        ]
      ]
    });
    const localeMatch = document._meta.fileName.match(
      /\.([a-zA-Z-]{2,5})\.(md|mdx)$/
    );
    const locale = localeMatch ? localeMatch[1] : "en";
    let path = document._meta.path.replace(/\.([a-zA-Z-]{2,5})\.(md|mdx)$/, "").replace(/\/$/, "").replace(/\/index$/, "");
    return {
      ...document,
      body,
      path,
      locale
    };
  }
});
var docs = defineCollection({
  name: "docs",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: z.object(createDocSchema(z)),
  transform: async (document, context) => transformMDX(document, context, {
    remarkPlugins: [
      [
        remarkImage,
        {
          publicDir: "public"
        }
      ]
    ]
  })
});
var docsMeta = defineCollection({
  name: "docsMeta",
  directory: "content/docs",
  include: "**/meta*.json",
  parser: "json",
  schema: z.object(createMetaSchema(z))
});
var content_collections_default = defineConfig({
  collections: [posts, docs, docsMeta]
});
export {
  content_collections_default as default
};
