const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage, fileFilter} = require('../../middleware/ImageUpload');
const upload = multer({storage, fileFilter});
const Branch = require('../../controller/Admin/BranchControls');
const { verifyAdminToken } = require('../../middleware/Auth');

router.get('/api/get_branches', Branch.get_branches);
router.post('/api/new_branch', verifyAdminToken, upload.single("image"), Branch.add_new_branch);
router.put('/api/update_branch', verifyAdminToken, Branch.update_branch);
router.delete('/api/delete_branch/:id', verifyAdminToken, Branch.delete_branch);

module.exports = router;