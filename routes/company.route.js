const { Router } = require('express');

const vars = require('../config/vars');

const {
  permissions: { employee, company, user },
} = vars;

const companyController = require('../controllers/company.controller')();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

router.get('/:_id', authenticate, authorize(company.CAN_VIEW_COMPANY), companyController.getCompany);
router.get('/', authenticate, authorize(company.CAN_VIEW_COMPANY), companyController.getCompanies);
router.post('/', authenticate, authorize(company.CAN_CREATE_COMPANY), companyController.createCompany);
router.patch('/:_id', authenticate, authorize(company.CAN_UPDATE_COMPANY), companyController.updateCompany);
router.delete('/:_id', authenticate, authorize(company.CAN_DELETE_COMPANY), companyController.deleteComany);

module.exports = router;
