import { getUserLocale } from "@i18n/lib/locale-cookie";
import { routing } from "@i18n/routing";
import { config } from "@shipos/config";
import { getMessagesForLocale } from "@shipos/i18n";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale) {
        locale = await getUserLocale();
    }

    if (!(routing.locales.includes(locale) && config.i18n.enabled)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: await getMessagesForLocale(locale),
    };
});
