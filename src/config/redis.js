import Redis from 'ioredis';
import { config } from './index.js';

export const redisPub = new Redis(config.redisUrl);
