const express = require('express');
const router = express.Router();
const Customer = require('../../controller/Admin/CustomerControls');

router.get('/api/customers', Customer.get_customers);

module.exports = router;