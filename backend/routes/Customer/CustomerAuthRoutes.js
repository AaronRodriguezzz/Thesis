const express = require('express');
const router = express.Router();
const Auth = require('../../controller/Customers/Auth');

router.post('/api/auth/user_login', Auth.user_login);
router.post('/api/auth/user_logout', Auth.user_logout);
router.post('/api/user_registration', Auth.account_registration);
router.get('/api/auth/user_check', Auth.checkAuth);
router.put('/api/auth/update_user', Auth.update_account);
router.put('/api/auth/update_user_password', Auth.updatePassword);

module.exports = router;