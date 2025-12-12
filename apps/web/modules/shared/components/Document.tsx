import { ClientProviders } from "@shared/components/ClientProviders";
import { ConsentProvider } from "@shared/components/ConsentProvider";
import { cookies } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";

export async function Document({
	children,
}: PropsWithChildren) {
	const cookieStore = await cookies();
	const consentCookie = cookieStore.get("consent");
	const bannerDismissedCookie = cookieStore.get("bannerDismissed");

	return (
		<NuqsAdapter>
			<ConsentProvider
				initialConsent={consentCookie?.value === "true"}
				initialBannerDismissed={bannerDismissedCookie?.value === "true"}
			>
				<ClientProviders>{children}</ClientProviders>
			</ConsentProvider>
		</NuqsAdapter>
	);
}
