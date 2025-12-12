import { AiChat } from "@saas/ai/components/AiChat";
import { PageHeader } from "@saas/shared/components/PageHeader";
import { orpcClient } from "@shared/lib/orpc-client";
import { orpc } from "@shared/lib/orpc-query-utils";
import { getServerQueryClient } from "@shared/lib/server";

export default async function ChatPage() {
	const queryClient = getServerQueryClient();

	const { chats } = await orpcClient.ai.chats.list({});

	await queryClient.prefetchQuery({
		queryKey: orpc.ai.chats.list.queryKey({
			input: {},
		}),
		queryFn: async () => ({ chats }),
	});

	if (chats.length > 0) {
		await queryClient.prefetchQuery(
			orpc.ai.chats.find.queryOptions({
				input: {
					id: chats[0].id,
				},
			}),
		);
	}

	return (
		<>
			<PageHeader
				title="AI Chat"
				subtitle="Chat with AI powered by OpenAI GPT-4o-mini"
			/>

			<AiChat />
		</>
	);
}

