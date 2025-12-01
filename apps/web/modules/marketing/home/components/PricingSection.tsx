import { config } from "@shipos/config";
import { Button } from "@ui/components/button";
import { CheckIcon, StarIcon } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
	const plans = Object.entries(config.payments.plans).map(([id, plan]) => ({
		id,
		...plan,
	}));

	return (
		<section id="pricing" className="scroll-mt-16 border-t py-12 lg:py-16">
			<div className="container max-w-6xl">
				{/* Header */}
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-4xl font-bold lg:text-5xl">
						Simple, transparent pricing
					</h2>
					<p className="text-lg text-foreground/50">
						Choose the plan that's right for you
					</p>
				</div>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{plans.map((plan) => {
						const isRecommended = plan.id === "pro";
						const isFree = "isFree" in plan && plan.isFree;
						const price = "prices" in plan ? plan.prices?.[0] : null;

						return (
							<div
								key={plan.id}
								className={`relative rounded-3xl border p-6 ${
									isRecommended
										? "border-primary bg-primary/5 shadow-lg"
										: "bg-card"
								}`}
							>
								{isRecommended && (
									<div className="absolute -top-4 left-1/2 -translate-x-1/2">
										<div className="flex items-center gap-2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
											<StarIcon className="size-4" />
											Recommended
										</div>
									</div>
								)}

								<div className="mb-4">
									<h3 className="text-2xl font-bold capitalize">{plan.id}</h3>
								</div>

								<div className="mb-6">
									{isFree ? (
										<div className="text-4xl font-bold">Free</div>
									) : price ? (
										<div>
											<span className="text-4xl font-bold">
												${((price.amount || 0) / 100).toFixed(0)}
											</span>
											<span className="text-foreground/60">
												/{"interval" in price ? price.interval : "month"}
											</span>
										</div>
									) : (
										<div className="text-2xl font-bold">Contact Sales</div>
									)}
								</div>

								<div className="mb-6 space-y-3">
									{("features" in plan ? plan.features : [])?.map(
										(feature: string, index: number) => (
											<div key={index} className="flex items-start gap-3">
												<CheckIcon className="size-5 shrink-0 text-primary" />
												<span className="text-sm">{feature}</span>
											</div>
										),
									)}
								</div>

								<Button
									className="w-full"
									variant={isRecommended ? "primary" : "outline"}
									asChild
								>
									<Link href="/auth/login">
										{isFree ? "Get Started" : "Choose Plan"}
									</Link>
								</Button>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
