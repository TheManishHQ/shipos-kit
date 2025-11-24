interface LogMetadata {
    [key: string]: unknown
}

interface LogEntry {
    level: string
    message: string
    timestamp: string
    [key: string]: unknown
}

function createLogEntry(
    level: string,
    message: string,
    meta?: LogMetadata,
): LogEntry {
    return {
        level,
        message,
        timestamp: new Date().toISOString(),
        ...meta,
    }
}

export const logger = {
    info(message: string, meta?: LogMetadata): void {
        const entry = createLogEntry('info', message, meta)
        console.log(JSON.stringify(entry))
    },

    warn(message: string, meta?: LogMetadata): void {
        const entry = createLogEntry('warn', message, meta)
        console.warn(JSON.stringify(entry))
    },

    error(message: string, error?: Error | unknown, meta?: LogMetadata): void {
        const entry = createLogEntry('error', message, {
            error:
                error instanceof Error
                    ? {
                        message: error.message,
                        stack: error.stack,
                        name: error.name,
                    }
                    : error,
            ...meta,
        })
        console.error(JSON.stringify(entry))
    },

    debug(message: string, meta?: LogMetadata): void {
        if (process.env.NODE_ENV === 'development') {
            const entry = createLogEntry('debug', message, meta)
            console.debug(JSON.stringify(entry))
        }
    },
}
