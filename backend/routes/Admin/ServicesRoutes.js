const express = require('express');
const router = express.Router();
const Services = require('../../controller/Admin/ServicesControls');

router.post('/api/new_service', Services.new_service);
router.get('/api/services', Services.get_services);
router.put('/api/update_service', Services.update_service);
router.delete('/api/delete_service/:id', Services.delete_service);

module.exports = router;