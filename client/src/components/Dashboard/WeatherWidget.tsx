import React, { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Snowflake, CloudLightning, CloudDrizzle, CloudFog } from 'lucide-react'
import { useTranslation } from '../../i18n'
import { useTripStore } from '../../store/tripStore'

function getWeatherIcon(code: number) {
  if (code === 0) return <Sun size={20} className="text-amber-500" />
  if (code >= 1 && code <= 3) return <Cloud size={20} className="text-gray-400" />
  if (code >= 45 && code <= 48) return <CloudFog size={20} className="text-gray-400" />
  if (code >= 51 && code <= 57) return <CloudDrizzle size={20} className="text-blue-400" />
  if (code >= 61 && code <= 67) return <CloudRain size={20} className="text-blue-500" />
  if (code >= 71 && code <= 77) return <Snowflake size={20} className="text-blue-300" />
  if (code >= 80 && code <= 82) return <CloudRain size={20} className="text-blue-600" />
  if (code >= 85 && code <= 86) return <Snowflake size={20} className="text-blue-300" />
  if (code >= 95 && code <= 99) return <CloudLightning size={20} className="text-purple-500" />
  return <Cloud size={20} className="text-gray-400" />
}

function getWeatherDesc(code: number, t: any) {
  // basic descriptions mapping
  if (code === 0) return t('weather.clear') || 'Clear sky'
  if (code >= 1 && code <= 3) return t('weather.cloudy') || 'Partly cloudy'
  if (code >= 45 && code <= 48) return t('weather.fog') || 'Fog'
  if (code >= 51 && code <= 67) return t('weather.rain') || 'Rain'
  if (code >= 71 && code <= 77) return t('weather.snow') || 'Snow'
  if (code >= 80 && code <= 82) return t('weather.showers') || 'Rain showers'
  if (code >= 95 && code <= 99) return t('weather.thunderstorm') || 'Thunderstorm'
  return 'Unknown'
}

export default function WeatherWidget() {
  const { t } = useTranslation()
  const places = useTripStore(s => s.places)
  const [forecast, setForecast] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [locationName, setLocationName] = useState<string>('')

  useEffect(() => {
    // Find the first place with lat/lng
    const p = places.find(p => p.lat != null && p.lng != null)
    if (!p || !p.lat || !p.lng) {
      setForecast([])
      setLocationName('')
      return
    }

    setLocationName(p.name || 'Trip Destination')
    setLoading(true)
    
    // Open-Meteo free API
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`)
      .then(res => res.json())
      .then(data => {
        if (data.daily) {
          const days = data.daily.time.map((time: string, i: number) => ({
            date: time,
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
            code: data.daily.weathercode[i]
          }))
          setForecast(days.slice(0, 5)) // show up to 5 days
        }
      })
      .catch(() => {
        setForecast([])
      })
      .finally(() => setLoading(false))
  }, [places])

  return (
    <div className="rounded-2xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>{t('dashboard.weather') || 'Weather'}</span>
        {locationName && (
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{locationName}</span>
        )}
      </div>

      {!locationName ? (
        <div className="py-4 text-center text-xs" style={{ color: 'var(--text-faint)' }}>
          {t('dashboard.weatherNoLocation') || 'Add a place with location to see weather'}
        </div>
      ) : loading ? (
        <div className="py-4 text-center text-xs animate-pulse" style={{ color: 'var(--text-faint)' }}>
          Loading forecast...
        </div>
      ) : forecast.length === 0 ? (
        <div className="py-4 text-center text-xs" style={{ color: 'var(--text-faint)' }}>
          Weather data unavailable
        </div>
      ) : (
        <div className="space-y-2">
          {forecast.map((day, i) => {
            const dateObj = new Date(day.date)
            const isToday = i === 0 // Approximation
            const dayName = isToday ? (t('dashboard.today') || 'Today') : dateObj.toLocaleDateString(undefined, { weekday: 'short' })
            return (
              <div key={day.date} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 w-1/3">
                  <span className="text-xs font-medium" style={{ color: isToday ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {dayName}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-1/3 justify-center" title={getWeatherDesc(day.code, t)}>
                  {getWeatherIcon(day.code)}
                </div>
                <div className="flex items-center gap-2 w-1/3 justify-end text-xs tabular-nums">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{day.maxTemp}°</span>
                  <span style={{ color: 'var(--text-faint)' }}>{day.minTemp}°</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
