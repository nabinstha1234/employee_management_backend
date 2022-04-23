const db = require("../models");
const logger = require('../utils/winstonLogger')('mongooseLoader');

module.exports = () => {
  db.sequelize.sync({ force: true }).then(() => {
    logger.info({
      operation: 'mongooseConnection',
      message: 'Database connected',
    });
  }).catch(err => {
    logger.info({
      operation: 'postgresConnection',
      message: 'Error Connecting to the database',
      data: err,
    });
  })
};
