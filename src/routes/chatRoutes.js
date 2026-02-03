import express from 'express';
import { ChatController } from '../controllers/ChatController.js';
import { StreamController } from '../controllers/StreamController.js';
import { StatsController } from '../controllers/StatsController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
const chatController = new ChatController();
const streamController = new StreamController();
const statsController = new StatsController();

router.post('/send', auth, chatController.send);
router.get('/stream/:tenantId/:chatId', auth, streamController.stream);
router.get('/stats', auth, statsController.getStats);

export default router;
