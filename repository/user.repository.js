const { isBoolean, merge, isArray, isString, isNil, isEmpty, get, omit } = require('lodash');

const paging = require('../utils/paging');
const vars = require('../config/vars');
const strings = require('../config/strings');
const { User, Role, UserRole, Company, Invite } = require('../models');
const { roles } = require('../config/vars');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/ApiError');
const hashService = require('../services/bcrypt.service')();
const errorService = require('../services/error.service')();
const sgMail = require('@sendgrid/mail');
const { response } = require('express');

const userRepository = () => {
  const name = 'userRepository';

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
      const data = await User.findAll(query);

      const total = await User.count();

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
   * @returns {Promise<User|null>}
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

      const user = await User.findByPk(args?._id);
      const role = await UserRole.findOne({ where: { user_id: user?.dataValues?.id } });
      const roleValue = await Role.findOne({ where: { id: role?.dataValues?.role_id } });
      return {
        ...user?.dataValues,
        role: {
          ...roleValue?.dataValues,
        },
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
   * Get all documents
   * @param {any} args
   * @returns {Promise<User[]>}
   */
  const getAll = async (args) => {
    const operation = 'getAll';
    return User.find(args).catch((err) => {
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
   * @returns {User | null}
   */
  const findOne = async (args) => {
    const operation = 'findOne';
    try {
      const selectPassword = args?.selectPassword;
      const _args = omit(args, ['selectPassword']);

      let user;
      if (args?.selectPassword) {
        user = await User.findOne({
          where: {
            email: args?.email,
          },
        });
      } else {
        user = await User.findOne(_args);
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
   * @returns {Promise<User>}
   */
  const create = async (user) => {
    const operation = 'create';
    try {
      let username = user?.username;
      const email = user?.email;
      const firstName = user?.firstName;
      const lastName = user?.lastName;
      const password = user?.password;
      const role = user?.role ?? roles.user;
      const isEmailVerified = false;

      const errors = [];
      if (isNil(email) || !isString(email)) {
        errors.push(strings.emailRequired);
      }

      if (isNil(firstName) || !isString(firstName)) {
        errors.push(strings.firstNameValidation);
      }

      if (isNil(password) || !isString(password)) {
        errors.push(strings.passwordValidation);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      let foundUser = await User.findOne({ email });

      if (foundUser) {
        throw new ConflictError({
          message: strings.userExists,
          details: [strings.userExists],
          data: { email },
        });
      }

      if (username) {
        let foundUser = await User.findOne({ username });
        if (foundUser) {
          throw new ConflictError({
            message: strings.userExists,
            details: [strings.userExists],
            data: { email },
          });
        }
      } else {
        username = email.split('@')?.[0];
      }

      const newUser = new User({
        email,
        password,
        username,
        firstName,
        lastName,
        role,
      });

      const entity = await newUser.save();
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
   * @returns {Promise<User|null>}
   */
  const update = async (args) => {
    const operation = 'update';
    try {
      const _id = args?._id;
      const firstName = args?.firstName;
      const lastName = args?.lastName;
      const isEmailVerified = args?.isEmailVerified;
      let password = args?.password;

      const errors = [];
      if (isNil(_id) || !isString(_id)) {
        errors.push(strings.idRequired);
      }

      if (!isNil(firstName) && !isString(firstName)) {
        errors.push(strings.firstNameValidation);
      }

      if (!isNil(isEmailVerified) && !isBoolean(isEmailVerified)) {
        errors.push(strings.emailVerifiedInputValidation);
      }

      if (!isNil(lastName) && !isString(lastName)) {
        errors.push(strings.lastNameValidation);
      }

      if (!isNil(password) && !isString(password) && isEmpty(password)) {
        errors.push(strings.passwordValidation);
      }

      if (password) {
        password = await hashService.hash(password, vars.saltRounds);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      const foundUser = await User.findOne({ _id });

      if (!foundUser) {
        throw new NotFoundError({
          message: strings.userNotFound,
          details: [strings.userNotFound],
          data: { _id },
        });
      }

      let data = merge(foundUser, {
        firstName,
        lastName,
        isEmailVerified,
        password,
      });

      const entity = await User.findOneAndUpdate({ _id }, data, { new: true }).exec();

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
   * @returns {Promise<User|null>}
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

      return User.findOneAndRemove({ _id }).exec();
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
   * @returns {Promise<User>}
   */
  const createNewUser = async (args) => {
    const operation = 'createNewUser';
    try {
      const email = args?.email;
      const password = args?.password;
      const name = args?.name;
      const role = args?.role;
      const company = Number(args?.company);

      const errors = [];
      if (isNil(email) || !isString(email)) {
        errors.push(strings.emailRequired);
      }

      if (isNil(name) || !isString(name)) {
        errors.push('Name is required');
      }

      if (isNil(role) || !isString(role)) {
        errors.push('Role is required');
      }

      if (isNil(company)) {
        errors.push('Company is required');
      }

      if (isNil(password) || !isString(password)) {
        errors.push(strings.passwordValidation);
      }

      if (errors.length) {
        throw new ValidationError({
          message: strings.validationError,
          details: errors,
        });
      }

      let foundUser = await User.findOne({ where: { email } });

      if (foundUser) {
        throw new ConflictError({
          message: strings.userExists,
          details: [strings.userExists],
          data: { email },
        });
      }

      const userRole = await Role.findOne({ where: { role_name: role } });

      if (!userRole) {
        throw new NotFoundError({
          message: 'User role is not found',
          details: ['User role is not found'],
          data: { email },
        });
      }

      const companyDetails = await Company.findOne({ where: { id: company } });

      if (!companyDetails) {
        throw new NotFoundError({
          message: 'Company is not found',
          details: ['Company is not found'],
          data: { email },
        });
      }

      const userDetails = await User.create({
        email,
        password,
        name,
        status: 'inactive',
        role_id: Number(userRole.dataValues.id),
      });

      let invite = await Invite.findOne({
        where: {
          email: email,
        },
      });

      if (invite) {
        throw new ConflictError({
          message: 'Invite already sent',
          details: ['Invite already sent'],
          data: { email },
        });
      }

      const newInvite = await Invite.create({
        email: email,
        user_id: userDetails.dataValues.id,
        temp_password: password,
      });

      await sgMail.setApiKey(vars.sendGridToken);

      const maessage = {
        to: email,
        from: vars.mailSender,
        subject: 'Your account has been created',
        text: `Confirm your invite using the link ${vars.originUrl}/invite/verify/${newInvite.dataValues.token}`,
        html: `<div>
                <p>Email: ${email}</p>
                <p>Password: ${password}</p>
                <p>Confirm your invite using the link
                  <a href="${vars.originUrl}/invite/verify/${newInvite.dataValues.token}" target="_blank">
                    ${vars.originUrl}/invite/verify/${newInvite.dataValues.token}
                  </a>
                </p>
              </div>`,
      };

      sgMail.send(maessage).then((response) => {
        console.log(response);
      });

      delete userDetails.password;
      return userDetails;
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
    createNewUser,
  };
};

module.exports = userRepository;
