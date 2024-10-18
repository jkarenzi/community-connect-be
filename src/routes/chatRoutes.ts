import express from 'express';
import { sendMessage, getChatMessages } from '../controllers/chatController';
import { authenticateToken } from '../middleware/authenticate';

const router = express.Router();

router.post('/send', authenticateToken, sendMessage);
router.get('/:serviceId', authenticateToken, getChatMessages);

export default router;
