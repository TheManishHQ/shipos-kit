import { config as appConfig } from "@shipos/config";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { withQuery } from "ufo";

export default async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    const sessionCookie = getSessionCookie(req);

    if (pathname.startsWith("/app")) {
        const response = NextResponse.next();

        if (!appConfig.ui.saas.enabled) {
            return NextResponse.redirect(new URL("/", origin));
        }

        if (!sessionCookie) {
            return NextResponse.redirect(
                new URL(
                    withQuery("/auth/login", {
                        redirectTo: pathname,
                    }),
                    origin,
                ),
            );
        }

        return response;
    }

    if (pathname.startsWith("/auth")) {
        if (!appConfig.ui.saas.enabled) {
            return NextResponse.redirect(new URL("/", origin));
        }

        return NextResponse.next();
    }

    if (!appConfig.ui.marketing.enabled) {
        return NextResponse.redirect(new URL("/app", origin));
    }

    return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|image-proxy|images|fonts|_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt).*)",
	],
};
