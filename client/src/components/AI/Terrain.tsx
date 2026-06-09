import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { estimateElevation, TERRAIN_CONFIG } from '../../data/iwapparaMapData'

interface TerrainProps {
  theme?: 'winter_day' | 'night_mode' | 'topographic'
}

export default function Terrain({ theme = 'winter_day' }: TerrainProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      TERRAIN_CONFIG.width,
      TERRAIN_CONFIG.height,
      TERRAIN_CONFIG.widthSegments,
      TERRAIN_CONFIG.heightSegments
    )

    // Modify vertices to create mountain elevation
    const positionAttribute = geo.attributes.position
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i)
      const y = positionAttribute.getY(i)
      // Z is up in PlaneGeometry when un-rotated, but usually we rotate the plane -90deg on X axis.
      // So the local Z becomes world Y (up).
      const z = estimateElevation(x, y)
      positionAttribute.setZ(i, z)
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  const material = useMemo(() => {
    if (theme === 'topographic') {
      return new THREE.MeshStandardMaterial({
        color: '#2a2a2a',
        wireframe: true,
        roughness: 0.8,
      })
    }
    
    if (theme === 'night_mode') {
      return new THREE.MeshStandardMaterial({
        color: '#0a192f',
        roughness: 0.9,
        metalness: 0.1,
      })
    }

    // Default winter_day
    return new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.8,
      metalness: 0.1,
    })
  }, [theme])

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry} 
      material={material} 
      rotation={[-Math.PI / 2, 0, 0]} // Rotate to lay flat
      receiveShadow
    />
  )
}
