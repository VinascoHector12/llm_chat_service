import { pool } from '../config/database.js';
import { Message } from '../models/Message.js';

export class MessageRepository {
  async create(chatId, tenantId, role, content, userId = null, userName = null, msgType = 'chat') {
    const result = await pool.query(
      `INSERT INTO messages (chat_id, tenant_id, role, content, user_id, user_name, msg_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, created_at`,
      [chatId, tenantId, role, content, userId, userName, msgType]
    );

    const row = result.rows[0];
    return new Message({
      id: row.id,
      chatId,
      tenantId,
      role,
      content,
      userId,
      userName,
      msgType,
      createdAt: row.created_at
    });
  }

  async getHistory(tenantId, chatId, limit = 12) {
    const result = await pool.query(
      `SELECT role, content
       FROM messages
       WHERE tenant_id = $1 AND chat_id = $2
       ORDER BY created_at ASC
       LIMIT $3`,
      [tenantId, chatId, limit]
    );

    return result.rows.map(row => ({
      role: row.role,
      content: row.content
    }));
  }
}
