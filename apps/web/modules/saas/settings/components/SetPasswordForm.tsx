"use client";

import { useSession } from "@saas/auth/hooks/use-session";
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { Button } from "@ui/components/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export function SetPasswordForm() {
	const t = useTranslations();
	const { user } = useSession();
	const [submitting, setSubmitting] = useState(false);

	const onSubmit = async () => {
		if (!user) return;

		setSubmitting(true);

		try {
			// Send password reset email via better-auth API
			const response = await fetch("/api/auth/forget-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: user.email,
					redirectTo: `${window.location.origin}/auth/reset-password`,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send reset email");
			}

			toast.success(
				t("settings.account.security.setPassword.notifications.success")
			);
		} catch (error) {
			toast.error(
				t("settings.account.security.setPassword.notifications.error")
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<SettingsItem
			title={t("settings.account.security.setPassword.title")}
			description={t("settings.account.security.setPassword.description")}
		>
			<div className="flex justify-end">
				<Button type="submit" loading={submitting} onClick={onSubmit}>
					{t("settings.account.security.setPassword.submit")}
				</Button>
			</div>
		</SettingsItem>
	);
}
