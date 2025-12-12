"use client";

import { config } from "@shipos/config";
import { useCookieConsent } from "@shared/hooks/cookie-consent";
import { Button } from "@ui/components/button";
import { Cookie, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@ui/lib";

export function ConsentBanner() {
	const { userHasConsented, bannerDismissed, allowCookies, declineCookies, dismissBanner } =
		useCookieConsent();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted || bannerDismissed || userHasConsented) {
		return null;
	}

	const handleClose = () => {
		dismissBanner();
	};

	const { useSidebarLayout } = config.ui.saas;

	return (
		<div
			className={cn(
				"fixed bottom-4 max-w-md z-50 animate-in slide-in-from-bottom-4 fade-in duration-300",
				useSidebarLayout
					? "left-4 md:left-[calc(16rem+1rem)]"
					: "left-4",
			)}
		>
			<div className="relative flex gap-4 rounded-2xl border bg-card p-4 text-card-foreground shadow-xl">
				<button
					onClick={handleClose}
					className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted transition-colors"
					aria-label="Close cookie banner"
				>
					<X className="size-4" />
				</button>
				<Cookie className="block size-6 shrink-0 text-primary/60 mt-1" />
				<div className="flex-1 pr-6">
					<p className="text-sm leading-normal">
						This site doesn't use cookies yet, but we added this
						banner to demo it to you.
					</p>
					<div className="mt-4 flex gap-2">
						<Button
							variant="light"
							className="flex-1"
							onClick={() => {
								declineCookies();
							}}
						>
							Decline
						</Button>
						<Button
							className="flex-1"
							onClick={() => {
								allowCookies();
							}}
						>
							Allow
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
