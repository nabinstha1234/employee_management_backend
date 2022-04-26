const { Router } = require('express');

const { roles } = require('../config/vars');
const employeeController = require('../controllers/employee.controller')();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

router.get('/:_id', authenticate, employeeController.getEmployee);
router.get('/', authenticate, employeeController.getEmployees);
router.post('/', authenticate, employeeController.createEmployee);
router.put('/:_id', authenticate, employeeController.updateEmployee);
router.delete('/:_id', authenticate, employeeController.deleteEmployee);

module.exports = router;
