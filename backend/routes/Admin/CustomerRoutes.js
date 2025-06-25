const express = require('express');
const router = express.Router();
const Customer = require('../../controller/Admin/CustomerControls');

router.get('/api/get_customers', Customer.get_customers);
router.put('/api/update_customer', Customer.update_customer);
router.delete('/api/delete_customer/:id', Customer.delete_customer);

module.exports = router;