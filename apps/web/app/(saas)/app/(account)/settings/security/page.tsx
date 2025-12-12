import { config } from "@shipos/config";
import { userAccountQueryKey } from "@saas/auth/lib/api";
import {
	getSession,
	getUserAccounts,
} from "@saas/auth/lib/server";
import { ActiveSessionsBlock } from "@saas/settings/components/ActiveSessionsBlock";
import { ChangePasswordForm } from "@saas/settings/components/ChangePasswordForm";
import { ConnectedAccountsBlock } from "@saas/settings/components/ConnectedAccountsBlock";
import { SetPasswordForm } from "@saas/settings/components/SetPasswordForm";
import { SettingsList } from "@saas/shared/components/SettingsList";
import { getServerQueryClient } from "@shared/lib/server";
import { redirect } from "next/navigation";
export async function generateMetadata() {
	return {
		title: "Security Settings",
	};
}

export default async function AccountSettingsPage() {
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
	}

	const userAccounts = await getUserAccounts();

	const userHasPassword = userAccounts?.some(
		(account) => account.providerId === "credential",
	);

	const queryClient = getServerQueryClient();

	await queryClient.prefetchQuery({
		queryKey: userAccountQueryKey,
		queryFn: () => getUserAccounts(),
	});

	return (
		<SettingsList>
			{config.auth.enablePasswordLogin &&
				(userHasPassword ? (
					<ChangePasswordForm />
				) : (
					<SetPasswordForm />
				))}
			{config.auth.enableSocialLogin && <ConnectedAccountsBlock />}
			<ActiveSessionsBlock />
		</SettingsList>
	);
}
