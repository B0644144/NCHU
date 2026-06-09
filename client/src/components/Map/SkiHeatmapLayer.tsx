import React, { useEffect, useState } from 'react'
import { CircleMarker, Tooltip, Polyline } from 'react-leaflet'
import { Place } from '../../types'

interface SkiHeatmapLayerProps {
  places: Place[]
  timeOfDay: number // 8 to 17 (8 AM to 5 PM)
}

function getCrowdLevel(lat: number, lng: number, timeOfDay: number) {
  // Simulate crowd level based on coordinates and time
  const peakTime = 12 // 12 PM is peak
  const timeDiff = Math.abs(timeOfDay - peakTime)
  
  // Base crowd level drops as we move away from peak time
  let crowd = 100 - (timeDiff * 15)
  
  // Add some pseudo-randomness based on coords
  const randomFactor = (Math.sin(lat * lng * 10000) * 0.5 + 0.5) * 40
  crowd = Math.max(10, Math.min(100, crowd - 20 + randomFactor))
  
  return crowd
}

function getCrowdColor(level: number) {
  if (level > 80) return '#dc2626' // Red - Very crowded
  if (level > 50) return '#f59e0b' // Orange - Moderate
  return '#10b981' // Green - Clear
}

export default function SkiHeatmapLayer({ places, timeOfDay }: SkiHeatmapLayerProps) {
  const skiPlaces = places.filter(p => p.properties?.type === 'ski_route' && p.route_geometry)
  
  if (skiPlaces.length === 0) return null

  return (
    <>
      {skiPlaces.map(place => {
        let routeData: any = null
        try {
          routeData = JSON.parse(place.route_geometry || '')
        } catch { return null }

        if (routeData.type !== 'FeatureCollection') return null

        return routeData.features.map((feature: any, index: number) => {
          if (feature.geometry?.type !== 'LineString') return null
          
          const coords = feature.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number])
          if (coords.length === 0) return null

          // Let's assume the start of the linestring is a lift queue
          const startCoord = coords[0]
          const crowdLevel = getCrowdLevel(startCoord[0], startCoord[1], timeOfDay)
          const color = getCrowdColor(crowdLevel)
          
          return (
            <React.Fragment key={`heatmap-${place.id}-${index}`}>
              <Polyline positions={coords} pathOptions={{ color, weight: 6, opacity: 0.4 }} />
              <CircleMarker 
                center={startCoord} 
                radius={crowdLevel / 5 + 5} 
                pathOptions={{ 
                  fillColor: color, 
                  color: color, 
                  fillOpacity: 0.6, 
                  weight: 2 
                }}
              >
                <Tooltip sticky>
                  <div style={{ padding: '2px 4px', fontSize: 13, fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                      預估等待時間
                    </div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2, paddingLeft: 16 }}>
                      {Math.round(crowdLevel / 3)} 分鐘 (擁擠度: {Math.round(crowdLevel)}%)
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            </React.Fragment>
          )
        })
      })}
    </>
  )
}
