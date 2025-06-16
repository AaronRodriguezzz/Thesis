const express = require('express');
const router = express.Router();
const Branch = require('../../controller/Admin/BranchControls');

router.post('/api/new_branch', Branch.add_new_branch);
router.put('/api/edit_branch', Branch.update_branch);
router.delete('/api/branch/:id', Branch.delete_branch);

module.exports = router;