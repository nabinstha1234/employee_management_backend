const { Router } = require('express');

const { roles } = require('../config/vars');
const companyController = require('../controllers/company.controller')();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

router.get('/:_id', authenticate, companyController.getCompany);
router.get('/', authenticate, companyController.getCompanies);
router.post('/', authenticate, companyController.createCompany);
router.put('/:_id', authenticate, companyController.updateCompany);
router.delete('/:_id', authenticate, authorize(roles.admin), companyController.deleteComany);

module.exports = router;
