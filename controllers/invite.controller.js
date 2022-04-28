const vars = require('../config/vars');
const strings = require('../config/strings');
const { AppError, NotFoundError, ConflictError, ValidationError } = require('../utils/ApiError');
const userValidation = require('../validation/user.validation');
const userService = require('../services/user.service')();
const errorService = require('../services/error.service')();
const joiService = require('../services/joi.service')();
var generator = require('generate-password');
const { Invite } = require('../models');

const invitationController = () => {
  const name = 'userController';

  const getInvitation = async (req, res, next) => {
    const operation = 'getInvitation';

    try {
      let result = await userService.getAll(req.query || {});
      return res.status(200).send({
        message: strings.userListedSuccess,
        data: result,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const acceptInvitation = async (req, res, next) => {
    const operation = 'createInvitation';

    try {
      const _id = req.params._id;
      const args = req.body;

      const invite = await Invite.findOne({ token: req.params.token });

      if (!invite) {
        throw new NotFoundError({
          message: 'Invitation not found',
          details: ['Invitation not found'],
        });
      }

      if (Date.now() > invite?.dataValues.expiry) {
        throw new ConflictError({
          message: 'Invitation expired',
          details: ['Invitation expired'],
        });
      }

      return res.status(200).send({
        message: strings.userCreateSuccess,
        data: invite,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  return {
    getInvitation,
    acceptInvitation,
  };
};

module.exports = invitationController;
