const { Router } = require('express');

const companyController = require('../controllers/company.controller')();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

router.get('/:_id', authenticate, authorize(), companyController.getCompany);
router.get('/', authenticate, authorize(), companyController.getCompanies);
router.post('/', authenticate, authorize(), companyController.createCompany);
router.patch('/:_id', authenticate, authorize(), companyController.updateCompany);
router.delete('/:_id', authenticate, authorize(), companyController.deleteComany);

module.exports = router;
