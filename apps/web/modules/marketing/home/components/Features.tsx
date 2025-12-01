import {
	CheckIcon,
	LockIcon,
	MessageSquareIcon,
	PaletteIcon,
	ShieldCheckIcon,
	ZapIcon,
} from "lucide-react";

const features = [
	{
		icon: LockIcon,
		title: "Authentication",
		description:
			"Complete auth system with email/password, magic links, OAuth, and passkeys powered by better-auth",
	},
	{
		icon: MessageSquareIcon,
		title: "AI Chat",
		description:
			"Built-in AI chat interface with streaming responses using OpenAI GPT-4",
	},
	{
		icon: ShieldCheckIcon,
		title: "Admin Panel",
		description:
			"Full-featured admin dashboard with user management, role assignment, and ban functionality",
	},
	{
		icon: ZapIcon,
		title: "Payments",
		description:
			"Stripe integration with subscriptions, one-time payments, and customer portal",
	},
	{
		icon: PaletteIcon,
		title: "Theme System",
		description:
			"Dark mode support with customizable themes using Tailwind CSS 4",
	},
	{
		icon: CheckIcon,
		title: "Production Ready",
		description:
			"TypeScript, ESLint, Prettier, and comprehensive testing setup included",
	},
];

export function Features() {
	return (
		<section
			id="features"
			className="scroll-mt-16 border-t py-12 lg:py-16"
		>
			<div className="container max-w-5xl">
				{/* Header */}
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-4xl font-bold lg:text-5xl">
						Everything you need to ship fast
					</h2>
					<p className="text-lg text-foreground/50">
						All the features you need to build and launch your SaaS product
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<div
							key={index}
							className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
						>
							<div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
								<feature.icon className="size-6 text-primary" />
							</div>
							<h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
							<p className="text-foreground/60">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
