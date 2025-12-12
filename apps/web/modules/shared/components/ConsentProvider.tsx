"use client";

import Cookies from "js-cookie";
import { createContext, useState } from "react";

export const ConsentContext = createContext<{
	userHasConsented: boolean;
	bannerDismissed: boolean;
	allowCookies: () => void;
	declineCookies: () => void;
	dismissBanner: () => void;
}>({
	userHasConsented: false,
	bannerDismissed: false,
	allowCookies: () => {},
	declineCookies: () => {},
	dismissBanner: () => {},
});

export function ConsentProvider({
	children,
	initialConsent,
	initialBannerDismissed,
}: {
	children: React.ReactNode;
	initialConsent?: boolean;
	initialBannerDismissed?: boolean;
}) {
	const [userHasConsented, setUserHasConsented] = useState(!!initialConsent);
	const [bannerDismissed, setBannerDismissed] = useState(
		!!initialBannerDismissed,
	);

	const allowCookies = () => {
		Cookies.set("consent", "true", { expires: 30 });
		setUserHasConsented(true);
		setBannerDismissed(true);
	};

	const declineCookies = () => {
		Cookies.set("consent", "false", { expires: 30 });
		setUserHasConsented(false);
		setBannerDismissed(true);
	};

	const dismissBanner = () => {
		Cookies.set("bannerDismissed", "true", { expires: 365 });
		setBannerDismissed(true);
	};

	return (
		<ConsentContext.Provider
			value={{
				userHasConsented,
				bannerDismissed,
				allowCookies,
				declineCookies,
				dismissBanner,
			}}
		>
			{children}
		</ConsentContext.Provider>
	);
}
