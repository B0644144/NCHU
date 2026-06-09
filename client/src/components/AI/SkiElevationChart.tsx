import React, { useMemo, useState } from 'react'
import { Place } from '../../types'
import { Mountain } from 'lucide-react'

interface SkiElevationChartProps {
  place: Place
}

export default function SkiElevationChart({ place }: SkiElevationChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, elev: number, dist: number } | null>(null)

  const { points, maxElev, minElev, totalDist } = useMemo(() => {
    if (!place.route_geometry) return { points: [], maxElev: 0, minElev: 0, totalDist: 0 }
    try {
      const data = JSON.parse(place.route_geometry)
      let coords: [number, number][] = []
      
      if (data.type === 'FeatureCollection') {
        data.features.forEach((f: any) => {
          if (f.geometry?.type === 'LineString') {
            coords.push(...f.geometry.coordinates)
          }
        })
      } else if (data.type === 'LineString') {
        coords = data.coordinates
      }

      if (coords.length < 2) return { points: [], maxElev: 0, minElev: 0, totalDist: 0 }

      // Generate mock elevation data based on coordinates and index (ski routes go downhill usually)
      let currentElev = 2500 + Math.sin(coords[0][0] * 100) * 500
      let dist = 0
      
      const pts = coords.map((c, i) => {
        if (i > 0) {
          const dx = c[0] - coords[i-1][0]
          const dy = c[1] - coords[i-1][1]
          dist += Math.sqrt(dx * dx + dy * dy) * 111 // rough km
        }
        
        // Downhill slope with some bumps
        if (i > 0) {
          currentElev -= (Math.random() * 20 + 5)
        }
        
        return {
          dist,
          elev: Math.max(800, currentElev)
        }
      })

      const elevs = pts.map(p => p.elev)
      return {
        points: pts,
        maxElev: Math.max(...elevs) + 100,
        minElev: Math.min(...elevs) - 100,
        totalDist: dist
      }
    } catch {
      return { points: [], maxElev: 0, minElev: 0, totalDist: 0 }
    }
  }, [place.route_geometry])

  if (points.length === 0) return null

  const width = 300
  const height = 100
  const padding = { top: 10, right: 10, bottom: 20, left: 35 }

  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const getX = (d: number) => padding.left + (d / totalDist) * innerW
  const getY = (e: number) => padding.top + innerH - ((e - minElev) / (maxElev - minElev)) * innerH

  const pathD = `M ${getX(points[0].dist)} ${getY(points[0].elev)} ` + 
    points.slice(1).map(p => `L ${getX(p.dist)} ${getY(p.elev)}`).join(' ')
    
  const areaD = `${pathD} L ${getX(points[points.length-1].dist)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`

  return (
    <div style={{
      marginTop: 12,
      padding: '12px 14px',
      background: 'var(--bg-secondary)',
      borderRadius: 12,
      border: '1px solid var(--border-primary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--text-secondary)' }}>
        <Mountain size={14} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>海拔高度剖面圖</span>
        <span style={{ fontSize: 11, marginLeft: 'auto', background: 'var(--bg-hover)', padding: '2px 8px', borderRadius: 10 }}>
          {totalDist.toFixed(1)} km
        </span>
      </div>

      <div 
        style={{ position: 'relative', width: '100%', height: height }}
        onMouseLeave={() => setHoveredPoint(null)}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          if (x < padding.left || x > width - padding.right) {
            setHoveredPoint(null)
            return
          }
          const distAtX = ((x - padding.left) / innerW) * totalDist
          // Find closest point
          const closest = points.reduce((prev, curr) => 
            Math.abs(curr.dist - distAtX) < Math.abs(prev.dist - distAtX) ? curr : prev
          )
          setHoveredPoint({
            x: getX(closest.dist),
            y: getY(closest.elev),
            elev: closest.elev,
            dist: closest.dist
          })
        }}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="var(--border-faint)" strokeDasharray="3 3" />
          <line x1={padding.left} y1={padding.top + innerH/2} x2={width - padding.right} y2={padding.top + innerH/2} stroke="var(--border-faint)" strokeDasharray="3 3" />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="var(--border-primary)" />

          {/* Y Axis labels */}
          <text x={padding.left - 5} y={padding.top + 4} fontSize="9" fill="var(--text-faint)" textAnchor="end">{Math.round(maxElev)}m</text>
          <text x={padding.left - 5} y={height - padding.bottom} fontSize="9" fill="var(--text-faint)" textAnchor="end">{Math.round(minElev)}m</text>

          {/* Area */}
          <path d={areaD} fill="rgba(59, 130, 246, 0.1)" />
          {/* Line */}
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Hover effects */}
          {hoveredPoint && (
            <>
              <line x1={hoveredPoint.x} y1={padding.top} x2={hoveredPoint.x} y2={height - padding.bottom} stroke="#9ca3af" strokeDasharray="2 2" />
              <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
            </>
          )}
        </svg>

        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            left: hoveredPoint.x,
            top: 0,
            transform: 'translateX(-50%) translateY(-100%)',
            background: '#111827',
            color: 'white',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 10
          }}>
            {Math.round(hoveredPoint.elev)} m
          </div>
        )}
      </div>
    </div>
  )
}
