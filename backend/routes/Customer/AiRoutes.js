const express = require('express');
const router = express.Router();
const Chatbot = require("../../controller/Customers/AiControls");

router.post("/api/chatbot", Chatbot.chat_bot);
router.post("/api/haircut-suggestion", Chatbot.hairCut_Suggestion);

module.exports = router;