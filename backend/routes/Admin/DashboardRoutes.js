const express = require('express');
const router = express.Router();
const DashboardControls = require('../../controller/Admin/DashboardControls');

router.get('/api/card-data', DashboardControls.dashboardCardsData);
router.get('/api/graph-data', DashboardControls.graphData);

module.exports = router;