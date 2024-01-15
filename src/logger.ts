import { config } from '@/config'
import { pino } from 'pino'

export const logger = pino({
    level: config.LOG_LEVEL,
    transport: {
        targets: [
            ...(config.isDevelopment
                ? [
                      {
                          target: 'pino-pretty',
                          level: config.LOG_LEVEL,
                          options: {
                              ignore: 'pid,hostname',
                              colorize: true,
                              translateTime: true
                          }
                      }
                  ]
                : [
                      {
                          target: 'pino/file',
                          level: config.LOG_LEVEL,
                          options: {}
                      }
                  ])
        ]
    }
})

export type Logger = typeof logger
