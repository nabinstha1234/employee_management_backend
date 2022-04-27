const { Router } = require('express');

const permissionController = require('../controllers/permissions.controller')();
const authenticate = require('../middlewares/authenticate');

const router = Router();

router.get('/', authenticate, permissionController.getPermissions);

module.exports = router;
