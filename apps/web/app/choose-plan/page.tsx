import { config } from "@shipos/config";
import { createPurchasesHelper } from "@shipos/payments/lib/helper";
import { getSession } from "@saas/auth/lib/server";
import { PricingTable } from "@saas/payments/components/PricingTable";
import { AuthWrapper } from "@saas/shared/components/AuthWrapper";
import { orpcClient } from "@shared/lib/orpc-client";
import { attemptAsync } from "es-toolkit";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
	title: "Choose a Plan - Shipos Kit",
	description: "Select the perfect plan for your needs",
};

export default async function ChoosePlanPage() {
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
	}

	const [error, data] = await attemptAsync(() =>
		orpcClient.payments.listPurchases({}),
	);

	if (error) {
		throw new Error("Failed to fetch purchases");
	}

	const purchases = data?.purchases ?? [];
	const { activePlan } = createPurchasesHelper(purchases);

	if (activePlan) {
		redirect("/app");
	}

	return (
		<AuthWrapper contentClass="max-w-5xl">
			<div className="mb-4 text-center">
				<h1 className="text-center font-bold text-2xl lg:text-3xl">
					Choose Your Plan
				</h1>
				<p className="text-muted-foreground text-sm lg:text-base">
					Select the plan that best fits your needs
				</p>
			</div>

			<div>
				<PricingTable userId={session.user.id} />
			</div>
		</AuthWrapper>
	);
}
