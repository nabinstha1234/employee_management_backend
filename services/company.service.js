const merge = require('lodash/merge');

const vars = require('../config/vars');
const strings = require('../config/strings');
const paging = require('../utils/paging');
const { NotFoundError, ValidationError } = require('../utils/ApiError');
const companyRepository = require('../repository/company.repository')();
const errorService = require('../services/error.service')();
const logger = require('../utils/winstonLogger')('userService');

const companyService = () => {
  const name = 'companyService';

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
      let { rows, count } = await companyRepository.getAllAndCount(pagingArgs);

      const pagingMeta = paging.getPagingResult(pagingArgs, { total: count });

      logger.info({ operation, message: 'Get all users', data: args });

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
    console.log(args,"i am args");
    try {
      const _id = args?._id;
      let user = await companyRepository.getById({ _id });
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
   * @param {string} args.name
   * @param {string} args.name_kana
   * @param {string} args.email
   * @param {string} args.phone
   * @param {string} args.zip_code
   * @param {string} args.url_of_hp
   * @param {string} args.date_of_establishment
   * @param {string} args.remarks
   * @param {string} args.address
   * 
   * @returns {Promise<User>}
   */
  const create = async (args) => {
    const operation = 'create';
    const email = args.email;
    const name = args.name;
    const name_kana = args.name_kana;
    const zip_code = args.zip_code;
    const phone = args.phone;
    const url_of_hp = args.url_of_hp;
    const address = args.address;
    const date_of_establishment = args.date_of_establishment;
    const remarks = args.remarks;

    try {
      const user = await companyRepository.create({
        email,
        name,
        name_kana,
        zip_code,
        phone,
        address,
        url_of_hp,
        date_of_establishment,
        remarks,
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
    const email = args?.email;
      const name = args?.name;
      const zip_code = args?.zip_code;
      const name_kana = args?.name_kana;
      const phone = args?.phone;
      const url_of_hp = args?.url_of_hp;
      const date_of_establishment = args?.url_of_establishment;
      const remarks = args?.remarks;
      const address = args?.address;

    try {
      let updated = await companyRepository.update({
        _id,
        email,
        name,
        name_kana,
        zip_code,
        phone,
        url_of_hp,
        date_of_establishment,
        remarks,
        address
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

      let deletedUser = await companyRepository.deleteById({ _id });

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

  

  return {
    getAll,
    getById,
    create,
    update,
    deleteById,
  };
};

module.exports = companyService;
