import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../i18n'
import Navbar from '../components/Layout/Navbar'
import { Map, Mountain, Upload, Play, Share2, Image as ImageIcon } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import SkiResortMapEditor from '../components/Ski/SkiResortMapEditor'
import Mapbox3DTerrain from '../components/Map/Mapbox3DTerrain'
import SkiChangelog from '../components/Ski/SkiChangelog'
import SkiRouteAnalytics from '../components/Ski/SkiRouteAnalytics'
import SkiCommunityPanel from '../components/Ski/SkiCommunityPanel'
import SkiAiAssistant from '../components/Ski/SkiAiAssistant'
import SkiGamificationPanel from '../components/Ski/SkiGamificationPanel'
import SkiGearLocker from '../components/Ski/SkiGearLocker'
import SkiPremiumTools from '../components/Ski/SkiPremiumTools'
import { Sparkles, Activity, Search, ImagePlus } from 'lucide-react'

export default function SkiHubPage(): React.ReactElement {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null)
  const [savedRoute, setSavedRoute] = useState<[number, number][]>([])
  const [isReplaying, setIsReplaying] = useState(false)
  
  // V51: Text Search & Center Coordinates
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock Database of Japanese Ski Resorts
  const SKI_RESORTS = [
    { name: '石打丸山滑雪場 (Ishiuchi Maruyama)', lat: 36.9667, lng: 138.8000, img: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&q=80&w=1000' },
    { name: '神樂滑雪場 (Kagura)', lat: 36.8833, lng: 138.7500, img: 'https://images.unsplash.com/photo-1414445092210-410061e89fce?auto=format&fit=crop&q=80&w=1000' },
    { name: '岩原滑雪場 (Iwappara)', lat: 36.9333, lng: 138.8333, img: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1000' },
    { name: '神立滑雪場 (Kandatsu)', lat: 36.9167, lng: 138.8167, img: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&q=80&w=1000' },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setMapImageUrl(url)
    }
  }

  // Paste Event Listener
  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            const url = URL.createObjectURL(file)
            setMapImageUrl(url)
          }
          break
        }
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [])

  const handleResortSelect = (resort: typeof SKI_RESORTS[0]) => {
    setMapImageUrl(resort.img)
    setMapCenter([resort.lat, resort.lng])
    setSearchQuery(resort.name)
    setShowDropdown(false)
  }

  const handleSaveRoute = (points: [number, number][]) => {
    setSavedRoute(points)
    alert(`路線已暫存！共包含 ${points.length} 個節點，您現在可以在右側體驗 3D 模擬。`)
  }

  const handleShareReplay = () => {
    navigator.clipboard.writeText(window.location.origin + '/ski?shared_replay=1')
    alert('3D 路線重播連結已複製到剪貼簿！您可以分享給朋友了！')
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Navbar />
      
      <div className="flex-1 overflow-y-auto" style={{ padding: '24px max(env(safe-area-inset-right), 24px) max(env(safe-area-inset-bottom), 120px) max(env(safe-area-inset-left), 24px)' }}>
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 relative">
                <Mountain className="text-blue-500 relative z-10" size={32} />
                Ski Hub
                <span className="ml-4 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg">
                  <Activity size={10} /> V50 Ultimate Edition
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                規劃您的專屬滑雪路線，在 3D 空間中探索雪場地形。
              </p>
            </div>
            
            <div className="flex gap-4 items-center flex-wrap">
              {/* V51: Text Search Bar */}
              <div className="relative">
                <div className="flex items-center bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-full px-4 py-2 w-[300px] shadow-sm">
                  <Search size={16} className="text-[var(--text-faint)] mr-2" />
                  <input 
                    type="text" 
                    placeholder="搜尋雪場 (如: 石打丸山)..." 
                    className="bg-transparent border-none outline-none flex-1 text-sm text-[var(--text-primary)]"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowDropdown(true)
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                </div>
                {showDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-xl rounded-xl overflow-hidden z-50">
                    {SKI_RESORTS.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((resort, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleResortSelect(resort)}
                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors text-sm border-b border-[var(--border-faint)] last:border-0 flex items-center gap-3"
                      >
                        <Mountain size={14} className="text-blue-500" />
                        {resort.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* V51: Drag & Drop Area */}
              <div 
                className={`relative border-2 border-dashed rounded-xl px-4 py-2 flex items-center gap-2 transition-colors cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-blue-400 hover:text-blue-500'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file && file.type.startsWith('image/')) {
                    setMapImageUrl(URL.createObjectURL(file))
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <ImagePlus size={18} />
                <span className="text-sm font-semibold">拖曳貼上地形圖</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                  <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2"><Map size={18} /> 地形圖與路線繪製</h2>
                  </div>
                  <div className="flex-1 w-full relative">
                    {mapImageUrl ? (
                      <SkiResortMapEditor imageUrl={mapImageUrl} onSaveRoute={handleSaveRoute} center={mapCenter} />
                    ) : (
                      <div 
                        className={`absolute inset-0 m-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-colors ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-[var(--border-faint)] text-[var(--text-faint)]'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragging(false)
                          const file = e.dataTransfer.files?.[0]
                          if (file && file.type.startsWith('image/')) {
                            setMapImageUrl(URL.createObjectURL(file))
                          }
                        }}
                      >
                        <ImagePlus size={48} className="opacity-50" />
                        <div className="text-center">
                          <p className="font-bold text-lg mb-1">將圖片拖曳至此</p>
                          <p className="text-sm opacity-80">或按下 Ctrl+V 貼上雪場地形圖</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* V31-V35: AI Assistant */}
                <div className="md:col-span-1">
                  <SkiAiAssistant />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold flex items-center gap-2"><Mountain size={18} /> 3D 模擬</h2>
                  <div className="flex gap-2">
                    {savedRoute.length > 0 && isReplaying && (
                      <button
                        onClick={() => {
                          // V39: 3D Trick Simulator UI Button (Mock)
                          const el = document.getElementById('trick-toast')
                          if (el) {
                            el.style.opacity = '1'
                            el.style.transform = 'translateY(0)'
                            setTimeout(() => {
                              el.style.opacity = '0'
                              el.style.transform = 'translateY(20px)'
                            }, 2000)
                          }
                        }}
                        className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors animate-pulse"
                      >
                        <Sparkles size={14} /> 做特技！
                      </button>
                    )}
                    {savedRoute.length > 0 && (
                      <button
                        onClick={() => setIsReplaying(true)}
                        disabled={isReplaying}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Play size={14} /> 播放 3D 路線
                      </button>
                    )}
                    {savedRoute.length > 0 && (
                      <button
                        onClick={handleShareReplay}
                        className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Share2 size={14} /> 分享重播
                      </button>
                    )}
                  </div>
                </div>
                <div className="relative aspect-video bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-faint)] overflow-hidden flex flex-col items-center justify-center gap-3 text-gray-500">
                  {savedRoute.length > 0 ? (
                    <Mapbox3DTerrain 
                      routePoints={savedRoute} 
                      isReplaying={isReplaying} 
                      onReplayFinish={() => setIsReplaying(false)} 
                      center={mapCenter}
                    />
                  ) : (
                    <>
                      <Play size={32} className="opacity-50" />
                      <span className="text-sm">請先在左側畫出您的專屬路線</span>
                    </>
                  )}
                  {/* V39: Trick UI Toast */}
                  <div id="trick-toast" className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black italic px-4 py-2 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)] text-xl transition-all duration-300 opacity-0 translate-y-5 pointer-events-none z-[200]">
                    Sick 360 Spin! +500pts
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  使用 Mapbox 3D Terrain 與 Github 3D Snowboard 模型來動態播放您的自訂路線。
                </p>
              </div>

              {/* V22-V24: Route Analytics */}
              <SkiRouteAnalytics routePoints={savedRoute} />
              
              {/* V26-V30: Community & Live Features */}
              <SkiCommunityPanel />

              {/* V36-V40: Gamification Panel */}
              <SkiGamificationPanel />

              {/* V41-V45: Gear Locker */}
              <SkiGearLocker />

              {/* V46-V49: Premium Tools */}
              <SkiPremiumTools />
            </div>
          </div>
          
        </div>
      </div>
      <SkiChangelog />
    </div>
  )
}
