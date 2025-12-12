"use client";
import { config } from "@shipos/config";
import { useSession } from "@saas/auth/hooks/use-session";
import { UserMenu } from "@saas/shared/components/UserMenu";
import { Logo } from "@shared/components/Logo";
import { Button } from "@ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@ui/components/sheet";
import { cn } from "@ui/lib";
import {
	BotMessageSquare,
	Home,
	Menu,
	Settings,
	UserCog2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function NavBar() {
	const pathname = usePathname();
	const { user } = useSession();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const { useSidebarLayout } = config.ui.saas;

	const basePath = "/app";

	const menuItems = [
		{
			label: "Start",
			href: basePath,
			icon: Home,
			isActive: pathname === basePath,
		},
		{
			label: "AI Chatbot",
			href: "/app/chat",
			icon: BotMessageSquare,
			isActive: pathname.includes("/chat"),
		},
		{
			label: "Settings",
			href: "/app/settings",
			icon: Settings,
			isActive: pathname.includes("/app/settings"),
		},
		...(user?.role === "admin"
			? [
					{
						label: "Admin",
						href: "/app/admin",
						icon: UserCog2,
						isActive: pathname.includes("/app/admin"),
					},
				]
			: []),
	];

	const MenuContent = () => (
		<>
			<ul className="flex flex-1 flex-col gap-1">
				{menuItems.map((item) => {
					const Icon = item.icon;
					return (
						<li key={item.href}>
							<Link
								href={item.href}
								onClick={() => setMobileMenuOpen(false)}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
									{
										"bg-muted text-foreground": item.isActive,
										"text-muted-foreground": !item.isActive,
									},
								)}
							>
								<Icon className="size-5 shrink-0" />
								<span>{item.label}</span>
							</Link>
						</li>
					);
				})}
			</ul>
			<div className="mt-auto border-t border-border pt-4">
				<UserMenu showUserName />
			</div>
		</>
	);

	if (useSidebarLayout) {
		return (
			<>
				{/* Mobile Menu */}
				<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="fixed left-4 top-4 z-50 md:hidden"
							aria-label="Open menu"
						>
							<Menu className="size-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-64 p-0">
						<SheetHeader className="border-b border-border p-6">
							<SheetTitle>
								<Logo />
							</SheetTitle>
						</SheetHeader>
						<div className="flex h-[calc(100vh-80px)] flex-col p-6">
							<MenuContent />
						</div>
					</SheetContent>
				</Sheet>

				{/* Desktop Sidebar */}
				<nav className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-background p-6 md:flex">
					{/* Logo */}
					<div className="mb-8">
						<Link href="/app" className="block">
							<Logo />
						</Link>
					</div>

					<MenuContent />
				</nav>
			</>
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
