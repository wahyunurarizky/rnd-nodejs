module.exports = {
  development: {
    username: 'postgres',
    password: '1234',
    database: 'rnd_nodejs',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'postgres',
    password: '1234',
    database: 'rnd_nodejs',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
}
