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
})
