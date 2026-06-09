import React, { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'

interface SkiRoutePreviewMapProps {
  routeGeometry: string
  onChange: (newGeometry: string) => void
}

export default function SkiRoutePreviewMap({ routeGeometry, onChange }: SkiRoutePreviewMapProps) {
  const [data, setData] = useState(() => JSON.parse(routeGeometry))

  const handleDragEnd = (featureIndex: number, coordIndex: number, newPos: L.LatLng) => {
    const newData = JSON.parse(JSON.stringify(data))
    const feature = newData.features[featureIndex]
    feature.geometry.coordinates[coordIndex] = [newPos.lng, newPos.lat]
    
    // If this is the last coordinate of a segment and the next segment starts here, update that too
    if (coordIndex === feature.geometry.coordinates.length - 1 && newData.features[featureIndex + 1]) {
      newData.features[featureIndex + 1].geometry.coordinates[0] = [newPos.lng, newPos.lat]
    }
    // If this is the first coordinate of a segment and the previous segment ends here, update that too
    if (coordIndex === 0 && newData.features[featureIndex - 1]) {
      const prevLen = newData.features[featureIndex - 1].geometry.coordinates.length
      newData.features[featureIndex - 1].geometry.coordinates[prevLen - 1] = [newPos.lng, newPos.lat]
    }

    setData(newData)
    onChange(JSON.stringify(newData))
  }

  const bounds = useMemo(() => {
    const coords: [number, number][] = []
    if (data.type === 'FeatureCollection') {
      data.features.forEach((f: any) => {
        if (f.geometry?.type === 'LineString') {
          f.geometry.coordinates.forEach((c: number[]) => coords.push([c[1], c[0]]))
        }
      })
    }
    if (coords.length > 0) return L.latLngBounds(coords)
    return L.latLngBounds([0, 0], [0, 0])
  }, [data])

  const dotIcon = L.divIcon({
    className: 'custom-dot-icon',
    html: `<div style="width: 12px; height: 12px; background: white; border: 3px solid #111827; border-radius: 50%; cursor: grab;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  })

  return (
    <div style={{ height: 300, width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
      <MapContainer bounds={bounds} zoomControl={false} style={{ height: '100%', width: '100%', background: '#e5e7eb' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <TileLayer url="https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png" opacity={0.6} />
        
        {data.type === 'FeatureCollection' && data.features.map((feature: any, fIdx: number) => {
          if (feature.geometry?.type !== 'LineString') return null
          const coords = feature.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number])
          const color = feature.properties?.color || '#3b82f6'
          
          return (
            <React.Fragment key={`feat-${fIdx}`}>
              <Polyline positions={coords} pathOptions={{ color, weight: 4, opacity: 0.8 }} />
              {coords.map((c: [number, number], cIdx: number) => (
                <Marker 
                  key={`marker-${fIdx}-${cIdx}`} 
                  position={c} 
                  icon={dotIcon}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => handleDragEnd(fIdx, cIdx, e.target.getLatLng())
                  }}
                />
              ))}
            </React.Fragment>
          )
        })}
      </MapContainer>
    </div>
  )
}
