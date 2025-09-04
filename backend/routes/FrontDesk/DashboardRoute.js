const express = require('express');
const router = express.Router();
const { cardDataControls, chartsDataControls} = require('../../controller/FrontDesk/DashboardControls');

router.get('/card-data', cardDataControls);
router.get('/chart-data', chartsDataControls);

module.exports = router;