// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import {
  createDocSchema,
  createMetaSchema,
  transformMDX
} from "@fumadocs/content-collections/configuration";
import rehypeShiki from "@shikijs/rehype";
import { remarkImage } from "fumadocs-core/mdx-plugins";
import { z } from "zod";
import { config } from "@shipos/config";
var posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.{mdx,md}",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    image: z.string().optional(),
    authorName: z.string(),
    authorImage: z.string().optional(),
    authorLink: z.string().optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()),
    published: z.boolean()
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      rehypePlugins: [
        [
          rehypeShiki,
          {
            theme: "nord",
            langs: ["env", "bash", "typescript", "javascript", "json", "tsx", "jsx", "css", "html", "markdown", "yaml", "yml"]
          }
        ]
      ]
    });
    return {
      ...document,
      body,
      locale: getLocaleFromFilePath(document._meta.filePath),
      path: sanitizePath(document._meta.path)
    };
  }
});
var legalPages = defineCollection({
  name: "legalPages",
  directory: "content/legal",
  include: "**/*.{mdx,md}",
  schema: z.object({
    title: z.string()
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document);
    return {
      ...document,
      body,
      locale: getLocaleFromFilePath(document._meta.filePath),
      path: sanitizePath(document._meta.path)
    };
  }
});
function sanitizePath(path) {
  return path.replace(/(\.[a-zA-Z-]{2,5})$/, "").replace(/^\//, "").replace(/\/$/, "").replace(/index$/, "");
}
function getLocaleFromFilePath(path) {
  return path.match(/(\.[a-zA-Z-]{2,5})+\.(md|mdx|json)$/)?.[1]?.replace(".", "") ?? config.i18n.defaultLocale;
}
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
  collections: [posts, legalPages, docs, docsMeta]
});
export {
  content_collections_default as default
};
