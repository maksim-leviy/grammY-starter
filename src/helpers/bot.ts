import { config } from '@/config'
import {
    Context,
    SessionData,
    createContextConstructor
} from '@/helpers/context'
import { logger } from '@/utils/logger'
import { Update, UserFromGetMe } from '@grammyjs/types'
import { Api, BotConfig, StorageAdapter, Bot as TelegramBot } from 'grammy'
import { onShutdown } from 'node-graceful-shutdown'
import { createServer } from './server'

type Options = {
    sessionStorage?: StorageAdapter<SessionData>
    contextConstructor?: new (
        update: Update,
        api: Api,
        me: UserFromGetMe
    ) => Context
    config?: Omit<BotConfig<Context>, 'ContextConstructor'>
}

export function createBot(token: string, options: Options = {}) {
    const { sessionStorage, contextConstructor } = options
    const bot = new TelegramBot(token, {
        ...options.config,
        ContextConstructor:
            contextConstructor || createContextConstructor({ logger })
    })

    return bot
}

export async function startBot(bot: Bot) {
    const server = await createServer(bot)
    const allowed_updates = config.BOT_ALLOWED_UPDATES

    try {
        onShutdown(async () => {
            logger.info('shutdown')
            await server.close()
            await bot.stop()
        })

        if (config.BOT_MODE === 'webhook') {
            await bot.init()
            await bot.api.setWebhook(config.BOT_WEBHOOK, { allowed_updates })
        } else if (config.BOT_MODE === 'polling') {
            await bot.start({
                allowed_updates,
                onStart: ({ username }) =>
                    logger.info({ msg: 'Bot is running!', username })
            })
        }
    } catch (error) {
        logger.error(error)
        process.exit(1)
    }
}

export type Bot = ReturnType<typeof createBot>
