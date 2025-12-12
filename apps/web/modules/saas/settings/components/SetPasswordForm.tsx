"use client";

import { useSession } from "@saas/auth/hooks/use-session";
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { Button } from "@ui/components/button";
import { useState } from "react";
import { toast } from "sonner";

export function SetPasswordForm() {
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

			toast.success("Password set successfully");
		} catch (error) {
			toast.error("Failed to set password");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<SettingsItem
			title="Set Password"
			description="Set a password for your account to enable password-based login."
		>
			<div className="flex justify-end">
				<Button type="submit" loading={submitting} onClick={onSubmit}>
					Set Password
				</Button>
			</div>
		</SettingsItem>
	);
}
