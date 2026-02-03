import { MessageRepository } from '../repositories/MessageRepository.js';
import { pool } from '../config/database.js';

export class StatsService {
  constructor() {
    this.messageRepository = new MessageRepository();
  }

  async getStats(tenantId) {
    // Obtener usuarios activos (usuarios que han enviado mensajes hoy)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeUsersResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count
       FROM messages
       WHERE tenant_id = $1 
       AND role = 'user'
       AND user_id IS NOT NULL
       AND created_at >= $2`,
      [tenantId, today]
    );
    
    // Obtener mensajes de hoy
    const messagesResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM messages
       WHERE tenant_id = $1 
       AND role = 'user'
       AND created_at >= $2`,
      [tenantId, today]
    );
    
    return {
      activeUsers: parseInt(activeUsersResult.rows[0]?.count || 0),
      messagesToday: parseInt(messagesResult.rows[0]?.count || 0)
    };
  }
}
