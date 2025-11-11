const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage, fileFilter} = require('../../middleware/ImageUpload');
const upload = multer({storage, fileFilter});
const Product = require('../../controller/Admin/ProductControls');
const { verifyToken } = require('../../middleware/Auth');

router.get('/api/products', Product.get_product);
router.get('/api/products/:branchId', Product.get_branchProduct);
router.post('/api/new_product', verifyToken('admin'), upload.single("image"), Product.new_product);
router.put('/api/update_product', verifyToken('admin'), upload.single("image"), Product.update_product);
router.delete('/api/delete_product/:id', verifyToken('admin'), Product.delete_product);

module.exports = router;