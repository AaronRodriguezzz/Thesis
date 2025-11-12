const express = require('express');
const router = express.Router();
const { cardDataControls, chartsDataControls} = require('../../controller/Admin/DashboardControls');
const { verifyEmployeeToken } = require('../../middleware/Auth');

router.get('/api/card-data/:branchId', verifyEmployeeToken, cardDataControls);
router.get('/api/card-data', verifyEmployeeToken, cardDataControls);
router.get('/api/chart-data/:branchId', verifyEmployeeToken, chartsDataControls);
router.get('/api/chart-data', verifyEmployeeToken, chartsDataControls);

module.exports = router;