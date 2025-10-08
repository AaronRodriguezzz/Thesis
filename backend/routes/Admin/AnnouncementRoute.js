const express = require('express');
const router = express.Router();
const Announcement = require('../../controller/Admin/AnnouncementControls');

router.post('/api/create-announcement', Announcement.sendAnnouncement);
router.get('/api/active-announcement', Announcement.getActiveAnnouncement);

module.exports = router;