import React, { useState } from 'react'
import { Share2, Star, Users, MapPin, Trophy, Shield, MessageSquare, ThumbsUp } from 'lucide-react'

// Mock Data for Community Features
const MOCK_ROUTES = [
  { id: 1, name: 'Powder Run - 樹林探險', author: 'SnowKing99', rating: 4.8, distance: '3.2km', difficulty: 'Black' },
  { id: 2, name: '晨間熱身平緩路線', author: 'EarlyBirdSki', rating: 4.5, distance: '1.5km', difficulty: 'Green' },
]

const MOCK_BUDDIES = [
  { name: 'Alex', status: 'Riding', location: 'Gondola Top Station', lastUpdate: '2 min ago' },
  { name: 'Sarah', status: 'Resting', location: 'Base Lodge', lastUpdate: '5 min ago' },
]

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'SpeedDemon', metric: '105 km/h Top Speed' },
  { rank: 2, name: 'SnowKing99', metric: '98 km/h Top Speed' },
  { rank: 3, name: 'CarveMaster', metric: '92 km/h Top Speed' },
]

export default function SkiCommunityPanel() {
  const [activeTab, setActiveTab] = useState<'library' | 'buddies' | 'clans' | 'leaderboard'>('library')

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <h2 className="font-bold flex items-center gap-2"><Users size={18} /> 社群與即時連線 (V26-V30)</h2>
      </div>

      <div className="flex border-b border-[var(--border-primary)] overflow-x-auto hide-scrollbar text-sm font-medium">
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'library' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <Share2 size={14} className="inline mr-1" /> 路線庫
        </button>
        <button 
          onClick={() => setActiveTab('buddies')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'buddies' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <MapPin size={14} className="inline mr-1" /> 好友追蹤
        </button>
        <button 
          onClick={() => setActiveTab('clans')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'clans' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <Shield size={14} className="inline mr-1" /> 群組
        </button>
        <button 
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'leaderboard' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <Trophy size={14} className="inline mr-1" /> 排行榜
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto bg-[var(--bg-main)]">
        {activeTab === 'library' && (
          <div className="space-y-3">
            {/* V26: Global Route Library UI & V27: Rating System */}
            {MOCK_ROUTES.map(route => (
              <div key={route.id} className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-faint)] flex flex-col gap-2 transition-transform hover:scale-[1.01] cursor-pointer">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[var(--text-primary)] text-sm">{route.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${route.difficulty === 'Black' ? 'bg-gray-800 text-white' : 'bg-green-500/20 text-green-600'}`}>
                    {route.difficulty}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] flex justify-between items-center">
                  <span>By {route.author}</span>
                  <span>{route.distance}</span>
                </div>
                <div className="pt-2 mt-1 border-t border-[var(--border-faint)] flex justify-between items-center text-xs text-[var(--text-faint)]">
                  <div className="flex items-center gap-1 text-yellow-500 font-semibold"><Star size={12} fill="currentColor" /> {route.rating}</div>
                  <div className="flex gap-3">
                    <button className="hover:text-blue-500 transition-colors flex items-center gap-1"><ThumbsUp size={12} /> 讚</button>
                    <button className="hover:text-blue-500 transition-colors flex items-center gap-1"><MessageSquare size={12} /> 評論</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'buddies' && (
          <div className="space-y-3">
            {/* V28: Real-time Buddy Tracking Mock */}
            {MOCK_BUDDIES.map((buddy, idx) => (
              <div key={idx} className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-faint)] flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">{buddy.name[0]}</div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--bg-card)] ${buddy.status === 'Riding' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{buddy.name}</div>
                  <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1"><MapPin size={10} /> {buddy.location}</div>
                </div>
                <div className="text-[10px] text-[var(--text-faint)]">{buddy.lastUpdate}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'clans' && (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] text-sm space-y-4">
            {/* V29: Ski Groups / Clans UI */}
            <Shield size={32} className="opacity-40 text-blue-500" />
            <p>與朋友組成滑雪群組 (Clan)，共享私房路線與行程！</p>
            <button className="px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-lg font-semibold transition-colors">
              建立群組
            </button>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-3">
            {/* V30: Global Leaderboards UI */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-md mb-2 flex justify-between items-center">
              <span className="font-bold text-sm flex items-center gap-2"><Trophy size={16} /> 本季最快滑降速度</span>
            </div>
            {MOCK_LEADERBOARD.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 p-2 border-b border-[var(--border-faint)] last:border-0">
                <div className={`w-6 text-center font-bold text-lg ${item.rank === 1 ? 'text-yellow-500' : item.rank === 2 ? 'text-gray-400' : 'text-amber-700'}`}>
                  {item.rank}
                </div>
                <div className="flex-1 font-medium text-sm">{item.name}</div>
                <div className="text-xs font-bold font-mono bg-[var(--bg-secondary)] px-2 py-1 rounded">{item.metric}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
