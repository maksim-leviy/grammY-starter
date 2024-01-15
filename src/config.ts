import 'dotenv/config'
import { API_CONSTANTS } from 'grammy'
import { parseEnv, port } from 'znv'
import z from 'zod'

const createConfig = (environment: NodeJS.ProcessEnv) => {
    const config = parseEnv(environment, {
        NODE_ENV: z.enum(['development', 'production']),
        LOG_LEVEL: z
            .enum(['trace', 'debug', 'info', 'warn', 'fatal', 'silent'])
            .default('info'),
        BOT_MODE: {
            schema: z.enum(['polling', 'webhook']),
            defaults: {
                production: 'webhook' as const,
                development: 'polling' as const
            }
        },
        BOT_TOKEN: z.string(),
        BOT_WEBHOOK: z.string().default(''),
        BOT_HOST: z.string().default('0.0.0.0'),
        BOT_PORT: port().default(80),
        BOT_ALLOWED_UPDATES: z
            .array(z.enum(API_CONSTANTS.ALL_UPDATE_TYPES))
            .default([]),
        BOT_ADMINS: z.array(z.number()).default([])
    })

    if (config.BOT_MODE === 'webhook') {
        z.string()
            .url()
            .parse(config.BOT_WEBHOOK, {
                path: ['BOT_WEBHOOK']
            })
    }

    return {
        ...config,
        isDevelopment: process.env.NODE_ENV === 'development',
        isProduction: process.env.NODE_ENV === 'production'
    }
}

export type Config = ReturnType<typeof createConfig>

export const config = createConfig(process.env)
