import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import Request from 'supertest'
import { app } from '../src/app'

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('pnpm run knex migrate:rollback --all')
    execSync('pnpm run knex migrate:latest')
  })

  it('user can create a new transactions ', async () => {
    await Request(app.server)
      .post('/transactions')
      .send({
        title: 'teste',
        amount: 9000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await Request(app.server)
      .post('/transactions')
      .send({
        title: 'teste',
        amount: 9000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await Request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transaction).toEqual([
      expect.objectContaining({
        title: 'teste',
        amount: 9000,
      }),
    ])
  })

  it('should be able to get a specific transactions', async () => {
    const createTransactionResponse = await Request(app.server)
      .post('/transactions')
      .send({
        title: 'teste',
        amount: 9000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await Request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transaction[0].id

    const getTransactionResponse = await Request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'teste',
        amount: 9000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await Request(app.server)
      .post('/transactions')
      .send({
        title: 'teste',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await Request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'teste 2',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await Request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
