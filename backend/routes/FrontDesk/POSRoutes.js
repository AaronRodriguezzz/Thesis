const express = require('express');
const router = express.Router();
const POS = require('../../controller/FrontDesk/POSControls');
const { verifyToken } = require('../../middleware/Auth');

router.put('/api/checkout_product', verifyToken('frontdesk'), POS.checkOutProducts);

module.exports = router;