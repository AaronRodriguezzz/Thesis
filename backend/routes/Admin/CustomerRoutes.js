const express = require('express');
const router = express.Router();
const Customer = require('../../controller/Admin/CustomerControls');
const { verifyEmployeeToken, verifyToken } = require('../../middleware/Auth');

router.get('/api/get_customers', verifyEmployeeToken, Customer.get_customers);
router.get('/api/get_customer/:email', verifyEmployeeToken, Customer.get_specific_customer);
router.put('/api/update_customer', verifyToken('admin'), Customer.update_customer);
router.put('/api/disable_customer/:id', verifyToken('admin'), Customer.disable_customer);

module.exports = router;