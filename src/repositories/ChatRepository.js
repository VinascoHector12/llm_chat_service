import { pool } from '../config/database.js';
import { Chat } from '../models/Chat.js';

export class ChatRepository {
  async ensureExists(chatId, tenantId) {
    await pool.query(
      'INSERT INTO chats (id, tenant_id) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
      [chatId, tenantId]
    );
    
    return new Chat({ id: chatId, tenantId });
  }

  async findById(chatId) {
    const result = await pool.query(
      'SELECT id, tenant_id, created_at FROM chats WHERE id = $1',
      [chatId]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return new Chat({
      id: row.id,
      tenantId: row.tenant_id,
      createdAt: row.created_at
    });
  }
}
