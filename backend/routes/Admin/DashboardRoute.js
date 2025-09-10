const express = require('express');
const router = express.Router();
const { cardDataControls, chartsDataControls} = require('../../controller/Admin/DashboardControls');

router.get('/api/card-data/:branchId', cardDataControls);
router.get('/api/card-data', cardDataControls);
router.get('/api/chart-data', chartsDataControls);

module.exports = router;