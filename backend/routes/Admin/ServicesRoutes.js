const express = require('express');
const router = express.Router();
const Services = require('../../controller/Admin/ServicesControls');
const { verifyToken } = require('../../middleware/Auth');

router.post('/api/new_service', verifyToken('admin'), Services.new_service);
router.get('/api/services', Services.get_services);
router.put('/api/update_service', verifyToken('admin'), Services.update_service);
router.delete('/api/delete_service/:id', verifyToken('admin'), Services.delete_service);

module.exports = router;