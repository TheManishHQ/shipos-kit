import { getSession } from "@saas/auth/lib/server";
import { PageHeader } from "@saas/shared/components/PageHeader";
import UserStart from "@saas/start/UserStart";
import { redirect } from "next/navigation";

export default async function AppStartPage() {
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
	}

	return (
		<div className="">
			<PageHeader
				title={`Welcome back, ${session?.user.name || ""}!`}
				subtitle="Here's what's happening with your account today."
			/>

			<UserStart />
		</div>
	);
}
