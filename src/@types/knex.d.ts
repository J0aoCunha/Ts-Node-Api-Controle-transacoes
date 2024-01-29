// eslint-disable-next-line
import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    trasactions: {
      id: string
      title: string
      amount: number
      cretedAt: string
      sessionId?: string
    }
  }
}
