import React, { useState } from 'react'
import { Package, Truck, Wrench, CheckSquare, ShoppingBag, Plus } from 'lucide-react'

export default function SkiGearLocker() {
  const [activeTab, setActiveTab] = useState<'locker' | 'packing' | 'shuttle' | 'rental'>('locker')

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <h2 className="font-bold flex items-center gap-2 text-emerald-600"><Package size={18} /> 裝備與後勤 (V41-V45)</h2>
      </div>

      <div className="flex border-b border-[var(--border-primary)] overflow-x-auto hide-scrollbar text-sm font-medium">
        <button 
          onClick={() => setActiveTab('locker')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'locker' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          裝備櫃
        </button>
        <button 
          onClick={() => setActiveTab('packing')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'packing' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          打包清單
        </button>
        <button 
          onClick={() => setActiveTab('shuttle')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'shuttle' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          接駁專車
        </button>
        <button 
          onClick={() => setActiveTab('rental')}
          className={`flex-1 px-3 py-2 whitespace-nowrap text-center transition-colors border-b-2 ${activeTab === 'rental' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          線上租賃
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto bg-[var(--bg-main)]">
        {activeTab === 'locker' && (
          <div className="space-y-4">
            {/* V41: Gear Locker, V42: Condition Tracker */}
            <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-faint)] relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs text-[var(--text-faint)]">Snowboard</div>
                  <div className="font-bold">Burton Custom X 156</div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold">主力</div>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border-faint)] space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1">
                    <span>打蠟狀態 (Wax)</span>
                    <span className="text-orange-500 font-bold flex items-center gap-1"><Wrench size={10} /> 需保養</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-secondary)] rounded-full"><div className="h-full bg-orange-500 w-[20%] rounded-full"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1">
                    <span>鋼邊銳度 (Edges)</span>
                    <span className="text-emerald-500 font-bold">良好</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-secondary)] rounded-full"><div className="h-full bg-emerald-500 w-[80%] rounded-full"></div></div>
                </div>
              </div>
            </div>

            <button className="w-full py-3 border-2 border-dashed border-[var(--border-primary)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center gap-2 font-semibold">
              <Plus size={16} /> 新增裝備
            </button>
          </div>
        )}

        {activeTab === 'packing' && (
          <div className="space-y-2">
            {/* V44: Packing List Generator */}
            {['雪板 Snowboard', '固定器 Bindings', '雪鞋 Boots', '雪衣 Jacket', '雪褲 Pants', '護目鏡 Goggles', '安全帽 Helmet', '手套 Gloves'].map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-faint)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" defaultChecked={i < 3} />
                <span className={`text-sm ${i < 3 ? 'line-through text-[var(--text-faint)]' : 'text-[var(--text-primary)] font-medium'}`}>{item}</span>
              </label>
            ))}
          </div>
        )}

        {activeTab === 'shuttle' && (
          <div className="space-y-4">
            {/* V43: Ski Resort Shuttle Scheduler */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-2">
                <Truck size={16} /> 東京車站 ➔ 石打丸山
              </div>
              <div className="flex justify-between items-center bg-white dark:bg-zinc-800 p-2 rounded-lg text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">07:00</div>
                  <div className="text-[10px] text-[var(--text-faint)]">出發</div>
                </div>
                <div className="flex-1 px-4 text-center">
                  <div className="h-px bg-gray-300 dark:bg-zinc-600 w-full relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 px-2 text-[10px] text-[var(--text-faint)]">2h 30m</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">09:30</div>
                  <div className="text-[10px] text-[var(--text-faint)]">抵達</div>
                </div>
              </div>
              <button className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors">
                預約座位
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rental' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            {/* V45: Rental Equipment Integration */}
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500">
              <ShoppingBag size={32} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">雪場連線租賃服務</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 px-4">提前在線上預約雪板與雪鞋，抵達雪場直接取貨，節省排隊時間。</p>
            </div>
            <button className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full text-sm font-bold mt-2">
              瀏覽裝備目錄
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
