const express = require('express');
const router = express.Router();
const Subscriber = require('../../controller/Customers/SubscribeEmail');

router.post('/api/subscribe', Subscriber.subscribeUser);

module.exports = router;