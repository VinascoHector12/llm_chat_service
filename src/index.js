import app from './app.js';
import { config } from './config/index.js';

app.listen(config.port, () => {
  console.log(`[llm_chat_service] listening on port ${config.port}`);
});
