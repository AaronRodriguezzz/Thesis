const express = require('express');
const router = express.Router();
const Auth = require('../../controller/Customers/Auth');
const { verifyToken } = require('../../middleware/Auth');

router.post('/api/auth/user_login', Auth.user_login);
router.post('/api/auth/google_login', Auth.googleLogin);
router.post('/api/user_registration', Auth.account_registration);
router.get('/api/auth/user_check', Auth.checkAuth);
router.put('/api/auth/update_user', verifyToken, Auth.update_account);
router.put('/api/auth/update_user_password', verifyToken, Auth.updatePassword);
router.post('/api/auth/send_code', verifyToken, Auth.send_code);
router.put('/api/auth/forget_password', verifyToken, Auth.forget_password);

module.exports = router;