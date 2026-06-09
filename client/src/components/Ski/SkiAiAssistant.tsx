import React, { useState } from 'react'
import { Sparkles, Route, Clock, Compass, Mic, ScanSearch, Check } from 'lucide-react'

export default function SkiAiAssistant() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAiAction = (feature: string) => {
    setActiveFeature(feature)
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <div className="bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-purple-500 font-bold">
        <Sparkles size={18} />
        <h2>Trek AI 智慧滑雪助理 (V31-V35)</h2>
      </div>

      <div className="flex-1 space-y-3">
        {/* V31 */}
        <button 
          onClick={() => handleAiAction('autocomplete')}
          className="w-full text-left p-3 rounded-xl border border-[var(--border-faint)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-all flex items-start gap-3"
        >
          <div className="bg-purple-500/10 p-2 rounded-lg text-purple-500"><Route size={16} /></div>
          <div>
            <div className="font-semibold text-sm">路線自動補全</div>
            <div className="text-xs text-[var(--text-faint)]">畫出起點，AI 自動為您導航至山下。</div>
          </div>
        </button>

        {/* V32 */}
        <button 
          onClick={() => handleAiAction('waittime')}
          className="w-full text-left p-3 rounded-xl border border-[var(--border-faint)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-all flex items-start gap-3"
        >
          <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><Clock size={16} /></div>
          <div>
            <div className="font-semibold text-sm">纜車排隊熱區預測</div>
            <div className="text-xs text-[var(--text-faint)]">預測各纜車等待時間，避開人潮。</div>
          </div>
        </button>

        {/* V33 */}
        <button 
          onClick={() => handleAiAction('recommendation')}
          className="w-full text-left p-3 rounded-xl border border-[var(--border-faint)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-all flex items-start gap-3"
        >
          <div className="bg-green-500/10 p-2 rounded-lg text-green-500"><Compass size={16} /></div>
          <div>
            <div className="font-semibold text-sm">專屬雪場推薦</div>
            <div className="text-xs text-[var(--text-faint)]">分析您的滑雪習慣，推薦隱藏版雪場。</div>
          </div>
        </button>

        {/* V34 */}
        <button 
          onClick={() => handleAiAction('voice')}
          className="w-full text-left p-3 rounded-xl border border-[var(--border-faint)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-all flex items-start gap-3"
        >
          <div className="bg-red-500/10 p-2 rounded-lg text-red-500"><Mic size={16} /></div>
          <div>
            <div className="font-semibold text-sm">語音路線導航</div>
            <div className="text-xs text-[var(--text-faint)]">「幫我畫一條最陡的黑線到基地...」</div>
          </div>
        </button>

        {/* V35 */}
        <button 
          onClick={() => handleAiAction('terrain')}
          className="w-full text-left p-3 rounded-xl border border-[var(--border-faint)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-all flex items-start gap-3"
        >
          <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-500"><ScanSearch size={16} /></div>
          <div>
            <div className="font-semibold text-sm">地形圖 AI 辨識</div>
            <div className="text-xs text-[var(--text-faint)]">自動標註懸崖、樹林與未壓雪區域。</div>
          </div>
        </button>
      </div>

      {activeFeature && (
        <div className="mt-4 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-faint)] text-sm flex items-center gap-3 animate-fade-in">
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[var(--text-secondary)]">AI 正在處理您的請求...</span>
            </>
          ) : (
            <>
              <Check size={16} className="text-green-500" />
              <span className="text-green-600 font-semibold">處理完成！已將結果疊加至地圖上。</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
