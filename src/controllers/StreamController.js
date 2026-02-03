import { StreamService } from '../services/StreamService.js';
import { UserSessionRepository } from '../repositories/UserSessionRepository.js';

export class StreamController {
  constructor() {
    this.streamService = new StreamService();
    this.sessionRepository = new UserSessionRepository();
  }

  stream = async (req, res) => {
    const { tenantId: tokenTenant, role, sub: userId, email, nombre, apellido } = req.user;
    const { tenantId, chatId } = req.params;

    console.log('[StreamController] Request from user:', {
      tokenTenant,
      role,
      userId,
      requestedTenant: tenantId,
      requestedChatId: chatId
    });

    if (tenantId !== tokenTenant) {
      console.log('[StreamController] Tenant mismatch - returning 403');
      return res.status(403).json({ error: 'tenant_mismatch' });
    }

    // Si el usuario es admin y el chatId es 'all', suscribirse a todos los chats del tenant
    const subscribeToAll = role === 'admin' && chatId === 'all';
    
    console.log('[StreamController] Subscribe to all:', subscribeToAll);

    // Registrar sesión del usuario
    const userName = nombre && apellido ? `${nombre} ${apellido}` : (nombre || apellido || null);
    let sessionId = null;
    
    try {
      const session = await this.sessionRepository.createSession({
        tenantId,
        userId,
        userEmail: email,
        userName,
        sessionType: 'sse',
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent']
      });
      sessionId = session.id;
      console.log('[StreamController] Session created:', sessionId);
    } catch (error) {
      console.error('[StreamController] Failed to create session:', error);
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const send = (data) => {
      res.write(`event: message\n`);
      res.write(`data: ${data}\n\n`);
      
      // Actualizar actividad de la sesión
      if (sessionId) {
        this.sessionRepository.updateActivity(sessionId).catch(err => {
          console.error('[StreamController] Failed to update activity:', err);
        });
      }
    };
    
    const cleanup = this.streamService.createStream(
      tenantId,
      chatId,
      send,
      () => {
        // Desconectar sesión cuando el stream se cierra
        if (sessionId) {
          this.sessionRepository.disconnectSession(sessionId).catch(err => {
            console.error('[StreamController] Failed to disconnect session:', err);
          });
        }
      },
      subscribeToAll
    );

    req.on('close', cleanup);
  };
}
