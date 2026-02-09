const express = require('express');
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/send', messageController.sendMessage);
router.get('/chat/:otherUserId', messageController.getChat);
router.get('/conversations', messageController.getConversations);
router.patch('/read/:otherUserId', messageController.markAsRead);

module.exports = router;
