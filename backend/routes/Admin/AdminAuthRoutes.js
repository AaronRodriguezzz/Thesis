const express = require('express');
const router = express.Router();
const Auth = require('../../controller/Admin/AdminAuth');

router.post('/api/auth/login', Auth.admin_login);
router.post('/api/auth/logout', Auth.admin_logout);
router.get('/api/auth/check', Auth.checkAuth);

module.exports = router;