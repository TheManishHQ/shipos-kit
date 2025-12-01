import type { config } from "@shipos/config";
import type { ReactNode } from "react";

type ProductReferenceId = keyof (typeof config)["payments"]["plans"];

export function usePlanData() {
	const planData: Record<
		ProductReferenceId,
		{
			title: string;
			description: ReactNode;
			features: ReactNode[];
		}
	> = {
		free: {
			title: "Free",
			description: "Perfect for trying out Shipos Kit",
			features: ["Basic features", "Limited support"],
		},
		pro: {
			title: "Pro",
			description: "For professionals and growing teams",
			features: ["All features", "Priority support"],
		},
		enterprise: {
			title: "Enterprise",
			description: "For large organizations with custom needs",
			features: ["Unlimited projects", "Enterprise support"],
		},
		lifetime: {
			title: "Lifetime",
			description: "One-time payment, lifetime access",
			features: ["No recurring costs", "Extended support"],
		},
	};

	return { planData };
}
