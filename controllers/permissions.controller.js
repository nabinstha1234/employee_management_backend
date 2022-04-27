const vars = require('../config/vars');
const strings = require('../config/strings');
const { AppError } = require('../utils/ApiError');
const userValidation = require('../validation/user.validation');
const errorService = require('../services/error.service')();
const joiService = require('../services/joi.service')();

const permissionController = () => {
  const name = 'empliyeeController';

  const getPermissions = async (req, res, next) => {
    const operation = 'getEmployees';

    try {
      const _id = req.user._id;
      let result = [];

      return res.status(200).send({
        message: strings.userListedSuccess,
        data: result,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  return {
    getPermissions,
  };
};

module.exports = permissionController;
