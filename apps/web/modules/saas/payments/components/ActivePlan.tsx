"use client";

import { Card } from "@ui/components/card";

export function ActivePlan({ purchases }: { purchases?: any[] }) {
	if (!purchases || purchases.length === 0) {
		return (
			<Card className="p-6">
				<h3 className="font-semibold text-lg mb-2">
					Active Plan
				</h3>
				<p className="text-muted-foreground text-sm">
					No active plan
				</p>
			</Card>
		);
	}

	const activePurchase = purchases.find((p) => p.status === "active");

	return (
		<Card className="p-6">
			<h3 className="font-semibold text-lg mb-2">
				Active Plan
			</h3>
			{activePurchase ? (
				<div>
					<p className="text-sm">
						<span className="font-medium">Plan:</span> {activePurchase.productId}
					</p>
					<p className="text-sm text-muted-foreground">
						<span className="font-medium">Status:</span> {activePurchase.status}
					</p>
				</div>
			) : (
				<p className="text-muted-foreground text-sm">Free Plan</p>
			)}
		</Card>
	);
}
