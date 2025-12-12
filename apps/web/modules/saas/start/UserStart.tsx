"use client";

import { config } from "@shipos/config";
import { useSession } from "@saas/auth/hooks/use-session";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/card";
import { Progress } from "@ui/components/progress";
import { 
	Sparkles, 
	Rocket, 
	CheckCircle2,
	ArrowRight,
	LayoutDashboard,
	Settings,
	CreditCard,
	User,
	Shield
} from "lucide-react";
import Link from "next/link";

export default function UserStart() {
	const { user } = useSession();

	const onboardingProgress = user?.onboardingComplete ? 100 : 50;

	const quickStats = [
		{
			label: "Account Status",
			value: "Active",
			icon: CheckCircle2,
			color: "text-emerald-500",
			bg: "bg-emerald-500/10",
		},
		{
			label: "Onboarding",
			value: user?.onboardingComplete ? "Complete" : "In Progress",
			icon: Rocket,
			color: "text-blue-500",
			bg: "bg-blue-500/10",
		},
		{
			label: "Current Plan",
			value: "Free",
			icon: CreditCard,
			color: "text-purple-500",
			bg: "bg-purple-500/10",
		},
	];

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Quick Stats Grid */}
			<div className="grid gap-4 md:grid-cols-3">
				{quickStats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Card key={stat.label} className="border-none shadow-sm bg-card/50 hover:bg-card transition-colors">
							<CardContent className="p-6 flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">
										{stat.label}
									</p>
									<p className="text-2xl font-bold tracking-tight">
										{stat.value}
									</p>
								</div>
								<div className={`p-3 rounded-full ${stat.bg}`}>
									<Icon className={`size-6 ${stat.color}`} />
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid gap-8 md:grid-cols-3">
				{/* Main Welcome Section */}
				<div className="md:col-span-2 space-y-8">
					{/* Get Started Card */}
					<Card className="overflow-hidden border-primary/20 shadow-md relative">
						<div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
						
						<CardHeader>
							<div className="flex items-center gap-2 text-primary mb-2">
								<Sparkles className="size-5" />
								<span className="text-sm font-semibold uppercase tracking-wider">Get Started</span>
							</div>
							<CardTitle className="text-2xl">Welcome to your dashboard</CardTitle>
							<CardDescription className="text-base">
								You're all set! Here are some quick actions to help you get started with your new account.
							</CardDescription>
						</CardHeader>
						
						<CardContent className="space-y-6">
							{!user?.onboardingComplete && (
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="font-medium">Setup Progress</span>
										<span className="text-muted-foreground">{onboardingProgress}%</span>
									</div>
									<Progress value={onboardingProgress} className="h-2" />
								</div>
							)}

							<div className="flex flex-wrap gap-3">
								{!user?.onboardingComplete && (
									<Button asChild className="group">
										<Link href="/onboarding">
											Complete Setup
											<ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
										</Link>
									</Button>
								)}
								<Button asChild variant="outline">
									<Link href="/app/settings">
										<Settings className="mr-2 size-4" />
										Settings
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Content Placeholder */}
					<div className="grid gap-4 sm:grid-cols-2">
						{[1, 2].map((i) => (
							<Card key={i} className="border-dashed border-2 bg-muted/5 shadow-none">
								<CardContent className="flex flex-col items-center justify-center h-48 text-center p-6">
									<div className="p-4 rounded-full bg-muted mb-4">
										<LayoutDashboard className="size-6 text-muted-foreground" />
									</div>
									<h3 className="font-semibold mb-1">Widget Placeholder {i}</h3>
									<p className="text-sm text-muted-foreground">
										Add your custom widgets or content here
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Sidebar / Secondary Actions */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-2">
							<Button asChild variant="ghost" className="w-full justify-start">
								<Link href="/app/settings/general">
									<User className="mr-2 size-4 text-muted-foreground" />
									Update Profile
								</Link>
							</Button>
							<Button asChild variant="ghost" className="w-full justify-start">
								<Link href="/app/settings/security">
									<Shield className="mr-2 size-4 text-muted-foreground" />
									Security Settings
								</Link>
							</Button>
							{config.users.enableBilling && (
								<Button asChild variant="ghost" className="w-full justify-start">
									<Link href="/app/settings/billing">
										<CreditCard className="mr-2 size-4 text-muted-foreground" />
										Billing & Plans
									</Link>
								</Button>
							)}
						</CardContent>
					</Card>

					<Card className="bg-primary/5 border-primary/10">
						<CardHeader>
							<CardTitle className="text-lg text-primary">Pro Tip</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								You can customize your dashboard layout and widgets from the settings menu.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
