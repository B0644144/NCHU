import { useState, useRef, useEffect } from 'react'
import Modal from '../shared/Modal'
import { Upload, Map as MapIcon, Loader2, Check } from 'lucide-react'
import apiClient from '../../api/client'
import { useTranslation } from '../../i18n'
import { useToast } from '../shared/Toast'
import { useTripStore } from '../../store/tripStore'
import { SKI_RESORTS, SkiResort } from '../../data/skiResorts'
import SkiRoutePreviewMap from './SkiRoutePreviewMap'

interface SkiRouteGeneratorProps {
  tripId: number
  isOpen: boolean
  onClose: () => void
}

export default function SkiRouteGenerator({ tripId, isOpen, onClose }: SkiRouteGeneratorProps) {
  const { t } = useTranslation()
  const toast = useToast()
  const { addPlace } = useTripStore()
  
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedResort, setSelectedResort] = useState<SkiResort | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [generatedRoute, setGeneratedRoute] = useState<any>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredResorts = SKI_RESORTS.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.kanji.includes(searchQuery) ||
    r.region.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const objectUrl = URL.createObjectURL(f)
    setPreviewUrl(objectUrl)
  }

  const handleSubmit = async () => {
    if (!file) return
    setIsProcessing(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('tripId', String(tripId))

      const res = await apiClient.post('/ai/ski-route', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const { route } = res.data
      setGeneratedRoute(route)
    } catch (err) {
      toast.error(t('common.error') || 'Failed to analyze ski map')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmRoute = async () => {
    if (!generatedRoute) return
    setIsProcessing(true)
    try {
      await addPlace(tripId, {
        name: selectedResort ? selectedResort.name : generatedRoute.name,
        description: selectedResort ? `${selectedResort.kanji} (${selectedResort.region}) - ${generatedRoute.description}` : generatedRoute.description,
        lat: selectedResort ? selectedResort.lat : (generatedRoute.coordinates?.[0]?.[1] || null),
        lng: selectedResort ? selectedResort.lng : (generatedRoute.coordinates?.[0]?.[0] || null),
        website: selectedResort ? selectedResort.website : null,
        category_id: generatedRoute.category_id,
        route_geometry: generatedRoute.route_geometry,
        properties: { ai_generated: true, type: 'ski_route', resort_id: selectedResort?.id }
      })

      toast.success(t('ai.skiRouteGenerated') || 'Ski route saved successfully!')
      onClose()
      setGeneratedRoute(null)
      setFile(null)
      setPreviewUrl(null)
    } catch (err) {
      toast.error(t('common.error') || 'Failed to save route')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏂 AI Ski Route Planner" size="md">
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 20,
        background: 'linear-gradient(to bottom, rgba(224, 242, 254, 0.1), transparent)',
        borderRadius: 12
      }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          上傳滑雪場地圖照片。我們的 Vision AI 將分析雪道、纜車與難易度，為您規劃最佳滑雪路線。
        </p>
        
        {generatedRoute ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>預覽路線</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              若有需要，您可以拖曳節點來微調路線。
            </p>
            <SkiRoutePreviewMap 
              routeGeometry={generatedRoute.route_geometry} 
              onChange={(geo) => setGeneratedRoute({ ...generatedRoute, route_geometry: geo })}
            />
          </div>
        ) : (
          <>
            {/* Resort Search */}
            <div ref={searchContainerRef} style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                1. 選擇滑雪場（選填）
              </label>
              <input 
                type="text" 
                placeholder="搜尋日本滑雪場（如：新雪谷、白馬）..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedResort(null)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: 10, 
                  border: '1px solid var(--border-primary)', 
                  background: 'var(--bg-primary)',
                  fontSize: 14,
                  outline: 'none'
                }}
              />
              {showDropdown && searchQuery && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  right: 0, 
                  marginTop: 4, 
                  background: 'var(--bg-elevated)', 
                  border: '1px solid var(--border-primary)', 
                  borderRadius: 10, 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 50,
                  maxHeight: 200,
                  overflowY: 'auto'
                }}>
                  {filteredResorts.length > 0 ? filteredResorts.map(resort => (
                    <div 
                      key={resort.id} 
                      onClick={() => {
                        setSelectedResort(resort)
                        setSearchQuery(`${resort.name} (${resort.kanji})`)
                        setShowDropdown(false)
                      }}
                      style={{ 
                        padding: '10px 14px', 
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-faint)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{resort.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{resort.kanji} • {resort.region}</span>
                    </div>
                  )) : (
                    <div style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text-faint)' }}>找不到符合的滑雪場</div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                2. 上傳雪場地圖
              </label>
              <div 
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                style={{ 
                  border: '2px dashed var(--border-primary)', 
                  borderRadius: 16, 
                  padding: 30, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: isProcessing ? 'default' : 'pointer',
                  background: file ? 'rgba(255,255,255,0.05)' : 'rgba(224, 242, 254, 0.05)',
                  transition: 'background 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="地圖預覽" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8 }} />
                    {!isProcessing && (
                      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-faint)' }}>點擊以更換圖片</div>
                    )}
                  </>
                ) : (
                  <>
                    <MapIcon size={32} style={{ color: 'var(--text-faint)', marginBottom: 12 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>選擇地圖圖片</div>
                    <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>支援 JPEG, PNG 格式，最大 5MB</div>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <button 
            onClick={() => {
              if (generatedRoute) {
                setGeneratedRoute(null)
              } else {
                onClose()
              }
            }}
            disabled={isProcessing}
            style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-primary)', background: 'transparent', cursor: isProcessing ? 'default' : 'pointer', color: 'var(--text-secondary)' }}
          >
            {generatedRoute ? '上一步' : '取消'}
          </button>
          {generatedRoute ? (
            <button 
              onClick={handleConfirmRoute}
              disabled={isProcessing}
              style={{ 
                padding: '8px 20px', 
                borderRadius: 10, 
                border: 'none', 
                background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', 
                color: '#fff', 
                fontWeight: 600,
                cursor: isProcessing ? 'default' : 'pointer',
                opacity: isProcessing ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
              }}
            >
              {isProcessing ? <><Loader2 size={16} className="animate-spin" /> 儲存中...</> : <><Check size={16} /> 確認路線</>}
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={!file || isProcessing}
              style={{ 
                padding: '8px 20px', 
                borderRadius: 10, 
                border: 'none', 
                background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', 
                color: '#fff', 
                fontWeight: 600,
                cursor: (!file || isProcessing) ? 'default' : 'pointer',
                opacity: (!file || isProcessing) ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
              }}
            >
              {isProcessing ? (
                <><Loader2 size={16} className="animate-spin" /> 分析中...</>
              ) : (
                <><Upload size={16} /> 開始分析</>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
