import React from 'react'
import { Polyline, Tooltip } from 'react-leaflet'
import { Place } from '../../types'

interface SkiRouteLayerProps {
  place: Place
}

export default function SkiRouteLayer({ place }: SkiRouteLayerProps) {
  if (!place.route_geometry) return null
  if (place.properties?.type !== 'ski_route') return null

  let routeData: any = null
  try {
    routeData = JSON.parse(place.route_geometry)
  } catch (e) {
    return null
  }

  // Handle FeatureCollection with segments
  if (routeData.type === 'FeatureCollection' && Array.isArray(routeData.features)) {
    return (
      <>
        {routeData.features.map((feature: any, index: number) => {
          if (feature.geometry?.type !== 'LineString') return null
          
          const coords = feature.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number])
          const color = feature.properties?.color || '#3b82f6'
          const label = feature.properties?.label || '滑雪路線'
          const time = feature.properties?.time || ''

          return (
            <Polyline 
              key={`segment-${index}`}
              positions={coords} 
              pathOptions={{ 
                color, 
                weight: 5, 
                opacity: 0.8,
                dashArray: feature.properties?.dashed ? '10, 10' : undefined 
              }}
            >
              <Tooltip sticky>
                <div style={{ padding: '2px 4px', fontSize: 13, fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    {label}
                  </div>
                  {time && <div style={{ fontSize: 11, color: '#666', marginTop: 2, paddingLeft: 16 }}>預估時間: {time}</div>}
                </div>
              </Tooltip>
            </Polyline>
          )
        })}
      </>
    )
  }

  // Fallback for simple LineString
  if (routeData.type === 'LineString' && Array.isArray(routeData.coordinates)) {
    const coords = routeData.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number])
    return (
      <Polyline positions={coords} pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.8 }}>
        <Tooltip sticky>AI 滑雪路線</Tooltip>
      </Polyline>
    )
  }

  return null
}
