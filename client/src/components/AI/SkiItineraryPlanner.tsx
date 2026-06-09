import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Place, Day } from '../../types'
import { ImagePlus, Search, Sparkles, Map as MapIcon, CheckCircle2, Loader2, ArrowRight, MountainSnow, Crosshair, MapPin, Share2, Target, Play } from 'lucide-react'
import { SKI_RESORTS } from '../../data/skiResorts'
import SkiMap3D from './SkiMap3D'
import { Trail } from '../../data/iwapparaMapData'

interface SkiItineraryPlannerProps {
  skiPlaces: Place[]
  days: Day[]
}

type GeneratorState = 'idle' | 'gallery' | 'analyzing_image' | 'extracting_trails' | 'generating_3d' | 'success'

export default function SkiItineraryPlanner({ skiPlaces, days }: SkiItineraryPlannerProps) {
  const [state, setState] = useState<GeneratorState>('idle')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedResort, setSelectedResort] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Version 3: Customization states
  const [showBeginner, setShowBeginner] = useState(true)
  const [showIntermediate, setShowIntermediate] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(true)
  const [mapTheme, setMapTheme] = useState<'winter_day' | 'night_mode' | 'topographic'>('night_mode')
  
  // Version 4: Share state
  const [showShareSuccess, setShowShareSuccess] = useState(false)

  // Version 6: 3D Simulation
  const [isSimulating, setIsSimulating] = useState(false)
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null)

  useEffect(() => {
    if (state === 'analyzing_image') {
      const t1 = setTimeout(() => setState('extracting_trails'), 2500)
      return () => clearTimeout(t1)
    }
    if (state === 'extracting_trails') {
      const t2 = setTimeout(() => setState('generating_3d'), 3000)
      return () => clearTimeout(t2)
    }
    if (state === 'generating_3d') {
      const t3 = setTimeout(() => setState('success'), 3500)
      return () => clearTimeout(t3)
    }
  }, [state])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPreviewImage(url)
    setState('analyzing_image')
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [])

  const onPaste = useCallback((e: React.ClipboardEvent) => {
    const file = e.clipboardData.files?.[0]
    if (file) handleFile(file)
  }, [])

  const handleResortSelect = (resort: any) => {
    setSelectedResort(resort)
    setSearchQuery('')
    setState('gallery')
  }

  const handleGalleryImageSelect = (imageUrl: string) => {
    setPreviewImage(imageUrl)
    setState('analyzing_image')
  }

  const resetState = () => {
    setState('idle')
    setPreviewImage(null)
    setSelectedResort(null)
    setSearchQuery('')
  }

  const filteredResorts = searchQuery 
    ? SKI_RESORTS.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.kanji.includes(searchQuery))
    : []

  return (
    <div 
      className="ski-hub-container"
      style={{ 
        height: '100%', 
        color: '#fff',
        fontFamily: "'Inter', sans-serif"
      }}
      onPaste={onPaste}
    >
      <style>{`
        .ski-hub-container {
          display: flex;
          gap: 24px;
          height: 100%;
        }
        .ai-generator-panel {
          flex: 1;
          background: radial-gradient(circle at 50% -20%, #2a1b4d 0%, #050014 60%);
          border-radius: 24px;
          box-shadow: inset 0 0 100px rgba(0,0,0,0.5);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 40px;
          overflow-y: auto;
        }
        .ai-generator-panel::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
          opacity: 0.03;
          pointer-events: none;
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanner-beam {
          position: absolute;
          left: 0;
          right: 0;
          height: 150px;
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.4), transparent);
          animation: scanline 3s linear infinite;
          pointer-events: none;
          z-index: 10;
        }

        .dropzone {
          border: 2px dashed rgba(255, 255, 255, 0.15);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .dropzone:hover {
          border-color: rgba(59, 130, 246, 0.6);
          background: rgba(59, 130, 246, 0.05);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .floating-icon {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 20px 10px rgba(59, 130, 246, 0); }
        }
        .glowing-btn {
          animation: pulse-glow 2s infinite;
        }
      `}</style>

      {/* Version 5: Flex layout wrapper */}
      <div className="ai-generator-panel">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 20, zIndex: 1 }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: 10, 
          background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)',
          padding: '6px 16px', borderRadius: 99, marginBottom: 16
        }}>
          <Sparkles size={16} color="#60a5fa" />
          <span style={{ color: '#60a5fa', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>AI VISION ENABLED</span>
        </div>
        <h1 style={{ 
          fontSize: 42, fontWeight: 800, margin: 0, 
          background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          Ski Route Designer
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginTop: 12, maxWidth: 480 }}>
          貼上雪場地圖或輸入名稱，AI 將為您自動繪製 3D 滑雪路線。
        </p>
      </div>

      {state === 'idle' && (
        <div style={{ width: '100%', maxWidth: 720, zIndex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '4px 8px',
              backdropFilter: 'blur(12px)', transition: 'all 0.3s'
            }}>
              <Search size={20} color="rgba(255,255,255,0.4)" style={{ marginLeft: 12 }} />
              <input 
                type="text"
                placeholder="搜尋雪場 (例如: 岩原滑雪場)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                  flex: 1, background: 'transparent', border: 'none', color: '#fff', 
                  fontSize: 16, padding: '16px 12px', outline: 'none' 
                }}
              />
            </div>
            {searchQuery && (
              <div style={{ 
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
                background: 'rgba(15, 0, 30, 0.95)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 50
              }}>
                {filteredResorts.length > 0 ? filteredResorts.map(resort => (
                  <div 
                    key={resort.id}
                    onClick={() => handleResortSelect(resort)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', 
                      cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={20} color="#60a5fa" />
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>{resort.kanji}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>{resort.name}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>沒有找到相關雪場</div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Upload Dropzone */}
          <div 
            className="dropzone"
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              background: 'rgba(255,255,255,0.02)', borderRadius: 24, 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '60px 40px', cursor: 'pointer', backdropFilter: 'blur(12px)'
            }}
          >
            <input 
              type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="floating-icon" style={{ 
              width: 80, height: 80, borderRadius: 24, background: 'rgba(59, 130, 246, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(255,255,255,0.1)'
            }}>
              <ImagePlus size={36} color="#60a5fa" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', margin: '0 0 8px 0' }}>貼上圖片或點擊上傳</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0, textAlign: 'center' }}>
              支援 JPEG, PNG, WEBP。將自動解析雪道與纜車資訊。
            </p>
          </div>
        </div>
      )}

      {/* Gallery State */}
      {state === 'gallery' && (
        <div style={{ width: '100%', maxWidth: 900, zIndex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>選擇 {selectedResort?.kanji} 的地圖</h2>
            <button onClick={resetState} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>取消</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {[
              'https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1546939988-c70a2a4b2bce?q=80&w=600&auto=format&fit=crop'
            ].map((url, i) => (
              <div 
                key={i}
                onClick={() => handleGalleryImageSelect(url)}
                style={{ 
                  borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <img src={url} alt="Resort Map" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>
                  地圖樣式 {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing & Success States */}
      {state !== 'idle' && state !== 'gallery' && (
        <div style={{ width: '100%', maxWidth: 900, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ 
            position: 'relative', width: '100%', borderRadius: 24, overflow: 'hidden',
            background: '#000', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
          }}>
            {/* Image Preview with Effects */}
            <div style={{ position: 'relative', width: '100%', height: 400 }}>
              <img 
                src={previewImage || ''} 
                alt="Map Preview" 
                style={{ 
                  width: '100%', height: '100%', objectFit: 'cover', 
                  opacity: state === 'success' ? 0.4 : 0.8,
                  filter: state === 'success' ? 'grayscale(100%) blur(4px)' : 'none',
                  transition: 'all 1s ease'
                }} 
              />
              
              {state !== 'success' && (
                <>
                  <div className="scanner-beam" />
                  <div style={{ 
                    position: 'absolute', inset: 0, background: 'rgba(5, 0, 20, 0.4)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Crosshair size={120} color="rgba(59, 130, 246, 0.2)" strokeWidth={1} style={{ animation: 'spin 10s linear infinite' }} />
                  </div>
                </>
              )}

              {/* 3D Map Simulation Overlay for Success */}
              {state === 'success' && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <SkiMap3D 
                    showBeginner={showBeginner}
                    showIntermediate={showIntermediate}
                    showAdvanced={showAdvanced}
                    mapTheme={mapTheme}
                    isSimulating={isSimulating}
                    onTrailClick={(trail) => {
                      setSelectedTrail(trail)
                      setIsSimulating(false) // Stop previous simulation if any
                    }}
                  />
                </div>
              )}

              {/* Success UI Overlay (Pointer Events None to allow clicking trails) */}
              {state === 'success' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                   
                   {/* Top Left Status */}
                   <div style={{ 
                     position: 'absolute', top: 20, left: 20,
                     background: mapTheme === 'winter_day' ? 'rgba(255,255,255,0.8)' : 'rgba(15, 0, 30, 0.8)', 
                     backdropFilter: 'blur(12px)',
                     padding: '16px 24px', borderRadius: 20, 
                     border: `1px solid ${mapTheme === 'winter_day' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.4)'}`,
                     display: 'flex', alignItems: 'center', gap: 16,
                     boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                     color: mapTheme === 'winter_day' ? '#1e293b' : '#fff',
                     pointerEvents: 'auto'
                   }}>
                     <CheckCircle2 size={32} color="#4ade80" />
                     <div>
                       <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>解析完成</h2>
                       <p style={{ margin: '4px 0 0 0', opacity: 0.7, fontSize: 13 }}>3D 地形與路線已生成</p>
                     </div>
                   </div>

                   {/* Trail Info Panel (Shows when a trail is clicked) */}
                   {selectedTrail && (
                     <div style={{
                       position: 'absolute', bottom: 20, left: 20,
                       background: 'rgba(15, 0, 30, 0.85)', backdropFilter: 'blur(16px)',
                       padding: '20px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)',
                       color: '#fff', width: 280, pointerEvents: 'auto',
                       boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                       animation: 'fade-in 0.3s ease-out'
                     }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                         <div style={{ width: 12, height: 12, borderRadius: '50%', background: selectedTrail.color }} />
                         <span style={{ fontWeight: 700, fontSize: 16 }}>{selectedTrail.name}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, opacity: 0.7, fontSize: 13 }}>
                         <span>難度: {selectedTrail.difficulty === 'beginner' ? '初級' : selectedTrail.difficulty === 'intermediate' ? '中級' : '高級'}</span>
                       </div>
                       
                       <button onClick={() => setIsSimulating(!isSimulating)} style={{
                         width: '100%', padding: '12px', borderRadius: 8,
                         background: isSimulating ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                         border: `1px solid ${isSimulating ? 'rgba(239, 68, 68, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
                         color: isSimulating ? '#ef4444' : '#60a5fa',
                         fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                         transition: 'all 0.2s'
                       }} onMouseEnter={e => e.currentTarget.style.background = isSimulating ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'} onMouseLeave={e => e.currentTarget.style.background = isSimulating ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}>
                         {isSimulating ? '停止模擬' : <><Play size={16} /> 模擬滑行</>}
                       </button>
                     </div>
                   )}

                   {/* Customization Panel */}
                   <div style={{ 
                     position: 'absolute', right: 20, top: 20, width: 240,
                     background: 'rgba(15, 0, 30, 0.7)', backdropFilter: 'blur(16px)',
                     border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
                     padding: '16px', color: '#fff', display: 'flex', flexDirection: 'column', gap: 16,
                     boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                   }}>
                     <div style={{ pointerEvents: 'auto' }}>
                       <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>圖層顯示</div>
                       <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8, fontSize: 14 }}>
                         <input type="checkbox" checked={showBeginner} onChange={e => setShowBeginner(e.target.checked)} />
                         <span style={{ color: '#4ade80', fontWeight: 600 }}>綠線 (初級)</span>
                       </label>
                       <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8, fontSize: 14 }}>
                         <input type="checkbox" checked={showIntermediate} onChange={e => setShowIntermediate(e.target.checked)} />
                         <span style={{ color: '#ef4444', fontWeight: 600 }}>紅線 (中級)</span>
                       </label>
                       <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                         <input type="checkbox" checked={showAdvanced} onChange={e => setShowAdvanced(e.target.checked)} />
                         <span style={{ color: '#000000', textShadow: '0 0 2px rgba(255,255,255,0.5)', fontWeight: 600 }}>黑線 (高級)</span>
                       </label>
                     </div>
                     <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                     <div>
                       <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>3D 地圖風格</div>
                       <select 
                         value={mapTheme} 
                         onChange={e => setMapTheme(e.target.value as any)}
                         style={{ 
                           width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                           color: '#fff', borderRadius: 8, padding: '6px 8px', outline: 'none'
                         }}
                       >
                         <option value="winter_day" style={{ color: '#000' }}>雪境白晝 (Winter Day)</option>
                         <option value="night_mode" style={{ color: '#000' }}>極光之夜 (Night Mode)</option>
                         <option value="topographic" style={{ color: '#000' }}>等高線地形 (Topographic)</option>
                       </select>
                     </div>
                   </div>
                </div>
              )}
            </div>

            {/* Status Panel */}
            <div style={{ padding: '24px', background: 'var(--bg-card)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 40 }}>
                  <StatusItem active={state === 'analyzing_image' || state === 'extracting_trails' || state === 'generating_3d' || state === 'success'} done={state !== 'analyzing_image'} icon={<MapIcon size={18} />} label="分析地圖結構" />
                  <StatusItem active={state === 'extracting_trails' || state === 'generating_3d' || state === 'success'} done={state === 'generating_3d' || state === 'success'} icon={<Target size={18} />} label="提取雪道路線" />
                  <StatusItem active={state === 'generating_3d' || state === 'success'} done={state === 'success'} icon={<MountainSnow size={18} />} label="生成 3D 模型" />
                </div>
                
                {state === 'success' && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={resetState} style={{ 
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                      padding: '12px 24px', borderRadius: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      重新上傳
                    </button>
                    
                    <button onClick={() => {
                      setShowShareSuccess(true)
                      setTimeout(() => setShowShareSuccess(false), 2000)
                    }} style={{ 
                      background: showShareSuccess ? '#4ade80' : 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                      padding: '12px 24px', borderRadius: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: 8
                    }} onMouseEnter={e => !showShareSuccess && (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')} onMouseLeave={e => !showShareSuccess && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                      {showShareSuccess ? <><CheckCircle2 size={18} /> 已複製連結</> : <><Share2 size={18} /> 分享</>}
                    </button>

                    <button className="glowing-btn" style={{ 
                      background: '#3b82f6', border: 'none', color: '#fff',
                      padding: '12px 24px', borderRadius: 12, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                      儲存至行程 <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div> {/* End ai-generator-panel */}

      {/* Version 5: Right Panel - Modern Day Planner */}
      <div style={{ 
        width: 320, background: 'rgba(15, 0, 30, 0.4)', borderRadius: 24, 
        border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column',
        padding: '24px 20px', overflowY: 'auto'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <MountainSnow size={20} color="#60a5fa" />
          已儲存的雪道路線
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {skiPlaces.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px dashed rgba(255,255,255,0.1)' }}>
              尚未儲存任何路線
            </div>
          ) : (
            skiPlaces.map(place => (
              <div key={place.id} style={{ 
                background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'grab'
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa' }} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{place.name}</span>
              </div>
            ))
          )}
        </div>

        <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700 }}>滑雪行程安排</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {days.slice(0, 5).map(day => (
            <div key={day.id} style={{ 
              background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{day.title || `Day ${day.day_number}`}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>{day.date || '未設定日期'}</div>
              <div style={{ 
                height: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 10,
                border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.3)', fontSize: 13
              }}>
                拖曳路線至此
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function StatusItem({ active, done, icon, label }: { active: boolean, done: boolean, icon: React.ReactNode, label: string }) {
  const color = done ? '#4ade80' : active ? '#60a5fa' : 'rgba(255,255,255,0.2)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: active ? 1 : 0.5 }}>
      <div style={{ 
        width: 32, height: 32, borderRadius: '50%', background: done ? 'rgba(74, 222, 128, 0.1)' : active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        border: `1px solid ${done ? 'rgba(74, 222, 128, 0.3)' : active ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color
      }}>
        {done ? <CheckCircle2 size={16} /> : active ? <Loader2 size={16} className="animate-spin" /> : icon}
      </div>
      <span style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 14 }}>{label}</span>
    </div>
  )
}
