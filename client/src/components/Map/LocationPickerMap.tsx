import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface LocationPickerMapProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
  centerCoords?: { lat: number; lng: number }
}

function MapEvents({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

function MapUpdater({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap()
  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 15))
    }
  }, [lat, lng, map])
  return null
}

export default function LocationPickerMap({ lat, lng, onChange, centerCoords }: LocationPickerMapProps) {
  const [initialCenter] = useState<[number, number]>(() => {
    if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) return [lat, lng]
    if (centerCoords && !isNaN(centerCoords.lat) && !isNaN(centerCoords.lng)) return [centerCoords.lat, centerCoords.lng]
    return [25.0330, 121.5654] // Default
  })

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-primary)', position: 'relative', zIndex: 10 }}>
      <MapContainer center={initialCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat != null && lng != null && !isNaN(lat) && !isNaN(lng) && (
          <Marker position={[lat, lng]} />
        )}
        <MapEvents onChange={onChange} />
        <MapUpdater lat={lat} lng={lng} />
      </MapContainer>
    </div>
  )
}
