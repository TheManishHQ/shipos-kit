export const config = {
    appName: 'Shipos Kit',

    i18n: {
        enabled: true,
        locales: {
            en: { currency: 'USD', label: 'English' },
            de: { currency: 'USD', label: 'Deutsch' },
        },
        defaultLocale: 'en' as const,
        defaultCurrency: 'USD',
        localeCookieName: 'NEXT_LOCALE',
    },

    users: {
        enableBilling: true,
        enableOnboarding: true,
    },

    auth: {
        enableSignup: true,
        enableMagicLink: true,
        enableSocialLogin: true,
        enablePasskeys: true,
        enablePasswordLogin: true,
        enableTwoFactor: true,
        redirectAfterSignIn: '/app',
        redirectAfterLogout: '/',
        sessionCookieMaxAge: 30 * 24 * 60 * 60, // 30 days
    },

    mails: {
        from: process.env.EMAIL_FROM || 'noreply@example.com',
    },

    storage: {
        bucketNames: {
            avatars: process.env.NEXT_PUBLIC_AVATARS_BUCKET_NAME || 'avatars',
        },
    },

    ui: {
        enabledThemes: ['light', 'dark'] as const,
        defaultTheme: 'light' as const,
        saas: {
            enabled: true,
            useSidebarLayout: true,
        },
        marketing: {
            enabled: true,
        },
    },

    contactForm: {
        enabled: true,
        to: process.env.CONTACT_FORM_TO || 'contact@example.com',
        subject: 'New Contact Form Submission',
    },

    payments: {
        plans: {
            free: {
                isFree: true,
                prices: [],
            },
            pro: {
                recommended: true,
                prices: [
                    {
                        productId: 'price_pro_monthly',
                        amount: 2900,
                        currency: 'USD',
                        type: 'recurring' as const,
                        interval: 'month' as const,
                        trialPeriodDays: 14,
                    },
                    {
                        productId: 'price_pro_yearly',
                        amount: 29000,
                        currency: 'USD',
                        type: 'recurring' as const,
                        interval: 'year' as const,
                    },
                ],
            },
            lifetime: {
                prices: [
                    {
                        productId: 'price_lifetime',
                        amount: 99900,
                        currency: 'USD',
                        type: 'one-time' as const,
                    },
                ],
            },
            enterprise: {
                isEnterprise: true,
                prices: [],
            },
        },
    },
} as const
