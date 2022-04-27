const merge = require('lodash/merge');

const vars = require('../config/vars');
const strings = require('../config/strings');
const paging = require('../utils/paging');
const { NotFoundError, ValidationError } = require('../utils/ApiError');
const employeeRepository = require('../repository/employee.repository')();
const errorService = require('../services/error.service')();
const hashService = require('../services/bcrypt.service')();
const logger = require('../utils/winstonLogger')('userService');

const employeeService = () => {
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
  const getAll = async (args = {}, user) => {
    const operation = 'getAll';
    const pagingArgs = paging.getPagingArgs(args);

    try {
      let { rows, count } = await employeeRepository.getAllAndCount(pagingArgs, user);

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
      let employee = await employeeRepository.getById({ _id });
      return employee;
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
      const user = await employeeRepository.create({
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
      let updated = await employeeRepository.update({
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

      let deletedEmployee = await employeeRepository.deleteById({ _id });

      return deletedEmployee;
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
  };
};

module.exports = employeeService;
