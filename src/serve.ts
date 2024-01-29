import fastify from 'fastify'
import { knex } from './dataBase'

const app = fastify()

app.get('/hello', async () => {
  const transactions = await knex('transactions')
    .where('amount', 1000)
    .select('*')

  return transactions
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('Server is running')
  })
