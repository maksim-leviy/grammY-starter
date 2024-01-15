import { config } from '@/config'
import { logger } from '@/logger'
import { createServer } from '@/server'
import { Bot } from 'grammy'
import { onShutdown } from 'node-graceful-shutdown'
import { Context } from '.'

export async function startBot(bot: Bot<Context>) {
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
                onStart: () => logger.info({ msg: 'Bot is running!' })
            })
        }
    } catch (error) {
        logger.error(error)
        process.exit(1)
    }
}
