import express from 'express';
import healthRoutes from './healthRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/v1/chat', chatRoutes);

export default router;
