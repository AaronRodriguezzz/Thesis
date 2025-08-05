const express = require('express');
const router = express.Router();
const Chatbot = require("../../controller/Customers/Chatbot");

router.post("/api/chatbot", Chatbot.chat_bot);

module.exports = router;