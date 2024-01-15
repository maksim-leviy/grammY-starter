import type { Context } from '@/helpers/context'
import { getUpdateInfo } from '@/helpers/logging'
import { Composer } from 'grammy'
import { performance } from 'node:perf_hooks'

const composer = new Composer<Context>()

composer.use(async (ctx, next) => {
    ctx.api.config.use((previous, method, payload, signal) => {
        ctx.logger.debug({
            msg: 'bot api call',
            method,
            payload
        })
        return previous(method, payload, signal)
    })

    ctx.logger.debug({
        msg: 'update received',
        update: getUpdateInfo(ctx)
    })

    const startTime = performance.now()
    try {
        await next()
    } finally {
        const endTime = performance.now()
        ctx.logger.debug({
            msg: 'update processed',
            duration: endTime - startTime
        })
    }
})

export = composer
