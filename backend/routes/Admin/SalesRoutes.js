const express = require('express');
const router = express.Router();
const Sales = require('../../controller/Admin/SalesControls');

router.get('/api/sales/products',  Sales.productSales);
router.get('/api/sales/product/:productId', Sales.productSale);
router.get('/api/sales/services', Sales.serviceSales);

module.exports = router;