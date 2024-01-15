import { Context } from '@/bot/helpers'
import { config } from '@/config'
import { logger } from '@/logger'
import fastify from 'fastify'
import { Bot, webhookCallback } from 'grammy'

export const createServer = async (bot: Bot<Context>) => {
    const server = fastify({
        logger
    })

    server.setErrorHandler(async (error, request, response) => {
        logger.error(error)

        await response
            .status(500)
            .send({ error: 'Oops! Something went wrong.' })
    })

    server.get('/', () => ({ status: true }))

    server.post(`/${config.BOT_TOKEN}`, webhookCallback(bot, 'fastify'))

    if (config.BOT_MODE === 'webhook')
        await server.listen({
            host: config.BOT_HOST,
            port: config.BOT_PORT
        })

    return server
}
