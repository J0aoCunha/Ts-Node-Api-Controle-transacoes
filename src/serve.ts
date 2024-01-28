import fastify from 'fastify'
import { knex } from './dataBase'

const app = fastify()

app.get('/', async () => {
  const test = await knex('sqlite_schema').select('*')

  return test
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('Server is running')
  })
