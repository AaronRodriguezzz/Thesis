const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage, fileFilter} = require('../../middleware/ImageUpload');
const upload = multer({storage, fileFilter});
const Product = require('../../controller/Admin/ProductControls');
const { verifyAdminToken } = require('../../middleware/Auth');

router.get('/api/products', Product.get_product);
router.get('/api/products/:branchId', Product.get_branchProduct);
router.post('/api/new_product', verifyAdminToken, upload.single("image"), Product.new_product);
router.put('/api/update_product', verifyAdminToken, upload.single("image"), Product.update_product);
router.delete('/api/delete_product/:id', verifyAdminToken, Product.delete_product);

module.exports = router;