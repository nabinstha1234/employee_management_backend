const { ForbiddenError } = require('../utils/ApiError');
const strings = require('../config/strings');
const vars = require('../config/vars');

const logger = require('../utils/winstonLogger')('authorize');
const Helper = require('../utils/premissionCheck');

const { Role } = require('../models');

const helper = new Helper();

/**
 * ACL
 * @param {Array|string} roles User roles to access resource
 */
module.exports = (roles) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  /**
   * @param {Request} req Request object
   * @param {Response} res Response object
   * @param {NextFunction} next Next function
   */
  return async (req, res, next) => {
    const role = req.user.role;

    if (req.user.role === vars.roles.admin) {
      next();
    }

    if (roles.length && roles.includes(req.user.role)) {
      next();
    } else {
      const error = new ForbiddenError({
        message: strings.forbidden,
        details: [strings.userNotAuthorized],
      });
      next(error);
    }
  };
};
