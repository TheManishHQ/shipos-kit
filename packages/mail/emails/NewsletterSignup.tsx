import { Text } from "@react-email/components";
import React from "react";
import { createTranslator } from "use-intl/core";
import Wrapper from "../src/components/Wrapper";
import { defaultLocale, defaultTranslations } from "../src/util/translations";
import type { BaseMailProps } from "../types";

export function NewsletterSignup({ locale, translations }: BaseMailProps) {
	const t = createTranslator({
		locale,
		messages: translations,
	});

	return (
		<Wrapper>
			<Text>{t("mail.newsletterSignup.body")}</Text>
		</Wrapper>
	);
}

NewsletterSignup.PreviewProps = {
	locale: defaultLocale,
	translations: defaultTranslations,
};

export default NewsletterSignup;
