const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage, fileFilter} = require('../../middleware/ImageUpload');
const upload = multer({storage, fileFilter});
const Product = require('../../controller/Admin/ProductControls');

router.get('/api/products', Product.get_product);
router.get('/api/products/:branch', Product.get_product);
router.post('/api/new_product', upload.single("image"), Product.new_product);
router.put('/api/update_product', upload.single("image"), Product.update_product);
router.put('/api/checkout_product', Product.checkout_Product);
router.delete('/api/delete_product/:id', Product.delete_product);

module.exports = router;