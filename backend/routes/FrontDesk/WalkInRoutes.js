const express = require('express');
const router = express.Router();
const WalkInControls = require('../../controller/FrontDesk/WalkinControls');

router.get('/api/walkIns/:branchId', WalkInControls.getWalkInByBranch);
router.post('/api/new-walkIn', WalkInControls.newWalkIn);

module.exports = router;