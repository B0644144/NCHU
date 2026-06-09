import React, { useState } from 'react'
import { Medal, Star, ShieldCheck, Zap, Activity, Gamepad2, Award } from 'lucide-react'

export default function SkiGamificationPanel() {
  const [activeTab, setActiveTab] = useState<'pass' | 'skills' | 'achievements' | 'challenges'>('pass')

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <h2 className="font-bold flex items-center gap-2 text-indigo-500"><Gamepad2 size={18} /> 遊戲化與成就 (V36-V40)</h2>
      </div>

      <div className="flex border-b border-[var(--border-primary)] overflow-x-auto hide-scrollbar text-sm font-medium">
        <button 
          onClick={() => setActiveTab('pass')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'pass' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          數位雪票
        </button>
        <button 
          onClick={() => setActiveTab('skills')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'skills' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          技能樹
        </button>
        <button 
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'achievements' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          徽章牆
        </button>
        <button 
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'challenges' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          賽季挑戰
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto bg-[var(--bg-main)]">
        {activeTab === 'pass' && (
          <div className="flex items-center justify-center h-full">
            {/* V38: Virtual Ski Pass UI */}
            <div className="relative w-72 h-44 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 shadow-[0_10px_30px_rgba(79,70,229,0.3)] text-white p-5 overflow-hidden transform hover:scale-105 transition-transform cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="font-bold tracking-wider text-lg">TREK EPIC PASS</div>
                <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono">2026/2027</div>
              </div>
              <div className="mt-6 relative z-10">
                <div className="text-xs text-indigo-200">Passholder</div>
                <div className="font-bold text-xl uppercase">Snow Enthusiast</div>
              </div>
              <div className="absolute bottom-5 right-5 z-10 opacity-50 flex gap-1">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center"><ShieldCheck className="text-indigo-600" size={16}/></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            {/* V36: Ski Skill Trees UI */}
            <div className="text-sm font-semibold mb-2 flex items-center gap-2"><Activity size={16}/> Carving 刻滑技巧 (Lv. 3)</div>
            <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-1">
              <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
            </div>
            <p className="text-xs text-[var(--text-faint)]">再滑行 25km 即可解鎖「Lv. 4: 陡坡穩定」</p>

            <div className="text-sm font-semibold mb-2 mt-6 flex items-center gap-2"><Zap size={16}/> Freestyle 特技 (Lv. 1)</div>
            <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-1">
              <div className="h-full bg-pink-500 w-1/4 rounded-full"></div>
            </div>
            <p className="text-xs text-[var(--text-faint)]">再成功落地 5 次 180s 即可升級</p>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-3 gap-3">
            {/* V37: Skiing Achievements/Badges UI */}
            <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-500/50 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
              <Award className="text-amber-500" size={32} />
              <div className="text-[10px] font-bold text-amber-700 dark:text-amber-500">早鳥粉雪</div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-500/50 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2">
              <Medal className="text-slate-500" size={32} />
              <div className="text-[10px] font-bold text-slate-700 dark:text-slate-400">黑線征服者</div>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-faint)] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 opacity-50 grayscale">
              <Star className="text-gray-400" size={32} />
              <div className="text-[10px] font-bold text-gray-400">??? (未解鎖)</div>
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-4">
            {/* V40: Seasonal Challenges UI */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-3 border border-[var(--border-faint)]">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>單季累計滑行 100km</span>
                <span className="text-indigo-500">65 / 100</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-main)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[65%] rounded-full"></div>
              </div>
              <div className="text-[10px] text-[var(--text-faint)] mt-2">剩餘時間：45 天</div>
            </div>
            
            <div className="bg-[var(--bg-secondary)] rounded-xl p-3 border border-[var(--border-faint)] opacity-80">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>探索 5 個不同雪場</span>
                <span className="text-indigo-500">2 / 5</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-main)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[40%] rounded-full"></div>
              </div>
              <div className="text-[10px] text-[var(--text-faint)] mt-2">剩餘時間：45 天</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
