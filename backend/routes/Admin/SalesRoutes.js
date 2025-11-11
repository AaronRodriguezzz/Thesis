const express = require('express');
const router = express.Router();
const Sales = require('../../controller/Admin/SalesControls');
const { verifyEmployeeToken } = require('../../middleware/Auth');

router.get('/api/sales/products', verifyEmployeeToken, Sales.productSales);
router.get('/api/sales/product/:productId', verifyEmployeeToken, Sales.productSale);
router.get('/api/sales/services', verifyEmployeeToken, Sales.serviceSales);

module.exports = router;