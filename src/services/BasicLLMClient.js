import fetch from 'node-fetch';
import { config } from '../config/index.js';

export class BasicLLMClient {
  async respond({ tenantId, chatId, message, history }) {
    const response = await fetch(`${config.basicLlmUrl}/v1/ai/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, chatId, message, history })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Basic LLM service failed: ${text}`);
    }

    return await response.json();
  }
}
