const express = require('express');
const router = express.Router();
const AssignmentControls = require('../../controller/FrontDesk/AssignmentControls');
const { verifyToken } = require('../../middleware/Auth');

router.put('/api/assign_customer/:type', verifyToken('frontdesk'), AssignmentControls.assignCustomer);
router.put('/api/complete_assignment/:type', verifyToken('frontdesk'), AssignmentControls.completeAssignment);
router.get('/api/initialBarberAssignment/:branchId', AssignmentControls.initializeBarberAssignments);
router.put('/api/updateBarberStatus', verifyToken('frontdesk'), AssignmentControls.updateBarberStatus);

module.exports = router;