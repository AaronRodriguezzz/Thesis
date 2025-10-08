const express = require('express');
const router = express.Router();
const Auth = require('../../controller/Admin/AdminAuth');
const verifyToken = require('../../middleware/Auth');

router.post('/api/auth/admin_login', Auth.admin_login);
router.post('/api/auth/logout', verifyToken, Auth.admin_logout);
router.get('/api/auth/check', Auth.checkAuth);

module.exports = router;