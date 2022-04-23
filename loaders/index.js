const corsLoader = require('./cors.loader');
const expressLoader = require('./express.loader');
const dbLoader = require('./db.loader');
require('./event.loader');

module.exports = ({ app }) => {
  dbLoader();
  corsLoader({ app });
  expressLoader({ app });
};
