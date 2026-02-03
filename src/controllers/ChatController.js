import { ChatService } from '../services/ChatService.js';

export class ChatController {
  constructor() {
    this.chatService = new ChatService();
  }

  send = async (req, res) => {
    try {
      const { tenantId, sub: userId, nombre, apellido } = req.user;
      const { chatId = 'chat-1', message } = req.body ?? {};
      
      if (!message) {
        return res.status(400).json({ error: 'message is required' });
      }

      const result = await this.chatService.sendMessage({
        tenantId,
        userId,
        nombre,
        apellido,
        chatId,
        message
      });

      res.json({ 
        ok: true, 
        chatId: result.chatId, 
        answer: result.answer, 
        sources: result.sources 
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'send_failed' });
    }
  };
}
