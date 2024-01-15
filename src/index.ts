import {
    createBot,
    createContextConstructor,
    getUpdateInfo,
    startBot
} from '@/helpers/'
import { config } from './config'
import { logger } from './utils/logger'

import middlewares from './middlewares'

const bot = createBot(config.BOT_TOKEN, {
    contextConstructor: createContextConstructor({ logger })
})

const protectedBot = bot.errorBoundary((error) => {
    const { ctx } = error

    ctx.logger.error({
        err: error.error,
        update: getUpdateInfo(ctx)
    })
})

protectedBot.use(...middlewares)

startBot(bot)
