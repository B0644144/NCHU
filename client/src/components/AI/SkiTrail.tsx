import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { Trail, estimateElevation } from '../../data/iwapparaMapData'

interface SkiTrailProps {
  trail: Trail
  isActive?: boolean
  onClick?: (trail: Trail) => void
}

export default function SkiTrail({ trail, isActive = false, onClick }: SkiTrailProps) {
  // Convert 2D points into 3D world coordinates
  const points = useMemo(() => {
    return trail.points2D.map(([localX, localY]) => {
      // Get the terrain elevation at this 2D point
      const elevation = estimateElevation(localX, localY)
      
      // Because the Terrain plane is rotated -90deg on X:
      // Local X -> World X
      // Local Y -> World Z
      // Local Z (elevation) -> World Y
      // We also add a small offset to Y so the line floats slightly above the terrain to prevent Z-fighting.
      return new THREE.Vector3(localX, elevation + 5, localY)
    })
  }, [trail.points2D])

  // Create a smooth curve through the points
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points)
  }, [points])

  // Get more points for a smoother line rendering
  const linePoints = useMemo(() => {
    return curve.getPoints(50)
  }, [curve])

  const baseColor = trail.color
  const glowColor = isActive ? '#ffffff' : baseColor

  return (
    <group 
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(trail)
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Glow / Active indicator line */}
      {isActive && (
        <Line 
          points={linePoints} 
          color={glowColor} 
          lineWidth={8} 
          transparent 
          opacity={0.6} 
        />
      )}
      
      {/* Main trail line */}
      <Line 
        points={linePoints} 
        color={baseColor} 
        lineWidth={isActive ? 5 : 3} 
        transparent
        opacity={0.9}
      />
    </group>
  )
}
