import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './dataBase/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './dataBase/migrations',
  },
}

export const knex = setupKnex(config)
