import React, { useEffect, useState } from 'react'
import { Place } from '../../types'
import { ThermometerSnowflake, MountainSnow, Navigation } from 'lucide-react'
import { apiClient } from '../../api/client'

interface SkiConditions {
  snowDepthCm: number
  openLifts: string
  temp: number
  updatedAt: string
}

interface SkiConditionBadgesProps {
  place: Place
}

export default function SkiConditionBadges({ place }: SkiConditionBadgesProps) {
  const [conditions, setConditions] = useState<SkiConditions | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (place.properties?.type !== 'ski_route' || !place.lat || !place.lng) return

    let isMounted = true
    const fetchConditions = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get(`/ski/conditions?lat=${place.lat}&lng=${place.lng}`)
        if (isMounted) setConditions(res.data)
      } catch (err) {
        console.error('Failed to fetch ski conditions', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchConditions()
    return () => { isMounted = false }
  }, [place.lat, place.lng, place.properties?.type])

  if (place.properties?.type !== 'ski_route') return null
  if (loading || !conditions) return null

  return (
    <div style={{ 
      display: 'flex', 
      gap: 8, 
      marginTop: 8, 
      flexWrap: 'wrap' 
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 6, 
        padding: '4px 10px', 
        background: 'rgba(59, 130, 246, 0.1)', 
        color: '#3b82f6', 
        borderRadius: 20, 
        fontSize: 12, 
        fontWeight: 600 
      }}>
        <ThermometerSnowflake size={14} />
        {conditions.temp > 0 ? `+${conditions.temp}` : conditions.temp}°C
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 6, 
        padding: '4px 10px', 
        background: 'rgba(16, 185, 129, 0.1)', 
        color: '#10b981', 
        borderRadius: 20, 
        fontSize: 12, 
        fontWeight: 600 
      }}>
        <MountainSnow size={14} />
        積雪 {conditions.snowDepthCm} cm
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 6, 
        padding: '4px 10px', 
        background: 'rgba(245, 158, 11, 0.1)', 
        color: '#f59e0b', 
        borderRadius: 20, 
        fontSize: 12, 
        fontWeight: 600 
      }}>
        <Navigation size={14} />
        纜車開放數 {conditions.openLifts}
      </div>
    </div>
  )
}
