const express = require('express');
const router = express.Router();
const Getter = require('../../controller/Customers/GetControllers');

router.get('/api/get_data/:category', Getter.get_service)

module.exports = router