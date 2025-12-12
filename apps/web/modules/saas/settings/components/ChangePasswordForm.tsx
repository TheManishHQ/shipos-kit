"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@shipos/auth/client";
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { useRouter } from "@shared/hooks/router";
import { Button } from "@ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ui/components/form";
import { PasswordInput } from "@ui/components/password-input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export function ChangePasswordForm() {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
	});

	const onSubmit = form.handleSubmit(async (values) => {
		const { error } = await authClient.changePassword({
			...values,
			revokeOtherSessions: true,
		});

		if (error) {
			toast.error("Failed to update password");

			return;
		}

		toast.success("Password updated successfully");
		form.reset({});
		router.refresh();
	});

	return (
		<SettingsItem
			title="Change Password"
		>
			<Form {...form}>
				<form onSubmit={onSubmit}>
					<div className="grid grid-cols-1 gap-4">
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Current Password
									</FormLabel>

									<FormControl>
										<PasswordInput
											autoComplete="current-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										New Password
									</FormLabel>
									<FormControl>
										<PasswordInput
											autoComplete="new-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button
								type="submit"
								loading={form.formState.isSubmitting}
								disabled={
									!(
										form.formState.isValid &&
										Object.keys(form.formState.dirtyFields)
											.length
									)
								}
							>
								Save
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</SettingsItem>
	);
}
