import express from 'express';
import { authenticate } from '../middleware/auth';
import { getResortConditions } from '../services/skiConditionsService';

const router = express.Router();

router.get('/conditions', authenticate, async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid lat and lng are required' });
    }

    const conditions = await getResortConditions(lat, lng);
    res.json(conditions);
  } catch (error) {
    console.error('Error fetching ski conditions:', error);
    res.status(500).json({ error: 'Failed to fetch ski conditions' });
  }
});

export default router;
