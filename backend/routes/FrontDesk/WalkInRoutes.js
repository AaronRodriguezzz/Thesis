const express = require('express');
const router = express.Router();
const WalkInControls = require('../../controller/FrontDesk/WalkinControls');
const { verifyToken } = require('../../middleware/Auth');

router.get('/api/walkIns/:branchId', verifyToken('frontdesk'), WalkInControls.getWalkInByBranch);
router.post('/api/new-walkIn', verifyToken('frontdesk'), WalkInControls.newWalkIn);

module.exports = router;