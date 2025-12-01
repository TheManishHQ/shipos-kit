// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeShiki from "rehype-shiki";
var posts = defineCollection({
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
    published: z.boolean()
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
var content_collections_default = defineConfig({
  collections: [posts]
});
export {
  content_collections_default as default
};
