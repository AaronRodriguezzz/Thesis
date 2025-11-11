const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage, fileFilter} = require('../../middleware/ImageUpload');
const upload = multer({storage, fileFilter});
const Branch = require('../../controller/Admin/BranchControls');
const { verifyToken } = require('../../middleware/Auth');

router.get('/api/get_branches', Branch.get_branches);
router.post('/api/new_branch', verifyToken('admin'), upload.single("image"), Branch.add_new_branch);
router.put('/api/update_branch', verifyToken('admin'), Branch.update_branch);
router.delete('/api/delete_branch/:id', verifyToken('admin'), Branch.delete_branch);

module.exports = router;