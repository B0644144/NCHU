import express from 'express';
import { authenticate } from '../middleware/auth';
import { getTripRecommendations } from '../services/aiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/ski-route', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { tripId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    let mockRoute = null;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const prompt = `
          You are an expert ski route planner.
          I am providing you with an image of a ski resort map.
          Based on the image, create a recommended ski route that traverses different slopes.
          Return ONLY a valid JSON object in the following format, without markdown blocks or additional text:
          {
            "name": "⛷️ AI 滑雪推薦路線",
            "description": "Your detailed description in Traditional Chinese of the route.",
            "route_geometry": {
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "properties": { "color": "#E74C3C", "label": "進階 (紅線)", "time": "10 min", "difficulty": "advanced" },
                  "geometry": { "type": "LineString", "coordinates": [[140.7042, 42.8631], [140.7060, 42.8610]] }
                }
              ]
            }
          }
          Use realistic coordinates for Hokkaido (e.g., Niseko or Rusutsu around lat 42.8, lng 140.7) and create 2-4 route segments.
        `;

        const imagePart = {
          inlineData: {
            data: req.file.buffer.toString("base64"),
            mimeType: req.file.mimetype
          },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text().trim();
        if (text.startsWith('\`\`\`json')) {
          text = text.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
        }

        const parsed = JSON.parse(text);
        mockRoute = {
          ...parsed,
          route_geometry: JSON.stringify(parsed.route_geometry),
          category_id: null,
        };
      } catch (geminiError) {
        console.error('Gemini API Error:', geminiError);
        // Fallback to mock below if Gemini fails
      }
    }

    if (!mockRoute) {
      // Fallback Mock response
      mockRoute = {
        name: "⛷️ AI 滑雪推薦路線 (Fallback)",
        description: "基於上傳的雪場地圖，我們建議從主纜車開始，沿著紅線山脊滑下，最後在基地餐廳結束並享用午餐。",
        category_id: null,
        route_geometry: JSON.stringify({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { color: "#E74C3C", label: "進階 (紅線)", time: "10 分鐘", difficulty: "advanced" },
              geometry: { type: "LineString", coordinates: [[140.7042, 42.8631], [140.7060, 42.8610]] }
            },
            {
              type: "Feature",
              properties: { color: "#3498DB", label: "中級 (藍線)", time: "15 分鐘", difficulty: "intermediate" },
              geometry: { type: "LineString", coordinates: [[140.7060, 42.8610], [140.7080, 42.8580]] }
            },
            {
              type: "Feature",
              properties: { color: "#2ECC71", label: "新手 (綠線)", time: "20 分鐘", difficulty: "beginner" },
              geometry: { type: "LineString", coordinates: [[140.7080, 42.8580], [140.7100, 42.8550]] }
            }
          ]
        }),
      };
    }

    res.json({ route: mockRoute });
  } catch (error) {
    console.error('Ski route generation error:', error);
    res.status(500).json({ error: 'Failed to analyze ski map' });
  }
});

export default router;
