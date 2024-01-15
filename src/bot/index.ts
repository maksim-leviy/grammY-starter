import {
    createContextConstructor,
    getUpdateInfo,
    startBot
} from '@/bot/helpers'
import { config } from '../config'
import { logger } from '../logger'

import { Bot } from 'grammy'
import middlewares from './middlewares'

const bot = new Bot(config.BOT_TOKEN, {
    ContextConstructor: createContextConstructor({ logger })
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
