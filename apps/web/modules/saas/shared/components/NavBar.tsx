"use client";
import { config } from "@shipos/config";
import { useSession } from "@saas/auth/hooks/use-session";
import { UserMenu } from "@saas/shared/components/UserMenu";
import { Logo } from "@shared/components/Logo";
import { cn } from "@ui/lib";
import {
	BotMessageSquareIcon,
	HomeIcon,
	SettingsIcon,
	UserCog2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function NavBar() {
	const t = useTranslations();
	const pathname = usePathname();
	const { user } = useSession();

	const { useSidebarLayout } = config.ui.saas;

	const basePath = "/app";

	const menuItems = [
		{
			label: t("app.menu.start"),
			href: basePath,
			icon: HomeIcon,
			isActive: pathname === basePath,
		},
		{
			label: t("app.menu.aiChatbot"),
			href: "/app/chat",
			icon: BotMessageSquareIcon,
			isActive: pathname.includes("/chat"),
		},
		{
			label: t("app.menu.settings"),
			href: "/app/settings",
			icon: SettingsIcon,
			isActive: pathname.includes("/app/settings"),
		},
		...(user?.role === "admin"
			? [
					{
						label: t("app.menu.admin"),
						href: "/app/admin",
						icon: UserCog2Icon,
						isActive: pathname.includes("/app/admin"),
					},
				]
			: []),
	];

	if (useSidebarLayout) {
		return (
			<nav className="sticky top-0 z-10 flex w-full items-center gap-4 border-border border-b bg-background p-4 md:w-64 md:flex-col md:items-stretch md:gap-8 md:border-b-0 md:border-r md:p-6">
				<div className="flex items-center gap-4 md:flex-col md:items-stretch">
					<Link href="/app" className="block">
						<Logo />
					</Link>
				</div>

				<ul
					className={cn(
						"hidden w-full flex-col gap-2 md:flex md:flex-1",
					)}
				>
					{menuItems.map((item) => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={cn(
									"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
									{
										"bg-muted": item.isActive,
									},
								)}
							>
								<item.icon className="size-4" />
								{item.label}
							</Link>
						</li>
					))}
				</ul>

				<div className="ml-auto md:ml-0">
					<UserMenu />
				</div>
			</nav>
		);
	}

	return (
		<nav className="sticky top-0 z-10 flex items-center justify-between border-border border-b bg-background p-4">
			<div className="flex items-center gap-8">
				<Link href="/app">
					<Logo />
				</Link>

				<ul className="hidden items-center gap-6 md:flex">
					{menuItems.map((item) => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={cn(
									"text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
									{
										"text-foreground": item.isActive,
									},
								)}
							>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</div>

			<UserMenu />
		</nav>
	);
}
