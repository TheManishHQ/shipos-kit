import { config } from '@shipos/config'
import { prisma } from '@shipos/database'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import {
	admin,
	magicLink,
	openAPI,
	twoFactor,
	username,
} from 'better-auth/plugins'
import { parse as parseCookies } from 'cookie'

function getLocaleFromRequest(request?: Request): string {
	if (!request) return config.i18n.defaultLocale

	const cookies = parseCookies(request.headers.get('cookie') ?? '')
	return cookies[config.i18n.localeCookieName] ?? config.i18n.defaultLocale
}

function getBaseUrl(): string {
	if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	return 'http://localhost:3000'
}

export const auth = betterAuth({
	baseURL: getBaseUrl(),
	trustedOrigins: [getBaseUrl()],
	appName: config.appName,
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	advanced: {
		database: {
			generateId: false,
		},
	},
	session: {
		expiresIn: config.auth.sessionCookieMaxAge,
		freshAge: 0,
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['google', 'github'],
		},
	},
	user: {
		additionalFields: {
			onboardingComplete: {
				type: 'boolean',
				required: false,
			},
			locale: {
				type: 'string',
				required: false,
			},
		},
		deleteUser: {
			enabled: true,
		},
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, url }, request) => {
				const locale = getLocaleFromRequest(request)
				// TODO: Implement email sending when mail package is ready
				console.log('Send change email verification to:', user.email, {
					url,
					locale,
				})
			},
		},
	},
	emailAndPassword: {
		enabled: config.auth.enablePasswordLogin,
		autoSignIn: !config.auth.enableSignup,
		requireEmailVerification: config.auth.enableSignup,
		sendResetPassword: async ({ user, url }, request) => {
			const locale = getLocaleFromRequest(request)
			// TODO: Implement email sending when mail package is ready
			console.log('Send password reset to:', user.email, { url, locale })
		},
	},
	emailVerification: {
		sendOnSignUp: config.auth.enableSignup,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }, request) => {
			const locale = getLocaleFromRequest(request)
			// TODO: Implement email sending when mail package is ready
			console.log('Send email verification to:', user.email, { url, locale })
		},
	},
	socialProviders: config.auth.enableSocialLogin
		? {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				scope: ['email', 'profile'],
				enabled: !!(
					process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
				),
			},
			github: {
				clientId: process.env.GITHUB_CLIENT_ID as string,
				clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
				scope: ['user:email'],
				enabled: !!(
					process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
				),
			},
		}
		: undefined,
	plugins: [
		username(),
		admin(),
		...(config.auth.enableMagicLink
			? [
				magicLink({
					disableSignUp: !config.auth.enableSignup,
					sendMagicLink: async ({ email, url }, request) => {
						const locale = getLocaleFromRequest(request)
						// TODO: Implement email sending when mail package is ready
						console.log('Send magic link to:', email, { url, locale })
					},
				}),
			]
			: []),
		...(config.auth.enableTwoFactor ? [twoFactor()] : []),
		openAPI(),
	],
	onAPIError: {
		onError(error, ctx) {
			console.error('Auth API Error:', error, { ctx })
		},
	},
})

export type Session = typeof auth.$Infer.Session
