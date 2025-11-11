const express = require('express');
const router = express.Router();
const Announcement = require('../../controller/Admin/AnnouncementControls');
const { verifyToken } = require('../../middleware/Auth');

router.post('/api/create-announcement', verifyToken('admin'), Announcement.sendAnnouncement);
router.get('/api/active-announcement', Announcement.getActiveAnnouncement);

module.exports = router;