const express = require('express');
const router = express.Router();
const AssignmentControls = require('../../controller/FrontDesk/AssignmentControls');

router.put('/api/assign_customer/:type', AssignmentControls.assignCustomer);
router.put('/api/complete_assignment/:type', AssignmentControls.completeAssignment);

module.exports = router;