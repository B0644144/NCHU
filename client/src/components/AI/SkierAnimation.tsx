import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Trail, estimateElevation } from '../../data/iwapparaMapData'

interface SkierAnimationProps {
  trail: Trail
  speed?: number // 0 to 1 multiplier
}

export default function SkierAnimation({ trail, speed = 1 }: SkierAnimationProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Pre-calculate the curve for the skier to follow
  const curve = useMemo(() => {
    const points = trail.points2D.map(([localX, localY]) => {
      const elevation = estimateElevation(localX, localY)
      return new THREE.Vector3(localX, elevation + 8, localY) // +8 offset so it sits on the snow
    })
    return new THREE.CatmullRomCurve3(points)
  }, [trail.points2D])

  // Use a ref to track the animation progress (0 to 1)
  const progress = useRef(0)

  // Use useFrame to animate the sphere along the curve
  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Calculate dynamic speed based on difficulty or slope
    // For simplicity, we just use a constant base speed modified by the prop
    let baseSpeed = 0.1 * speed
    
    // Slight speed bump for black courses to simulate faster sliding
    if (trail.difficulty === 'advanced') baseSpeed *= 1.5
    if (trail.difficulty === 'beginner') baseSpeed *= 0.7

    progress.current += delta * baseSpeed

    // Reset progress when it reaches the end
    if (progress.current > 1) {
      progress.current = 0
    }

    // Get the position on the curve at the current progress
    const position = curve.getPointAt(progress.current)
    meshRef.current.position.copy(position)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[8, 16, 16]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      
      {/* Add a tiny point light to make the skier glow */}
      <pointLight color="#fbbf24" intensity={2} distance={50} />
    </mesh>
  )
}
