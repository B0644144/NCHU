import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Mapbox3DTerrainProps {
  routePoints?: [number, number][]
  center?: [number, number] // [lng, lat]
  isReplaying?: boolean
  onReplayFinish?: () => void
  showWeather?: boolean // V25
  showLifts?: boolean // V21
}

export default function Mapbox3DTerrain({ 
  routePoints, center = [138.8090, 36.9537], isReplaying, onReplayFinish, showWeather = true, showLifts = true 
}: Mapbox3DTerrainProps): React.ReactElement {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const animationFrameRef = useRef<number>()
  const routeCoordsRef = useRef<number[][]>([])

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVtbyIsImEiOiJja3AzeTc0YTIwM3RnMm9xcTdzMjVxbHhmIn0.demotoken'
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: center,
      zoom: 14,
      pitch: 65,
      bearing: 0,
      antialias: true
    })

    mapRef.current = map

    map.on('style.load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      })
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

      // Add a sky layer for a more realistic 3D effect
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      })

      // Add a 3D model source (using a placeholder generic snowboarder model URL)
      // Since we don't have a local GLTF, we use a remote open source one or simple placeholder
      // For demonstration in Mapbox v3:
      map.addModel('snowboarder-model', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Embedded/Duck.gltf')

      // V21: Mock 3D Lift Infrastructure
      if (showLifts) {
        map.addSource('mock-lift', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [center[0] - 0.005, center[1] - 0.005],
                [center[0] + 0.005, center[1] + 0.005]
              ]
            }
          }
        })
        map.addLayer({
          id: 'mock-lift-line',
          type: 'line',
          source: 'mock-lift',
          paint: {
            'line-color': '#000000',
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        })
      }

      setMapLoaded(true)
    })

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      map.remove()
    }
  }, [])

  // V51: Fly to center when it changes
  useEffect(() => {
    if (mapRef.current && mapLoaded && center) {
      mapRef.current.flyTo({
        center: center,
        zoom: 14,
        pitch: 65,
        bearing: 0,
        duration: 2500
      })
    }
  }, [center, mapLoaded])

  // Draw Route
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded || !routePoints || routePoints.length === 0) return

    // Route points are expected to be normalized [lat, lng] from [0, 1000] space.
    // Let's project them near the center
    const originLng = center[0]
    const originLat = center[1]
    
    const geoJsonCoordinates = routePoints.map(([y, x]) => {
      // Very basic normalization and projection to real coords (mock scaling)
      const scale = 0.00005
      const lngOffset = (x - 500) * scale
      const latOffset = (500 - y) * scale // Y is flipped
      return [originLng + lngOffset, originLat + latOffset]
    })

    const sourceId = 'custom-ski-route'
    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: geoJsonCoordinates
        }
      })
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: geoJsonCoordinates
          }
        }
      })

      map.addLayer({
        id: 'ski-route-line',
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#ef4444',
          'line-width': 8,
          'line-opacity': 0.8
        }
      })

      // Add the 3D model layer
      map.addLayer({
        id: 'snowboarder-layer',
        type: 'model',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: geoJsonCoordinates[0]
            },
            properties: {}
          }
        },
        layout: {
          'model-id': 'snowboarder-model'
        },
        paint: {
          'model-scale': [100, 100, 100],
          'model-rotation': [0, 0, 90],
          'model-color': '#ffffff'
        }
      })
    }

    routeCoordsRef.current = geoJsonCoordinates

    // Adjust camera to fit the route
    if (geoJsonCoordinates.length > 0 && !isReplaying) {
      map.flyTo({
        center: geoJsonCoordinates[0] as [number, number],
        zoom: 15,
        pitch: 60,
        bearing: -45,
        duration: 2000
      })
    }
  }, [routePoints, mapLoaded])

  // Animation Replay logic
  useEffect(() => {
    if (!isReplaying || !mapRef.current || !mapLoaded || routeCoordsRef.current.length < 2) return

    const map = mapRef.current
    const coords = routeCoordsRef.current
    let startTime: number | null = null
    const duration = 5000 // 5 seconds ride

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / duration

      if (progress >= 1) {
        if (onReplayFinish) onReplayFinish()
        return
      }

      // Calculate current position along the line
      const currentIndex = progress * (coords.length - 1)
      const lowerIndex = Math.floor(currentIndex)
      const upperIndex = Math.ceil(currentIndex)
      const weight = currentIndex - lowerIndex

      const lowerCoord = coords[lowerIndex]
      const upperCoord = coords[upperIndex]

      if (lowerCoord && upperCoord) {
        const currentLng = lowerCoord[0] + (upperCoord[0] - lowerCoord[0]) * weight
        const currentLat = lowerCoord[1] + (upperCoord[1] - lowerCoord[1]) * weight

        // Update model position
        const source = map.getSource('snowboarder-layer')
        if (source && 'setData' in source) {
          (source as mapboxgl.GeoJSONSource).setData({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [currentLng, currentLat]
            },
            properties: {}
          })
        }

        // Camera follow
        map.easeTo({
          center: [currentLng, currentLat],
          zoom: 16,
          pitch: 75,
          duration: 0, // Frame by frame
          easing: (t) => t
        })
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isReplaying, mapLoaded])

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      {/* V25: 3D Weather Integration (Particles) */}
      {showWeather && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 20%)' }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-80"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: -10 + 'px',
                animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
                animationDelay: `-${Math.random() * 5}s`
              }}
            />
          ))}
          <style>{`
            @keyframes fall {
              to { transform: translateY(100vh) translateX(${Math.random() * 50 - 25}px); opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
