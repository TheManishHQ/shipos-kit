import { Button } from "@ui/components/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function Hero() {
	return (
		<section className="relative overflow-x-hidden pt-44 pb-12 lg:pb-16">
			{/* Gradient Background */}
			<div
				className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2"
				style={{
					background:
						"linear-gradient(to bottom, hsl(var(--card)), hsl(var(--background)))",
					width: "100%",
					height: "500px",
				}}
			>
				<div
					className="absolute left-1/2 top-0 -translate-x-1/2 blur-[150px]"
					style={{
						background: "hsl(var(--primary) / 0.3)",
						width: "500px",
						height: "1000px",
						borderRadius: "50%",
					}}
				/>
			</div>

			<div className="container max-w-5xl">
				<div className="flex flex-col items-center text-center">
					{/* Badge */}
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-dashed border-highlight/30 bg-primary/5 px-4 py-2 text-sm">
						<span className="size-2 rounded-full bg-primary" />
						<span className="font-semibold">New:</span>
						<span className="opacity-70">AI Chat & Admin Panel Added</span>
					</div>

					{/* Main Heading */}
					<h1 className="mb-6 max-w-3xl text-balance text-5xl font-bold lg:text-7xl">
						Ship your SaaS faster than ever
					</h1>

					{/* Subheading */}
					<p className="mb-8 max-w-lg text-balance text-lg text-foreground/60">
						Production-ready SaaS starter kit with authentication, payments,
						AI chat, and admin panel. Built with Next.js 15, React 19, and
						TypeScript.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button size="lg" asChild>
							<Link href="/auth/login">
								Get Started
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="#features">Learn More</Link>
						</Button>
					</div>

					{/* Tech Stack Logos */}
					<div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-70 grayscale">
						<div className="text-sm font-medium">Built with:</div>
						<div className="text-2xl font-bold">Next.js</div>
						<div className="text-2xl font-bold">Prisma</div>
						<div className="text-2xl font-bold">Stripe</div>
						<div className="text-2xl font-bold">Tailwind</div>
					</div>
				</div>
			</div>
		</section>
	);
}
