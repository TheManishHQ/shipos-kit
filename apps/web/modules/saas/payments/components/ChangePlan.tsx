"use client";

import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function ChangePlan() {
	const t = useTranslations();

	return (
		<Card className="p-6">
			<h3 className="font-semibold text-lg mb-2">
				{t("saas.billing.changePlan.title")}
			</h3>
			<p className="text-muted-foreground text-sm mb-4">
				{t("saas.billing.changePlan.description")}
			</p>
			<Link href="/choose-plan">
				<Button>{t("saas.billing.changePlan.button")}</Button>
			</Link>
		</Card>
	);
}
