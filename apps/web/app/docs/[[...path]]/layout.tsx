import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { PropsWithChildren } from "react";
import { docsSource } from "../../docs-source";

export default async function DocumentationLayout({
	children,
}: PropsWithChildren) {
	return (
		<div className="pt-[4.5rem]">
			<DocsLayout
				tree={docsSource.pageTree}
				disableThemeSwitch
				nav={{
					title: <strong>Shipos Kit Docs</strong>,
					url: "/docs",
				}}
				sidebar={{
					defaultOpenLevel: 1,
				}}
			>
				{children}
			</DocsLayout>
		</div>
	);
}
