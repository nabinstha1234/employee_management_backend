const { ForbiddenError } = require('../utils/ApiError');
const strings = require('../config/strings');
const vars = require('../config/vars');

const logger = require('../utils/winstonLogger')('authorize');
const Helper = require('../utils/premissionCheck');
const { Role, Permission, RolePermission, UserPermission } = require('../models');
const helper = new Helper();
/**
 * ACL
 * @param {Array|string} roles User roles to access resource
 */

module.exports = (permission) => {
  /**
   * @param {Request} req Request object
   * @param {Response} res Response object
   * @param {NextFunction} next Next function
   */
  return async (req, res, next) => {
    const access = await Permission.findOne({
      where: { perm_name: permission },
    });

    const role = await Role.findOne({
      where: { role_name: req.user.role },
    });

    const canAccess = await RolePermission.findOne({
      where: {
        role_id: role.dataValues.id,
        permission_id: access.dataValues.id,
      },
    });

    const canAccessPermission = await UserPermission.findOne({
      where: {
        user_id: req.user._id,
        permission_id: access.dataValues.id,
      },
    });

    if (canAccess || canAccessPermission) {
      return next();
    } else {
      const error = new ForbiddenError({
        message: strings.forbidden,
        details: [strings.userNotAuthorized],
      });
      next(error);
    }
  };
};
