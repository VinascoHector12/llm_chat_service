import { StatsService } from '../services/StatsService.js';

export class StatsController {
  constructor() {
    this.statsService = new StatsService();
  }

  getStats = async (req, res) => {
    try {
      const { tenantId } = req.user;
      
      const stats = await this.statsService.getStats(tenantId);
      
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'stats_fetch_failed' });
    }
  };
}
