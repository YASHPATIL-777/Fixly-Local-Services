import express from 'express';
import { getMessages, getUserConversations, markMessagesAsRead } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected chat endpoints
router.get('/conversations', protect, getUserConversations);
router.get('/:requestId/messages', protect, getMessages);
router.patch('/:requestId/read', protect, markMessagesAsRead);

export default router;
