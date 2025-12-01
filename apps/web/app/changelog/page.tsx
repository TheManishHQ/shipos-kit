import { ChangelogSection } from "@marketing/changelog/components/ChangelogSection";
import { Footer } from "@marketing/shared/components/Footer";
import { NavBar } from "@marketing/shared/components/NavBar";

export const metadata = {
	title: "Changelog - Shipos Kit",
	description: "See what's new in Shipos Kit. Latest updates, features, and improvements.",
};

export default async function ChangelogPage() {
	return (
		<div className="min-h-screen">
			<NavBar />
			<div className="container max-w-3xl pt-32 pb-16">
				<div className="mb-12 text-balance pt-8 text-center">
					<h1 className="mb-2 font-bold text-5xl">
						Changelog
					</h1>
					<p className="text-lg opacity-50">
						See what's new in Shipos Kit
					</p>
				</div>
				<ChangelogSection
					items={[
						{
							date: "2025-12-01",
							changes: [
								"🚀 Added documentation site with Fumadocs",
								"📝 Created blog system with MDX support",
								"🎨 Built complete marketing homepage",
								"👨‍💼 Implemented admin panel with user management",
								"🤖 Added AI chat interface with streaming",
							],
						},
						{
							date: "2025-11-15",
							changes: [
								"🔐 Integrated better-auth for authentication",
								"💳 Added Stripe payments and subscriptions",
								"🎨 Built UI component library with Radix UI",
								"🌐 Implemented i18n with next-intl",
							],
						},
						{
							date: "2025-11-01",
							changes: [
								"🎉 Initial release of Shipos Kit",
								"⚡ Next.js 15 with App Router",
								"🗄️ PostgreSQL with Prisma ORM",
								"🔗 Type-safe API layer with ORPC",
							],
						},
					]}
				/>
			</div>
			<Footer />
		</div>
	);
}
