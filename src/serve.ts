import fastify from 'fastify'
import { env } from './env'
import { transactionRoutes } from './route/transaction'

const app = fastify()

app.register(transactionRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running')
  })
