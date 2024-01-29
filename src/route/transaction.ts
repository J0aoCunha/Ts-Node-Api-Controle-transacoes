import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../dataBase'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exists'

export const transactionRoutes = async (app: FastifyInstance) => {
  app.get(
    '/',
    {
      preHandler: checkSessionIdExists,
    },
    async (req) => {
      const { sessionId } = req.cookies

      const transaction = await knex('transactions')
        .where('sessionId', sessionId)
        .select('*')

      return { transaction }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: checkSessionIdExists,
    },
    async (req) => {
      const { sessionId } = req.cookies

      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionsParamsSchema.parse(req.params)

      const transaction = await knex('transactions')
        .where({ sessionId, id })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: checkSessionIdExists,
    },
    async (req) => {
      const { sessionId } = req.cookies

      const summary = await knex('transactions')
        .where('sessionId', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      sessionId,
    })

    return res.status(201).send()
  })
}
