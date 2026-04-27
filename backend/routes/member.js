const express = require('express');
const router = express.Router();

const memberCtrl = require('../controllers/member');

router.post('/signup', memberCtrl.signup);
router.post('/login', memberCtrl.login);

module.exports = router;