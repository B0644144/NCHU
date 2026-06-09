import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Terrain from './Terrain'
import SkiTrail from './SkiTrail'
import SkierAnimation from './SkierAnimation'
import { SKI_TRAILS, Trail } from '../../data/iwapparaMapData'

interface SkiMap3DProps {
  showBeginner?: boolean
  showIntermediate?: boolean
  showAdvanced?: boolean
  mapTheme?: 'winter_day' | 'night_mode' | 'topographic'
  isSimulating?: boolean
  onTrailClick?: (trail: Trail) => void
}

export default function SkiMap3D({ 
  showBeginner = true, 
  showIntermediate = true, 
  showAdvanced = true,
  mapTheme = 'winter_day',
  isSimulating = false,
  onTrailClick
}: SkiMap3DProps) {
  const [activeTrailId, setActiveTrailId] = useState<string | null>(null)

  const handleTrailClick = (trail: Trail) => {
    setActiveTrailId(trail.id)
    onTrailClick?.(trail)
  }

  const activeTrail = SKI_TRAILS.find(t => t.id === activeTrailId)

  return (
    <Canvas 
      camera={{ position: [0, 400, 600], fov: 60 }} 
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[mapTheme === 'night_mode' ? '#050014' : mapTheme === 'topographic' ? '#1a1a1a' : '#c8dcff']} />
      
      {/* Lighting */}
      <ambientLight intensity={mapTheme === 'night_mode' ? 0.2 : 0.6} />
      <directionalLight 
        position={[100, 500, 200]} 
        intensity={mapTheme === 'night_mode' ? 0.5 : 1.5} 
        castShadow 
      />
      {mapTheme === 'winter_day' && <Environment preset="sunset" />}

      {/* Terrain */}
      <Terrain theme={mapTheme} />

      {/* Trails */}
      {SKI_TRAILS.map(trail => {
        // Filter out based on toggles
        if (trail.difficulty === 'beginner' && !showBeginner) return null
        if (trail.difficulty === 'intermediate' && !showIntermediate) return null
        if (trail.difficulty === 'advanced' && !showAdvanced) return null

        return (
          <SkiTrail 
            key={trail.id} 
            trail={trail} 
            isActive={trail.id === activeTrailId}
            onClick={handleTrailClick}
          />
        )
      })}

      {/* Simulation */}
      {isSimulating && activeTrail && (
        <SkierAnimation trail={activeTrail} speed={1} />
      )}

      {/* Controls */}
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05} 
        maxPolarAngle={Math.PI / 2 - 0.1} // Prevent looking from below ground
        minDistance={100}
        maxDistance={1200}
      />
    </Canvas>
  )
}
