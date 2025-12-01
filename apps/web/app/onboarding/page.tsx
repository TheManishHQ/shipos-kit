import { config } from "@shipos/config";
import { getSession } from "@saas/auth/lib/server";
import { OnboardingForm } from "@saas/onboarding/components/OnboardingForm";
import { AuthWrapper } from "@saas/shared/components/AuthWrapper";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
	title: "Onboarding - Shipos Kit",
	description: "Set up your account to get started with Shipos Kit",
};

export default async function OnboardingPage() {
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
	}

	if (!config.users.enableOnboarding || session.user.onboardingComplete) {
		redirect("/app");
	}

	return (
		<AuthWrapper>
			<OnboardingForm />
		</AuthWrapper>
	);
}
