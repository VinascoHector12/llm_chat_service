import { pool } from '../config/database.js';

export class UserSessionRepository {
  async createSession({ tenantId, userId, userEmail, userName, sessionType = 'chat', ipAddress = null, userAgent = null }) {
    const result = await pool.query(
      `INSERT INTO user_sessions (tenant_id, user_id, user_email, user_name, session_type, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, connected_at`,
      [tenantId, userId, userEmail, userName, sessionType, ipAddress, userAgent]
    );

    return result.rows[0];
  }

  async updateActivity(sessionId) {
    await pool.query(
      `UPDATE user_sessions 
       SET last_activity_at = now()
       WHERE id = $1`,
      [sessionId]
    );
  }

  async disconnectSession(sessionId) {
    await pool.query(
      `UPDATE user_sessions 
       SET is_connected = FALSE, disconnected_at = now()
       WHERE id = $1`,
      [sessionId]
    );
  }

  async getActiveSessions(tenantId) {
    const result = await pool.query(
      `SELECT 
        id,
        user_id,
        user_email,
        user_name,
        session_type,
        connected_at,
        last_activity_at
       FROM user_sessions
       WHERE tenant_id = $1 
       AND is_connected = TRUE
       ORDER BY last_activity_at DESC`,
      [tenantId]
    );

    return result.rows;
  }

  async disconnectInactiveSessions(minutesInactive = 30) {
    const result = await pool.query(
      `UPDATE user_sessions 
       SET is_connected = FALSE, disconnected_at = now()
       WHERE is_connected = TRUE
       AND last_activity_at < now() - interval '${minutesInactive} minutes'
       RETURNING id`,
      []
    );

    return result.rowCount;
  }
}
