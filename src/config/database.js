import pg from 'pg';
import { config } from './index.js';

const { Pool } = pg;

export const pool = new Pool(config.database);

export async function healthCheck() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
