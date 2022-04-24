const vars = require("./vars");

const { host, username, password, database, dialect } = vars.db
const dbConfig={
  development: {
    username,
    password,
    database,
    host,
    dialect
  },
  test: {
    username,
    password,
    database,
    host,
    dialect
  },
  production: {
    username,
    password,
    database,
    host,
    dialect
  }
}

module.exports = dbConfig
