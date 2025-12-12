"use client";

import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import Link from "next/link";

export function ChangePlan() {
	return (
		<Card className="p-6">
			<h3 className="font-semibold text-lg mb-2">
				Change Plan
			</h3>
			<p className="text-muted-foreground text-sm mb-4">
				Upgrade or downgrade your plan at any time.
			</p>
			<Link href="/choose-plan">
				<Button>Change Plan</Button>
			</Link>
		</Card>
	);
}
