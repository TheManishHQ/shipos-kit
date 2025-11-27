import { webhookHandler } from "@shipos/payments";

export async function POST(req: Request) {
    return webhookHandler(req);
}
