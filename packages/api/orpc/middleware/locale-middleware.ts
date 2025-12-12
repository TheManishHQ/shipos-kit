import { os } from "@orpc/server";
import { config } from "@shipos/config";

export const localeMiddleware = os
    .$context<{
        headers: Headers;
    }>()
    .middleware(async ({ context, next }) => {
        const locale = config.i18n.defaultLocale;

        return await next({
            context: {
                locale,
            },
        });
    });
