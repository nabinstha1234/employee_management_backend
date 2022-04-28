const merge = require('lodash/merge');

const vars = require('../config/vars');
const strings = require('../config/strings');
const paging = require('../utils/paging');
const { NotFoundError, ValidationError } = require('../utils/ApiError');
const userRepository = require('../repository/user.repository')();
const errorService = require('../services/error.service')();
const hashService = require('../services/bcrypt.service')();
const logger = require('../utils/winstonLogger')('userService');
const { User } = require('../models');

const userService = () => {
  const name = 'userService';

  /**
   * Get all users
   * @param {Object} args
   * @param {Object} args.query
   * @param {number} args.skip
   * @param {number} args.limit
   * @param {string} args.sort
   * @returns {Promise<{ paging: Object, results: User[] }>}
   */
  const getAll = async (args = {}) => {
    const operation = 'getAll';
    const pagingArgs = paging.getPagingArgs(args);

    try {
      let { rows, count } = await userRepository.getAllAndCount(pagingArgs);

      const pagingMeta = paging.getPagingResult(pagingArgs, { total: count });

      logger.info({ operation, message: 'Get all employee', data: args });

      return {
        paging: pagingMeta,
        results: rows,
      };
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Get by id
   * @param {Object} args
   * @param {string} args._id
   * @returns {Promise<User|null>}
   */
  const getById = async (args = {}) => {
    const operation = 'getById';
    try {
      const _id = args?._id;
      let user = await userRepository.getById({ _id });
      return user;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Create
   * @param {Object} args
   * @param {string} args.firstName
   * @param {string} args.lastName
   * @param {string} args.email
   * @param {string} args.username
   * @param {string} args.password
   * @param {string} args.role
   * @returns {Promise<User>}
   */
  const create = async (args) => {
    const operation = 'create';
    const email = args.email;
    const username = args.username;
    const firstName = args.firstName;
    const lastName = args.lastName;
    const password = args.password;
    const role = args.role;

    try {
      const user = await userRepository.create({
        email,
        username,
        firstName,
        lastName,
        password,
        role,
      });

      return user;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Update
   * @param {Object} args
   * @param {string} args.firstName
   * @param {string} args.lastName
   * @param {string} args.password
   * @param {boolean} args.isEmailVerified
   * @returns {Promise<User>}
   */
  const update = async (args = {}) => {
    const operation = 'update';
    const _id = args?._id;
    const firstName = args?.firstName;
    const lastName = args?.lastName;
    const isEmailVerified = args?.isEmailVerified;

    try {
      let updated = await userRepository.update({
        _id,
        firstName,
        lastName,
        isEmailVerified,
      });

      return updated;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Delete by id
   * @param {Object} args
   * @param {string} args._id
   * @returns {Promise<User|null>}
   */
  const deleteById = async (args = {}) => {
    const operation = 'delete';
    try {
      const _id = args?._id;

      let deletedUser = await userRepository.deleteById({ _id });

      return deletedUser;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Change password
   * @param {Object} args
   * @param {string} args.oldPassword
   * @param {string} args.password - new password
   * @returns {Promise<boolean>}
   */
  const changePassword = async (args) => {
    const operation = 'changePassword';
    const _id = args?._id;
    const oldPassword = args?.oldPassword;
    const password = args?.password;

    try {
      const user = await User.findOne({
        where: {
          id: _id,
        },
      });

      if (!user) {
        throw new ValidationError({
          message: strings.validationError,
          details: [strings.badCredentials],
          data: { _id },
        });
      }

      const isPasswordCorrect = await hashService.compare(oldPassword, user.password);
      if (!isPasswordCorrect) {
        throw new ValidationError({
          message: strings.validationError,
          details: [strings.passwordNotMatch],
          data: { _id },
        });
      }

      const hashedPassword = await hashService.hash(password);

      await User.update(
        { password: hashedPassword, status: 'active', emp_id: Math.floor(Math.random() * 10000) },
        { where: { id: _id } }
      );

      return true;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  /**
   * Create
   * @param {Object} args
   * @param {string} args.firstName
   * @param {string} args.lastName
   * @param {string} args.email
   * @param {string} args.username
   * @param {string} args.password
   * @param {string} args.role
   * @returns {Promise<User>}
   */
  const createNewUser = async (args) => {
    const operation = 'createNewUser';
    const email = args?.email;
    const password = args?.password;
    const name = args?.name;
    const role = args?.role;
    const company = args?.company;

    try {
      const user = await userRepository.createNewUser({
        email,
        name,
        company,
        password,
        role,
      });

      return user;
    } catch (err) {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    }
  };

  return {
    getAll,
    getById,
    create,
    update,
    deleteById,
    changePassword,
    createNewUser,
  };
};

module.exports = userService;
