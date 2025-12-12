import { render } from "@react-email/render";
import enMessages from "@shipos/i18n/translations/en.json";
import { mailTemplates } from "../../emails";

export async function getTemplate<T extends TemplateId>({
	templateId,
	context,
	locale,
}: {
	templateId: T;
	context: Omit<
		Parameters<(typeof mailTemplates)[T]>[0],
		"locale" | "translations"
	>;
	locale: 'en';
}) {
	const template = mailTemplates[templateId];
	const translations = enMessages as any;

	const email = template({
		...(context as any),
		locale: 'en',
		translations,
	});

	const subject =
		translations?.mail?.[templateId]?.subject || "";

	const html = await render(email);
	const text = await render(email, { plainText: true });
	return { html, text, subject };
}

export type TemplateId = keyof typeof mailTemplates;
