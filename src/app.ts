import fastify from 'fastify'
import { env } from './env'
import cookie from '@fastify/cookie'
import { transactionRoutes } from './route/transaction'

export const app = fastify()

app.register(cookie)
app.register(transactionRoutes, {
  prefix: 'transactions',
})
