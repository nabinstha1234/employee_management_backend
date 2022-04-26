const vars = require('../config/vars');
const strings = require('../config/strings');
const { AppError } = require('../utils/ApiError');
const userValidation = require('../validation/user.validation');
const employeeService = require('../services/employee.service')();
const errorService = require('../services/error.service')();
const joiService = require('../services/joi.service')();

const employeeController = () => {
  const name = 'empliyeeController';

  const getEmployees = async (req, res, next) => {
    const operation = 'getEmployees';

    try {
      let result = await employeeService.getAll(req.query || {});

      return res.status(200).send({
        message: strings.userListedSuccess,
        data: result,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const getEmployee = async (req, res, next) => {
    const operation = 'getEmployee';

    try {
      const _id = req.params._id;

      if (_id !== req?.user?._id && req?.user?.role !== vars.roles.admin) {
        return res.status(403).send({
          message: strings.forbidden,
          data: { _id },
        });
      }

      let user = await employeeService.getById({ _id });
      if (!user) {
        return res.status(404).send({
          message: strings.userNotFound,
          data: {},
        });
      }

      return res.status(200).send({
        message: strings.userListedSuccess,
        data: user,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const createEmployee = async (req, res, next) => {
    const operation = 'createEmployee';

    try {
      const _id = req.params._id;
      const args = req.body;

      const email = args?.email;
      const password = args?.password;
      const firstName = args?.firstName;
      const lastName = args?.lastName;
      const role = args?.role;

      const schema = userValidation.create;
      await joiService.validate({
        schema,
        input: {
          email,
          password,
          firstName,
          lastName,
          role,
        },
      });

      let user = await employeeService.create({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      return res.status(200).send({
        message: strings.userCreateSuccess,
        data: user,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const updateEmployee = async (req, res, next) => {
    const operation = 'updateEmployee';

    try {
      const _id = req.params._id;
      const args = req.body;

      const firstName = args?.firstName;
      const lastName = args?.lastName;
      if (_id !== req?.user?._id && req?.user?.role !== vars.roles.admin) {
        return res.status(403).send({
          message: strings.forbidden,
          data: { _id },
        });
      }

      const schema = userValidation.update;
      await joiService.validate({
        schema,
        input: {
          firstName,
          lastName,
        },
      });

      let user = await employeeService.update({
        _id,
        firstName,
        lastName,
      });

      return res.status(200).send({
        message: strings.userUpdateSuccess,
        data: user,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const deleteEmployee = async (req, res, next) => {
    const operation = 'deleteEmployee';

    try {
      const _id = req.params._id;
      const data = req.body;

      if (_id === req?.user?._id) {
        return res.status(403).send({
          message: strings.cannotDeleteOwnAccount,
          data: {
            _id,
          },
        });
      }

      const user = await employeeService.deleteById({ _id });
      if (!user) {
        return res.status(404).send({
          message: strings.userNotFound,
          data: user,
        });
      }

      return res.status(200).send({
        message: strings.userDeleteSuccess,
        data: user,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  return {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};

module.exports = employeeController;
