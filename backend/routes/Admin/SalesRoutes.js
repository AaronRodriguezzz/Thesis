const express = require('express');
const router = express.Router();
const Sales = require('../../controller/Admin/SalesControls');

router.get('/api/sales', Sales.get_sales);

module.exports = router;