import express from 'express';
import { authenticate } from '../middleware/auth';
import { getTripRecommendations } from '../services/aiService';

const router = express.Router();

router.post('/recommend', authenticate, async (req, res) => {
  try {
    const { tripId, context } = req.body;
    
    if (!tripId) {
      return res.status(400).json({ error: 'Trip ID is required' });
    }

    const recommendations = await getTripRecommendations(Number(tripId), context || {});
    res.json({ recommendations });
  } catch (error) {
    console.error('AI Recommendation error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export default router;
