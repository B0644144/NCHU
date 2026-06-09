import React from 'react'
import { Map, MapPin, Calendar, Users, TrendingUp } from 'lucide-react'
import { useTranslation } from '../../i18n'

interface DashboardTrip {
  id: number
  start_date?: string | null
  end_date?: string | null
  day_count?: number
  place_count?: number
  shared_count?: number
  [key: string]: any
}

interface DashboardStatsProps {
  trips: DashboardTrip[]
  archivedTrips: DashboardTrip[]
}

export default function DashboardStats({ trips, archivedTrips }: DashboardStatsProps): React.ReactElement {
  const { t } = useTranslation()
  const allTrips = [...trips, ...archivedTrips]
  
  const totalTrips = allTrips.length
  const totalPlaces = allTrips.reduce((acc, trip) => acc + (trip.place_count || 0), 0)
  const totalBuddies = allTrips.reduce((acc, trip) => acc + (trip.shared_count || 0), 0)
  
  const totalDays = allTrips.reduce((acc, trip) => {
    if (trip.start_date && trip.end_date) {
      const start = new Date(trip.start_date).getTime()
      const end = new Date(trip.end_date).getTime()
      return acc + Math.max(1, Math.ceil((end - start) / 86400000) + 1)
    }
    return acc + (trip.day_count || 0)
  }, 0)

  // Calculate simple timeline bars
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const tripCountsByMonth = new Array(12).fill(0)
  
  allTrips.forEach(trip => {
    if (trip.start_date) {
      const d = new Date(trip.start_date)
      if (d.getFullYear() === new Date().getFullYear() || d.getFullYear() === new Date().getFullYear() - 1) {
        tripCountsByMonth[d.getMonth()] += 1
      }
    }
  })
  
  const maxTrips = Math.max(...tripCountsByMonth, 1)

  return (
    <div className="mb-8 p-6 rounded-3xl" style={{ 
      background: 'rgba(255, 255, 255, 0.05)', 
      backdropFilter: 'blur(16px)', 
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
    }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 trek-gradient-text">
          <TrendingUp className="text-indigo-500" />
          {t('dashboard.stats.title', { defaultValue: 'Travel Overview' })}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatBlock icon={<Map size={20} />} label={t('dashboard.stats.totalTrips', { defaultValue: 'Total Trips' })} value={totalTrips} color="text-blue-500" bg="bg-blue-500/10" />
        <StatBlock icon={<Calendar size={20} />} label={t('dashboard.stats.totalDays', { defaultValue: 'Days Travelled' })} value={totalDays} color="text-indigo-500" bg="bg-indigo-500/10" />
        <StatBlock icon={<MapPin size={20} />} label={t('dashboard.stats.totalPlaces', { defaultValue: 'Places Explored' })} value={totalPlaces} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatBlock icon={<Users size={20} />} label={t('dashboard.stats.totalBuddies', { defaultValue: 'Travel Buddies' })} value={totalBuddies} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3 opacity-60" style={{ color: 'var(--text-primary)' }}>
          {t('dashboard.stats.activity', { defaultValue: 'Activity Summary' })}
        </p>
        <div className="flex items-end h-24 gap-2 w-full">
          {tripCountsByMonth.map((count, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <div 
                className="w-full rounded-t-md transition-all duration-500 ease-out relative"
                style={{ 
                  height: `${(count / maxTrips) * 100}%`, 
                  minHeight: count > 0 ? '8px' : '4px',
                  background: count > 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
                  opacity: count > 0 ? 0.8 : 0.3
                }}
              >
                {/* Tooltip */}
                {count > 0 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {count} trips
                  </div>
                )}
              </div>
              <span className="text-[9px] mt-2 opacity-50 font-medium" style={{ color: 'var(--text-primary)' }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatBlock({ icon, label, value, color, bg }: { icon: React.ReactNode, label: string, value: number, color: string, bg: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-faint)' }}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</p>
        <p className="text-xs font-medium opacity-70" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      </div>
    </div>
  )
}
