import Redis from 'ioredis';
import { config } from '../config/index.js';

export class StreamService {
  createStream(tenantId, chatId, onMessage, onClose, subscribeToAll = false) {
    const sub = new Redis(config.redisUrl);
    
    // Si subscribeToAll es true, usar pattern matching para suscribirse a todos los chats del tenant
    const channel = subscribeToAll ? `chat:${tenantId}:*` : `chat:${tenantId}:${chatId}`;
    const isPattern = subscribeToAll;

    console.log('[StreamService] Creating stream:', {
      tenantId,
      chatId,
      channel,
      isPattern,
      subscribeToAll
    });

    const subscribePromise = isPattern 
      ? sub.psubscribe(channel) 
      : sub.subscribe(channel);

    subscribePromise.then(() => {
      console.log('[StreamService] Subscribed to channel:', channel);
      // Send initial connection message
      onMessage(JSON.stringify({
        role: 'system',
        content: isPattern ? 'SSE connected to all tenant chats' : 'SSE connected',
        at: new Date().toISOString()
      }));
    }).catch(err => {
      console.error('[StreamService] Subscription error:', err);
    });

    // Usar el evento correcto según si es pattern o no
    const messageEvent = isPattern ? 'pmessage' : 'message';
    
    sub.on(messageEvent, (_pattern, _ch, msg) => {
      // En pmessage, los argumentos son (pattern, channel, message)
      // En message, son (channel, message)
      // Normalizar para ambos casos
      const message = isPattern ? msg : _ch;
      console.log('[StreamService] Message received:', { messageEvent, channel: isPattern ? _ch : _pattern });
      onMessage(message);
    });

    const cleanup = async () => {
      try {
        if (isPattern) {
          await sub.punsubscribe(channel);
        } else {
          await sub.unsubscribe(channel);
        }
      } catch {}
      try {
        sub.disconnect();
      } catch {}
      onClose();
    };

    return cleanup;
  }
}
