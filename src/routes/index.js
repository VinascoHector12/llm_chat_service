import express from 'express';
import healthRoutes from './healthRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = express.Router();
const prefix = '/llm';

router.use(`${prefix}/health`, healthRoutes);
router.use(`${prefix}/v1/chat`, chatRoutes);

export default router;
