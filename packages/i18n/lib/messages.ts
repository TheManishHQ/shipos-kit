import { config } from "@shipos/config";
import deepmerge from "deepmerge";
import type { Messages } from "../types";

export async function importLocale(locale: string): Promise<Messages> {
	return (await import(`../translations/${locale}.json`)).default as Messages;
}

export async function getMessagesForLocale(locale: string): Promise<Messages> {
	const localeMessages = await importLocale(locale);
	if (locale === config.i18n.defaultLocale) {
		return localeMessages;
	}
	const defaultLocaleMessages = await importLocale(config.i18n.defaultLocale);
	return deepmerge(defaultLocaleMessages, localeMessages);
}
