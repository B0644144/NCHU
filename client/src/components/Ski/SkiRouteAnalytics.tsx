import React from 'react'
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react'

interface RouteAnalyticsProps {
  routePoints: [number, number][]
}

export default function SkiRouteAnalytics({ routePoints }: RouteAnalyticsProps) {
  if (routePoints.length < 2) return null

  // Mock calculations based on points
  const pointsCount = routePoints.length
  const estimatedLengthMeters = pointsCount * 45 // mock 45m per point
  const dropMeters = pointsCount * 12 // mock 12m drop per point
  
  // Speed & Time Estimation (V23)
  const averageSpeedKmh = 35
  const estimatedTimeMins = Math.max(1, Math.round((estimatedLengthMeters / 1000) / averageSpeedKmh * 60))

  // Difficulty Color Coding (V24)
  let difficulty = '🟢 Green (Beginner)'
  let colorClass = 'text-green-500 bg-green-500/10 border-green-500/20'
  
  if (dropMeters / estimatedLengthMeters > 0.35) {
    difficulty = '⚫ Black (Expert)'
    colorClass = 'text-gray-900 dark:text-white bg-gray-500/10 border-gray-500/20'
  } else if (dropMeters / estimatedLengthMeters > 0.2) {
    difficulty = '🔴 Red (Intermediate)'
    colorClass = 'text-red-500 bg-red-500/10 border-red-500/20'
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-sm p-4 space-y-4">
      <h2 className="font-bold flex items-center gap-2"><TrendingUp size={18} /> 路線數據分析 (V22-V24)</h2>
      
      <div className={`px-3 py-2 rounded-lg border text-sm font-bold flex items-center justify-center ${colorClass}`}>
        難度預測：{difficulty}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-faint)]">
          <div className="text-xs text-[var(--text-faint)] mb-1 flex items-center gap-1">
            <TrendingUp size={12} /> 預估長度
          </div>
          <div className="text-lg font-extrabold">{estimatedLengthMeters.toLocaleString()} <span className="text-sm font-normal">m</span></div>
        </div>
        <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-faint)]">
          <div className="text-xs text-[var(--text-faint)] mb-1 flex items-center gap-1">
            <AlertTriangle size={12} /> 垂直落差
          </div>
          <div className="text-lg font-extrabold">{dropMeters.toLocaleString()} <span className="text-sm font-normal">m</span></div>
        </div>
        <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-faint)] col-span-2">
          <div className="text-xs text-[var(--text-faint)] mb-1 flex items-center gap-1">
            <Clock size={12} /> 預估滑行時間 (@ {averageSpeedKmh}km/h)
          </div>
          <div className="text-lg font-extrabold">{estimatedTimeMins} <span className="text-sm font-normal">分鐘</span></div>
        </div>
      </div>
      
      {/* V22 Mock Elevation Profile Chart */}
      <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
        <div className="text-xs text-[var(--text-faint)] mb-2">海拔剖面圖 (Elevation Profile)</div>
        <div className="h-20 w-full flex items-end gap-1 opacity-80">
          {routePoints.map((_, i) => {
            const h = Math.max(10, 100 - (i * (100 / pointsCount)))
            return (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-500 rounded-t-sm transition-all"
                style={{ height: `${h}%` }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
