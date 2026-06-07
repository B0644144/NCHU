import { Place } from '../types';
import { db } from '../db/database';

export interface AIExplanation {
  rationale: string;
  factors: string[];
  dataSources: string[];
}

export interface AIRecommendation {
  placeName: string;
  category: string;
  description: string;
  explanation: AIExplanation;
}

/**
 * Mocks an Explainable AI recommendation engine based on 2024-2025 XAI literature.
 * In a real-world scenario, this would call an LLM (OpenAI/Anthropic) with context 
 * (weather, current itinerary, user preferences) and ask it to output SHAP-like factors.
 */
export async function getTripRecommendations(tripId: number, context: { weather?: string; timeOfDay?: string }): Promise<AIRecommendation[]> {
  // Fetch existing places to understand context
  const places = db.prepare('SELECT name, category_id FROM places WHERE trip_id = ? LIMIT 10').all(tripId) as { name: string, category_id: number }[];
  
  const hasOutdoors = places.some(p => p.category_id === 2); // Assuming 2 might be outdoors/nature
  
  // Rule-based mock generating Explainable AI (XAI) format responses
  const recommendations: AIRecommendation[] = [];

  // Recommendation 1: Context-aware
  if (context.weather?.toLowerCase().includes('rain')) {
    recommendations.push({
      placeName: 'Local Art Museum & Indoor Market',
      category: 'Indoor Activity',
      description: 'A massive indoor complex perfect for exploring local culture while staying dry.',
      explanation: {
        rationale: 'Since the forecast indicates rain, indoor activities are prioritized to ensure a comfortable experience.',
        factors: ['Weather: Rainy (High impact)', 'Distance: Near your current location'],
        dataSources: ['Open-Meteo Weather API', 'Trip Itinerary Context']
      }
    });
  } else {
    recommendations.push({
      placeName: 'Sunset Observation Deck',
      category: 'Sightseeing',
      description: 'An open-air deck offering panoramic views of the city at sunset.',
      explanation: {
        rationale: 'The clear weather and upcoming evening time make this an ideal spot for photography and relaxation.',
        factors: ['Weather: Clear (Medium impact)', 'Time: Approaching sunset (High impact)'],
        dataSources: ['Open-Meteo Weather API', 'Time Context']
      }
    });
  }

  // Recommendation 2: Preference-aware (Collaborative filtering simulation)
  recommendations.push({
    placeName: 'Historic Downtown Cafe',
    category: 'Dining',
    description: 'A highly rated cafe known for its authentic local cuisine and historic ambiance.',
    explanation: {
      rationale: 'Based on your itinerary containing similar historic sites, this cafe aligns with your interest in cultural heritage.',
      factors: ['User Preference: Historic Sites (High impact)', 'Popularity: 4.8/5 Stars (Medium impact)'],
      dataSources: ['User Itinerary History', 'Local POI Database']
    }
  });

  return recommendations;
}
