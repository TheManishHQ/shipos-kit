import { PageHeader } from "@saas/shared/components/PageHeader";
import { SettingsMenu } from "@saas/settings/components/SettingsMenu";
import { SidebarContentLayout } from "@saas/shared/components/SidebarContentLayout";
import { getSession } from "@saas/auth/lib/server";
import { ShieldCheckIcon, UsersIcon } from "lucide-react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
	}

	if (session.user?.role !== "admin") {
		redirect("/app");
	}

	return (
		<SidebarContentLayout
			sidebar={
				<SettingsMenu
					menuItems={[
						{
							title: "Admin Panel",
							avatar: <ShieldCheckIcon className="size-8" />,
							items: [
								{
									title: "Users",
									href: "/app/admin/users",
									icon: <UsersIcon className="size-4" />,
								},
							],
						},
					]}
				/>
			}
		>
			<PageHeader
				title="Admin Panel"
				subtitle="Manage users and system settings"
			/>
			{children}
		</SidebarContentLayout>
	);
}
