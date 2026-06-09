import React, { useState, useRef, useEffect } from 'react'
import { MapContainer, ImageOverlay, Polyline, useMapEvents, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Trash2, Undo, Check, PenTool } from 'lucide-react'

interface SkiResortMapEditorProps {
  imageUrl: string
  onSaveRoute: (routeCoordinates: [number, number][]) => void
  center?: [number, number]
}

// Leaflet bounds for the image overlay
const bounds: L.LatLngBoundsExpression = [[0, 0], [1000, 1000]]

function DrawController({
  isDrawing,
  points,
  setPoints,
}: {
  isDrawing: boolean
  points: [number, number][]
  setPoints: React.Dispatch<React.SetStateAction<[number, number][]>>
}) {
  useMapEvents({
    click(e) {
      if (!isDrawing) return
      const { lat, lng } = e.latlng
      setPoints((prev) => [...prev, [lat, lng]])
    },
  })
  return null
}

export default function SkiResortMapEditor({ imageUrl, onSaveRoute, center }: SkiResortMapEditorProps): React.ReactElement {
  const [points, setPoints] = useState<[number, number][]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  const handleUndo = () => setPoints((p) => p.slice(0, -1))
  const handleClear = () => setPoints([])

  return (
    <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-start pointer-events-none">
        <div className="flex gap-2 pointer-events-auto bg-[var(--bg-card)] p-1 rounded-xl shadow-lg border border-[var(--border-faint)] backdrop-blur-md bg-opacity-80">
          <button
            onClick={() => setIsDrawing(!isDrawing)}
            className={`p-2 flex items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors ${isDrawing ? 'bg-blue-500 text-white' : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'}`}
            title="開啟路線繪製模式"
          >
            <PenTool size={16} /> {isDrawing ? '繪製中...' : '手繪路線'}
          </button>
          {points.length > 0 && (
            <>
              <div className="w-px bg-[var(--border-primary)] my-1 mx-1" />
              <button onClick={handleUndo} className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-secondary)] transition-colors" title="復原上一筆">
                <Undo size={16} />
              </button>
              <button onClick={handleClear} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors" title="清除路線">
                <Trash2 size={16} />
              </button>
              <button onClick={() => onSaveRoute(points)} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1 pl-3" title="儲存路線">
                <Check size={16} /> 儲存
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 w-full relative z-[1]">
        <MapContainer
          center={[500, 500]}
          zoom={0}
          minZoom={-2}
          maxZoom={3}
          crs={L.CRS.Simple}
          style={{ height: '100%', width: '100%', background: 'transparent' }}
          ref={mapRef}
        >
          <ImageOverlay url={imageUrl} bounds={bounds} />
          
          <DrawController isDrawing={isDrawing} points={points} setPoints={setPoints} />

          {points.length > 0 && (
            <Polyline positions={points} pathOptions={{ color: '#ef4444', weight: 4, dashArray: '5, 10' }} />
          )}

          {points.map((p, i) => (
            <CircleMarker key={i} center={p} radius={4} pathOptions={{ color: '#ef4444', fillColor: 'white', fillOpacity: 1, weight: 2 }} />
          ))}

          {/* Start and end labels */}
          {points.length > 0 && (
            <CircleMarker center={points[0]} radius={6} pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 1 }} />
          )}
        </MapContainer>
      </div>
    </div>
  )
}
