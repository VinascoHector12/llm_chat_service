import { healthCheck } from '../config/database.js';

export class HealthController {
  check = async (_req, res) => {
    const isHealthy = await healthCheck();
    
    if (isHealthy) {
      res.json({ ok: true });
    } else {
      res.status(500).json({ ok: false });
    }
  };
}
