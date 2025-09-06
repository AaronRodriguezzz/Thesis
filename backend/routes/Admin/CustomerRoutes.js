const express = require('express');
const router = express.Router();
const Customer = require('../../controller/Admin/CustomerControls');

router.get('/api/get_customers', Customer.get_customers);
router.get('/api/get_customer/:email', Customer.get_specific_customer);
router.put('/api/update_customer', Customer.update_customer);
router.put('/api/disable_customer/:id', Customer.disable_customer);

module.exports = router;