const express = require('express');
const router = express.Router();
const Announcement = require('../../controller/Admin/AnnouncementControls');
const { verifyAdminToken } = require('../../middleware/Auth');

router.post('/api/create-announcement', verifyAdminToken, Announcement.sendAnnouncement);
router.get('/api/active-announcement', Announcement.getActiveAnnouncement);

module.exports = router;