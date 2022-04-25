const { ForbiddenError } = require('../utils/ApiError');
const strings = require('../config/strings');

const logger = require('../utils/winstonLogger')('authorize');
const Helper = require("../utils/premissionCheck");

const {Role} = require("../models")

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
  return (req, res, next) => {
    const role = req.user.role;
    const roleResponse = Role.findOne({
      where:{
        role_id:role
      }
    })
    if (roleResponse && roles.length && roles.includes(req.user.role)) {
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
