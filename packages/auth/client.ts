import {
    adminClient,
    inferAdditionalFields,
    magicLinkClient,
    twoFactorClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from './auth'

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(),
        magicLinkClient(),
        adminClient(),
        twoFactorClient(),
    ],
})

export type AuthClientErrorCodes = typeof authClient.$ERROR_CODES
