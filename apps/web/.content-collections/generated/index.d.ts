import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type Post = GetTypeByName<typeof configuration, "posts">;
export declare const allPosts: Array<Post>;

export type LegalPage = GetTypeByName<typeof configuration, "legalPages">;
export declare const allLegalPages: Array<LegalPage>;

export type Doc = GetTypeByName<typeof configuration, "docs">;
export declare const allDocs: Array<Doc>;

export type DocsMeta = GetTypeByName<typeof configuration, "docsMeta">;
export declare const allDocsMetas: Array<DocsMeta>;

export {};
