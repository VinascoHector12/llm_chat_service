import { ChatRepository } from '../repositories/ChatRepository.js';
import { MessageRepository } from '../repositories/MessageRepository.js';
import { BasicLLMClient } from './BasicLLMClient.js';
import { redisPub } from '../config/redis.js';
import { config } from '../config/index.js';

export class ChatService {
  constructor() {
    this.chatRepository = new ChatRepository();
    this.messageRepository = new MessageRepository();
    this.basicLLMClient = new BasicLLMClient();
  }

  async sendMessage({ tenantId, userId, nombre, apellido, chatId, message }) {
    // Ensure chat exists
    await this.chatRepository.ensureExists(chatId, tenantId);

    // Prepare user name
    const userName = nombre && apellido ? `${nombre} ${apellido}` : (nombre || apellido || null);

    // Save user message with user info
    await this.messageRepository.create(chatId, tenantId, 'user', message, userId, userName, 'chat');

    // Publish user message to Redis
    const channel = `chat:${tenantId}:${chatId}`;
    await redisPub.publish(
      channel,
      JSON.stringify({
        role: 'user',
        content: message,
        chatId: chatId,
        at: new Date().toISOString(),
        userId,
        nombre,
        apellido
      })
    );

    // Get history
    const history = await this.messageRepository.getHistory(
      tenantId, 
      chatId, 
      config.chat.historyLimit
    );

    // Request AI response
    const aiResponse = await this.basicLLMClient.respond({
      tenantId,
      chatId,
      message,
      history
    });

    // Save assistant message (with user context for analytics)
    await this.messageRepository.create(chatId, tenantId, 'assistant', aiResponse.answer, userId, userName, 'chat');

    return {
      chatId,
      answer: aiResponse.answer,
      sources: aiResponse.sources
    };
  }
}
