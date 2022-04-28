const { Router } = require('express');

const { roles } = require('../config/vars');
const userController = require('../controllers/user.controller')();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

router.get('/verify/:token', authenticate, userController.getUser);
router.get('/', authenticate, userController.getUsers);
router.post('/', authenticate, userController.createUser);

module.exports = router;
