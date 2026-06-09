import React from 'react'
import { Place } from '../../types'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface SkiRouteVotingProps {
  place: Place
  onUpdatePlace: (placeId: number, data: any) => Promise<void> | void
}

export default function SkiRouteVoting({ place, onUpdatePlace }: SkiRouteVotingProps) {
  const user = useAuthStore(s => s.user)
  
  if (place.properties?.type !== 'ski_route') return null

  const props = place.properties as any || {}
  const votes = props.votes || { up: [], down: [] }
  
  const hasUpvoted = user && votes.up.includes(user.id)
  const hasDownvoted = user && votes.down.includes(user.id)

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) return
    
    let newUp = [...votes.up]
    let newDown = [...votes.down]

    if (type === 'up') {
      if (hasUpvoted) {
        newUp = newUp.filter(id => id !== user.id)
      } else {
        newUp.push(user.id)
        newDown = newDown.filter(id => id !== user.id)
      }
    } else {
      if (hasDownvoted) {
        newDown = newDown.filter(id => id !== user.id)
      } else {
        newDown.push(user.id)
        newUp = newUp.filter(id => id !== user.id)
      }
    }

    const newProps = {
      ...props,
      votes: { up: newUp, down: newDown }
    }

    await onUpdatePlace(place.id, { properties: newProps })
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 12, 
      marginTop: 12,
      padding: '10px 14px',
      background: 'var(--bg-secondary)',
      borderRadius: 12,
      border: '1px solid var(--border-primary)'
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
        群組投票
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
        <button 
          onClick={() => handleVote('up')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 20,
            background: hasUpvoted ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-primary)',
            color: hasUpvoted ? '#10b981' : 'var(--text-primary)',
            border: `1px solid ${hasUpvoted ? '#10b981' : 'var(--border-primary)'}`,
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
            transition: 'all 0.15s'
          }}
        >
          <ThumbsUp size={14} />
          {votes.up.length}
        </button>

        <button 
          onClick={() => handleVote('down')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 20,
            background: hasDownvoted ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-primary)',
            color: hasDownvoted ? '#ef4444' : 'var(--text-primary)',
            border: `1px solid ${hasDownvoted ? '#ef4444' : 'var(--border-primary)'}`,
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
            transition: 'all 0.15s'
          }}
        >
          <ThumbsDown size={14} />
          {votes.down.length}
        </button>
      </div>
    </div>
  )
}
