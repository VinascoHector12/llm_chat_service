import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  basicLlmUrl: process.env.BASIC_LLM_URL || 'http://basic-chat-llm-service:3002/chat',
  redisUrl: process.env.REDIS_URL || 'redis://redis:6379',
  
  database: {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'chat_db'
  },
  
  chat: {
    historyLimit: 12
  }
};
