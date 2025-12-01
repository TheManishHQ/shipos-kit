import { MDXContent } from "@content-collections/mdx/react";
import { Footer } from "@marketing/shared/components/Footer";
import { NavBar } from "@marketing/shared/components/NavBar";
import { allLegalPages } from "./.content-collections/generated";
import { notFound } from "next/navigation";

type Params = {
	path?: string[];
};

function getActivePath(path?: string[]): string {
	if (!path || path.length === 0) {
		return "";
	}
	return path.join("/");
}

function getLegalPage(activePath: string) {
	const page = allLegalPages.find((p) => p.path === activePath);
	return page || null;
}

export async function generateMetadata(props: { params: Promise<Params> }) {
	const params = await props.params;
	const activePath = getActivePath(params.path);
	const page = getLegalPage(activePath);

	return {
		title: page?.title ? `${page.title} - Shipos Kit` : "Legal - Shipos Kit",
		description: page?.title,
	};
}

export default async function LegalPage(props: { params: Promise<Params> }) {
	const params = await props.params;
	const activePath = getActivePath(params.path);
	const page = getLegalPage(activePath);

	if (!page) {
		notFound();
	}

	const { title, body } = page;

	return (
		<div className="min-h-screen">
			<NavBar />
			<div className="container max-w-6xl pt-32 pb-24">
				<div className="mx-auto mb-12 max-w-2xl">
					<h1 className="text-center font-bold text-4xl">{title}</h1>
				</div>

				<div className="prose prose-lg dark:prose-invert mx-auto max-w-3xl">
					<MDXContent code={body} />
				</div>
			</div>
			<Footer />
		</div>
	);
}

export async function generateStaticParams() {
	return allLegalPages.map((page) => ({
		path: page.path.split("/"),
	}));
}
