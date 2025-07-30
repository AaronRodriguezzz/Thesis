const express = require('express');
const router = express.Router();
const POS = require('../../controller/FrontDesk/POSControls');

router.put('/api/checkout_product', POS.checkOutProducts);

module.exports = router;