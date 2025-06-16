const express = require('express');
const router = express.Router();
const Product = require('../../controller/Admin/ProductControls');

router.get('/api/product', Product.get_product);
router.post('/api/new_product', Product.new_product);
router.put('/api/update_product', Product.update_product);
router.delete('/api/delete_product/:id', Product.delete_product);

module.exports = router;