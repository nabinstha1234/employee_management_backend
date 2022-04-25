const vars = require('../config/vars');
const strings = require('../config/strings');
const { AppError } = require('../utils/ApiError');
const userValidation = require('../validation/user.validation');
const companyService = require('../services/company.service')();
const errorService = require('../services/error.service')();
const joiService = require('../services/joi.service')();

const companyController = () => {
  const name = 'userController';

  const getCompanies = async (req, res, next) => {
    const operation = 'getCompanies';

    try {
      let result = await companyService.getAll(req.query || {});

      return res.status(200).send({
        message: strings.userListedSuccess,
        data: result,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const getCompany = async (req, res, next) => {
    const operation = 'getCompany';

    try {
      const _id = req.params._id;

      let user = await companyService.getById({ _id });
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

  const createCompany = async (req, res, next) => {
    const operation = 'createCompany';

    try {
      const _id = req.params._id;
      const args = req.body;

      const name = args?.name;
      const name_kana = args?.name_kana;
      const zip_code = args?.zip_code;
      const phone = args?.phone;
      const address = args?.address;
      const email = args?.email;
      const url_of_hp= args?.url_of_hp;
      const date_of_establishment= args?.date_of_establishment;
      const remarks= args?.remarks;


    //   const schema = userValidation.create;
    //   await joiService.validate({
    //     schema,
    //     input: {
    //       email,
    //       name,
    //       name_kana,
    //       zip_code,
    //       phone,
    //       url_of_hp,
    //       date_of_establishment,
    //       remarks,
    //     },
    //   });

      let user = await companyService.create({
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

      return res.status(200).send({
        message: strings.userCreateSuccess,
        data: user,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const updateCompany = async (req, res, next) => {
    const operation = 'updateComapny';

    try {
      const _id = req.params._id;
      const args = req.body;

      const email = args?.email;
      const name = args?.name;
      const zip_code = args?.zip_code;
      const name_kana = args?.name_kana;
      const phone = args?.phone;
      const url_of_hp = args?.url_of_hp;
      const date_of_establishment = args?.url_of_establishment;
      const remarks = args?.remarks;
      const address = args?.address;


    //   const schema = userValidation.update;
    //   await joiService.validate({
    //     schema,
    //     input: {
    //       firstName,
    //       lastName,
    //     },
    //   });

      let user = await companyService.update({
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

      return res.status(200).send({
        message: strings.userUpdateSuccess,
        data: user,
      });
    } catch (err) {
      const error = errorService.getError({ err, name, operation, logError: true });
      next(error);
    }
  };

  const deleteComany = async (req, res, next) => {
    const operation = 'deleteCompany';

    try {
      const _id = req.params._id;
      
      const user = await companyService.deleteById({ _id });
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
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteComany,
  };
};

module.exports = companyController;
