import React, { useState } from 'react'
import { Moon, DownloadCloud, ScanEye, Camera, MonitorSmartphone } from 'lucide-react'

export default function SkiPremiumTools() {
  const [nightMode, setNightMode] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [activeCam, setActiveCam] = useState<'drone' | 'fps' | 'free'>('drone')

  const handleDownload = () => {
    setIsDownloading(true)
    let p = 0
    const interval = setInterval(() => {
      p += 5
      setDownloadProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setTimeout(() => setIsDownloading(false), 1000)
      }
    }, 100)
  }

  // Toggle global theme specifically for Ski Hub
  const toggleNightMode = () => {
    setNightMode(!nightMode)
    if (!nightMode) {
      document.body.classList.add('ski-night-mode')
    } else {
      document.body.classList.remove('ski-night-mode')
    }
  }

  return (
    <div className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-sm p-4 h-full flex flex-col ${nightMode ? 'ring-2 ring-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.2)]' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold flex items-center gap-2 text-fuchsia-500"><MonitorSmartphone size={18} /> 旗艦擴展功能 (V46-V49)</h2>
      </div>

      <div className="space-y-4">
        {/* V46: Neon Night Skiing Theme Toggle */}
        <button 
          onClick={toggleNightMode}
          className={`w-full p-3 rounded-xl border flex items-center justify-between transition-colors ${nightMode ? 'bg-fuchsia-900/30 border-fuchsia-500 text-fuchsia-400' : 'bg-[var(--bg-secondary)] border-[var(--border-faint)] hover:border-fuchsia-300'}`}
        >
          <div className="flex items-center gap-2 font-bold"><Moon size={16} /> 賽博龐克夜滑模式</div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${nightMode ? 'bg-fuchsia-500' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${nightMode ? 'left-4.5' : 'left-0.5'}`} />
          </div>
        </button>

        {/* V47: Offline 3D Map Support UI */}
        <div className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-faint)]">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-sm flex items-center gap-2"><DownloadCloud size={16} /> 離線 3D 雪場數據</div>
            {isDownloading ? (
              <span className="text-xs text-blue-500 font-bold">{downloadProgress}%</span>
            ) : (
              <button onClick={handleDownload} className="text-xs font-bold text-blue-500 hover:text-blue-600 uppercase tracking-wider">Download</button>
            )}
          </div>
          <div className="text-xs text-[var(--text-faint)] mb-2">石打丸山滑雪場 (245 MB) - 包含 DEM 地形與 3D 模型。</div>
          {isDownloading && (
            <div className="h-1.5 w-full bg-[var(--bg-main)] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${downloadProgress}%` }}></div>
            </div>
          )}
        </div>

        {/* V48: AR Preview Mode UI Placeholder */}
        <button className="w-full p-3 rounded-xl border border-[var(--border-faint)] bg-gradient-to-r from-orange-500/10 to-rose-500/10 hover:from-orange-500/20 hover:to-rose-500/20 text-orange-600 transition-all flex justify-center items-center gap-2 font-bold shadow-sm">
          <ScanEye size={16} /> 開啟 AR 雪盤模式預覽
        </button>

        {/* V49: Cinematic Camera Tools for Replay */}
        <div className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-faint)]">
          <div className="font-bold text-sm mb-3 flex items-center gap-2"><Camera size={16} /> 電影級運鏡切換</div>
          <div className="flex gap-2 bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border-primary)]">
            <button 
              onClick={() => setActiveCam('drone')}
              className={`flex-1 py-1 text-xs font-bold rounded shadow-sm transition-colors ${activeCam === 'drone' ? 'bg-[var(--text-primary)] text-[var(--bg-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            >空拍機追隨</button>
            <button 
              onClick={() => setActiveCam('fps')}
              className={`flex-1 py-1 text-xs font-bold rounded shadow-sm transition-colors ${activeCam === 'fps' ? 'bg-[var(--text-primary)] text-[var(--bg-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            >第一人稱</button>
            <button 
              onClick={() => setActiveCam('free')}
              className={`flex-1 py-1 text-xs font-bold rounded shadow-sm transition-colors ${activeCam === 'free' ? 'bg-[var(--text-primary)] text-[var(--bg-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            >自由視角</button>
          </div>
        </div>

      </div>
    </div>
  )
}
