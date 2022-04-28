const { Router } = require('express');

const { roles } = require('../config/vars');
const inviteController = require('../controllers/invite.controller')();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

router.post('/accept/:token', inviteController.acceptInvitation);

module.exports = router;
