import { config } from "@shipos/config";
import { NavBar } from "@saas/shared/components/NavBar";
import { cn } from "@ui/lib";
import type { PropsWithChildren } from "react";

export function AppWrapper({ children }: PropsWithChildren) {
	return (
		<div
			className={cn(
				"bg-[radial-gradient(farthest-corner_at_0%_0%,color-mix(in_oklch,var(--color-primary),transparent_95%)_0%,var(--color-background)_50%)] dark:bg-[radial-gradient(farthest-corner_at_0%_0%,color-mix(in_oklch,var(--color-primary),transparent_90%)_0%,var(--color-background)_50%)]",
				[config.ui.saas.useSidebarLayout ? "" : ""],
			)}
		>
			<NavBar />
			<div
				className={cn("flex", [
					config.ui.saas.useSidebarLayout
						? "min-h-screen pt-16 md:ml-64 md:pt-0"
						: "",
				])}
			>
				<main
					className={cn(
						"w-full",
						[
							config.ui.saas.useSidebarLayout
								? "p-4 md:p-8"
								: "py-6 border rounded-2xl bg-card px-4 md:p-8 min-h-full",
						],
					)}
				>
					<div className={cn("", [config.ui.saas.useSidebarLayout ? "" : "container px-0"])}>
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
