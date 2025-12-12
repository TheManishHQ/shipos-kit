import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { config } from "@shipos/config";
import { SessionProvider } from "@saas/auth/components/SessionProvider";
import { sessionQueryKey } from "@saas/auth/lib/api";
import { getSession } from "@saas/auth/lib/server";
import { ConfirmationAlertProvider } from "@saas/shared/components/ConfirmationAlertProvider";
import { Document } from "@shared/components/Document";
import { orpc } from "@shared/lib/orpc-query-utils";
import { getServerQueryClient } from "@shared/lib/server";

export default async function SaaSLayout({ children }: PropsWithChildren) {
	const session = await getSession();

	if (!session) {
		redirect("/auth/login");
	}

	const queryClient = getServerQueryClient();

	await queryClient.prefetchQuery({
		queryKey: sessionQueryKey,
		queryFn: () => session,
	});

	if (config.users.enableBilling) {
		await queryClient.prefetchQuery(
			orpc.payments.listPurchases.queryOptions({
				input: {},
			}),
		);
	}

	return (
		<Document>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<SessionProvider>
					<ConfirmationAlertProvider>
						{children}
					</ConfirmationAlertProvider>
				</SessionProvider>
			</HydrationBoundary>
		</Document>
	);
}
