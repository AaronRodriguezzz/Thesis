const express = require('express');
const router = express.Router();
const Auth = require('../../controller/Admin/AdminAuth');

router.post('/api/auth/admin_login', Auth.admin_login);
router.get('/api/auth/check', Auth.checkAuth);

module.exports = router;