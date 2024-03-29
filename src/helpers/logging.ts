import type { Update } from '@grammyjs/types'
import { Middleware } from 'grammy'
import type { Context } from './context'

export function getUpdateInfo(ctx: Context): Omit<Update, 'update_id'> {
    const { update_id, ...update } = ctx.update

    return update
}

export function logHandle(id: string): Middleware<Context> {
    return (ctx, next) => {
        ctx.logger.info({
            msg: `Handle ${id}`,
            ...(id.startsWith('unhandled')
                ? { update: getUpdateInfo(ctx) }
                : {})
        })

        return next()
    }
}
