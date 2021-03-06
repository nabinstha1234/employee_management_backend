const { Router } = require('express');

const { roles } = require('../config/vars');
const userController = require('../controllers/user.controller')();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

router.get('/:_id', authenticate, userController.getUser);
router.get('/', authenticate, userController.getUsers);
router.post('/', authenticate, userController.createUser);
router.put('/change-password', authenticate, userController.changePassword);
router.put('/:_id', authenticate, userController.updateUser);
router.delete('/:_id', authenticate, authorize(roles.admin), userController.deleteUser);
router.post('/create', authenticate, userController.createNewUser);

module.exports = router;
