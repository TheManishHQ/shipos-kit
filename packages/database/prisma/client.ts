import { PrismaClient } from './generated/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is set and is a string
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl || typeof databaseUrl !== 'string') {
    throw new Error(
        `DATABASE_URL environment variable is not set or is not a string. ` +
        `Current value: ${JSON.stringify(databaseUrl)}. ` +
        `Please ensure DATABASE_URL is set in your .env file.`
    )
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
    })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
