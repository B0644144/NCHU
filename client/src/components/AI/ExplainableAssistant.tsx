import React, { useState } from 'react';
import { aiApi } from '../../api/client';
import { Bot, Sparkles, Database, Info, RefreshCw, AlertTriangle, CloudRain, MapPin } from 'lucide-react';

interface AIExplanation {
  rationale: string;
  factors: string[];
  dataSources: string[];
}

interface AIRecommendation {
  placeName: string;
  category: string;
  description: string;
  explanation: AIExplanation;
}

export default function ExplainableAssistant({ tripId, onAddPlace }: { tripId: number, onAddPlace?: (data: Partial<AIRecommendation>) => void }) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [weatherContext, setWeatherContext] = useState('Clear');
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiApi.getRecommendations(tripId, { weather: weatherContext, timeOfDay: 'Afternoon' });
      setRecommendations(res.recommendations);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
      <div className="bg-indigo-50 dark:bg-indigo-900/30 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg text-indigo-600 dark:text-indigo-300">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              Explainable AI Assistant
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                Beta
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Context-aware, transparent recommendations</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <select 
            value={weatherContext} 
            onChange={(e) => setWeatherContext(e.target.value)}
            className="text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-1.5"
          >
            <option value="Clear">Clear Weather</option>
            <option value="Rain">Rainy Weather</option>
          </select>
          <button 
            onClick={fetchRecommendations}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Ask AI
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="p-4 space-y-6">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {rec.placeName}
                  </h4>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{rec.category}</span>
                </div>
                <button 
                  onClick={() => onAddPlace?.({ placeName: rec.placeName, category: rec.category, description: rec.description })}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                >
                  <MapPin size={14} /> Add to Itinerary
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{rec.description}</p>
              
              {/* Explainability Section */}
              <div className="bg-white dark:bg-slate-900 rounded-md border border-indigo-100 dark:border-indigo-900/50 p-3 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">
                  <Info size={14} /> Why was this recommended?
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{rec.explanation.rationale}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> Key Factors (SHAP)
                    </h5>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {rec.explanation.factors.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Database size={12} /> Data Sources
                    </h5>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {rec.explanation.dataSources.map((ds, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {ds}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && recommendations.length === 0 && !error && (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <Bot size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Ask the Explainable AI Assistant for context-aware travel recommendations.</p>
        </div>
      )}
    </div>
  );
}
