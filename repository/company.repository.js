const { isBoolean, merge, isArray, isString, isNil, isEmpty, get, omit } = require('lodash');

const paging = require('../utils/paging');
const vars = require('../config/vars');
const strings = require('../config/strings');
const { Company } = require('../models');
const { roles } = require('../config/vars');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/ApiError');
const hashService = require('../services/bcrypt.service')();
const errorService = require('../services/error.service')();

const companyRepository = () => {
  const name = 'companyRepository';

  /**
   * Get all documents
   * @param {Object} args
   * @param {Object} args.query
   * @param {number} args.skip
   * @param {number} args.limit
   * @param {string} args.sort
   * @returns {Promise<{ count: number, rows: User[] }>}
   */
  const getAllAndCount = async (args = {}) => {
    const operation = 'getAllAndCount';

    const { skip, limit, sort, query } = args;

    try {
      const data = await Company.findOne(query);

      const total = await Company.count();

      return {
        count: total,
        rows: data,
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
   * Get user by id
   * @param {Object} args
   * @param {number} args._id
   * @returns {Promise<Company|null>}
   */
  const getById = async (args = {}) => {
    const operation = 'getById';

    const _id = args?._id;

    try {
      const errors = [];
      if (isNil(_id)) {
        errors.push(strings.idRequired);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      return Company.findByPk(args?._id);
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
   * Get all documents
   * @param {any} args
   * @returns {Promise<Company[]>}
   */
  const getAll = async (args) => {
    const operation = 'getAll';
    return Company.find(args).catch((err) => {
      errorService.throwError({
        err,
        operation,
        name,
        logError: false,
      });
    });
  };

  /**
   * Find single user
   * @param {Object} args - The args object
   * @param {boolean=} args.selectPassword
   * @returns {Company | null}
   */
  const findOne = async (args) => {
    const operation = 'findOne';

    try {
      const selectPassword = args?.selectPassword;
      const _args = omit(args, ['selectPassword']);
      let user;
      if (args?.selectPassword) {
        user = await Company.findOne({
          where:{
            email: args?.email,
          }
        })
      } else {
        user = await Company.findOne(_args);
      }

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
   * Create new user
   * @param {Object} args
   * @param {string=} args.username
   * @param {string} args.email
   * @param {string} args.firstName
   * @param {string} args.lastName
   * @param {string} args.password
   * @param {string=} args.role
   * @returns {Promise<Company>}
   */
  const create = async (user) => {
    const operation = 'create';
    try {
      const email = user?.email;
      const name = user?.name;
      const zip_code = user?.zip_code;
      const name_kana = user?.name_kana;
      const phone = user?.phone;
      const url_of_hp = user?.url_of_hp;
      const date_of_establishment = user?.url_of_establishment;
      const remarks = user?.remarks;
      const address = user?.address;

      const errors = [];
      if (isNil(email) || !isString(email)) {
        errors.push(strings.emailRequired);
      }

      if (isNil(name) || !isString(name)) {
        errors.push(strings.companyNameRequired);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      let foundCompany = await Company.findOne({where: {email} });

      if (foundCompany) {
        throw new ConflictError({
          message: strings.companyEmailExists,
          details: [strings.companyEmailExists],
          data: { email },
        });
      }

    //   if (username) {
    //     let foundUser = await Company.findOne({ username });
    //     if (foundUser) {
    //       throw new ConflictError({
    //         message: strings.userExists,
    //         details: [strings.userExists],
    //         data: { email },
    //       });
    //     }
    //   } else {
    //     username = email.split('@')?.[0];
    //   }

      const entity = await Company.create({
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

      return entity;
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
   * Update user
   * @param {Object} args
   * @param {string=} args.firstName
   * @param {string=} args.lastName
   * @param {string=} args.password
   * @param {string=} args.isEmailVerified
   * @returns {Promise<Company|null>}
   */
  const update = async (args) => {
    const operation = 'update';
    try {
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

      const errors = [];
      if (isNil(_id) || !isString(_id)) {
        errors.push(strings.idRequired);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      const foundCompany = await Company.findOne({where:{
           id:_id 
        }});

      if (!foundCompany) {
        throw new NotFoundError({
          message: strings.userNotFound,
          details: [strings.userNotFound],
          data: { _id },
        });
      }
  
      let data = merge(foundCompany.dataValues, {
        email,
        name,
        name_kana,
        zip_code,
        phone,
        url_of_hp,
        address,
        date_of_establishment,
        remarks,
      });

      const entity = await Company.update({ ...data},{
        where:{
            id:_id
        }
      });

      return entity;
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
   * Delete user
   * @param {Object} args
   * @param {string} args._id
   * @returns {Promise<Company|null>}
   */
  const deleteById = (args = {}) => {
    const operation = 'deleteById';
    try {
      const _id = args?._id;

      const errors = [];

      if (isNil(_id) || !isString(_id)) {
        errors.push(strings.idRequired);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      return  Company.destroy({
        where:{id: _id }});
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
    getAllAndCount,
    getById,
    getAll,
    findOne,
    create,
    update,
    deleteById,
  };
};

module.exports = companyRepository;
