import React, { useMemo } from 'react'
import { Calendar, MapPin, Clock, Ticket, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from '../../i18n'
import type { Day, Place, Assignment, Reservation } from '../../types'

const TRANSPORT_TYPES = new Set(['flight', 'train', 'car', 'cruise', 'bus'])

interface CalendarViewProps {
  days: Day[]
  places: Place[]
  assignments: Record<number, Assignment[]>
  reservations: Reservation[]
  canEdit?: boolean
  onEditPlace?: (place: Place, assignmentId: number | null) => void
  onRemoveAssignment?: (dayId: number, assignmentId: number) => void
  onEditReservation?: (res: Reservation) => void
  onEditTransport?: (res: Reservation) => void
  onDeleteReservation?: (id: number) => void
  onAddReservation?: (dayId: number) => void
  onAssignPlace?: (placeId: number, dayId: number) => void
}

export default function CalendarView({
  days,
  places,
  assignments,
  reservations,
  canEdit = false,
  onEditPlace = () => {},
  onRemoveAssignment = () => {},
  onEditReservation = () => {},
  onEditTransport = () => {},
  onDeleteReservation = () => {},
  onAddReservation = () => {},
  onAssignPlace = () => {},
}: CalendarViewProps) {
  const { t } = useTranslation()

  // Map places by ID
  const placeMap = useMemo(() => {
    const m = new Map<number, Place>()
    places.forEach(p => m.set(p.id, p))
    return m
  }, [places])

  // Group reservations by day_id
  const resByDay = useMemo(() => {
    const m = new Map<number, Reservation[]>()
    reservations.forEach(r => {
      if (r.day_id) {
        if (!m.has(r.day_id)) m.set(r.day_id, [])
        m.get(r.day_id)!.push(r)
      }
    })
    return m
  }, [reservations])

  if (!days || days.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Calendar size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{t('calendar.emptyTitle') || 'No Days Planned'}</h3>
        <p className="text-sm text-zinc-500">{t('calendar.emptyDesc') || 'Add some days to your trip to see the timeline.'}</p>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full overflow-x-auto overflow-y-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex gap-4 p-6 min-w-max h-full">
        {days.map((day, i) => {
          const dayAssignments = assignments[day.id] || []
          const dayRes = resByDay.get(day.id) || []
          
          return (
            <div key={day.id} className="flex flex-col w-80 max-h-full flex-shrink-0 bg-white dark:bg-[#121212] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-[#18181b]">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  {t('calendar.day') || 'Day'} {i + 1}
                </div>
                <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {day.title || day.date || `${t('calendar.day')} ${i + 1}`}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {dayAssignments.length === 0 && dayRes.length === 0 ? (
                  <div className="text-center py-8 text-sm text-zinc-400 italic">
                    {t('calendar.noItems') || 'Nothing scheduled yet'}
                  </div>
                ) : (
                  <>
                    {/* Reservations */}
                    {dayRes.map(res => (
                      <div key={`res-${res.id}`} className="group relative flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                        <div className="mt-0.5 text-blue-500">
                          <Ticket size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate pr-12">
                            {res.name}
                          </div>
                          {(res.time || res.reservation_time || res.reservation_end_time) && (
                            <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                              <Clock size={12} />
                              {res.time || res.reservation_time || '?'} {res.reservation_end_time ? `- ${res.reservation_end_time}` : ''}
                            </div>
                          )}
                        </div>
                        {/* Hover Actions */}
                        {canEdit && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-white/90 dark:bg-zinc-800/90 rounded-md p-0.5 shadow-sm border border-zinc-200 dark:border-zinc-700">
                            <button
                              onClick={() => {
                                if (TRANSPORT_TYPES.has(res.type)) {
                                  onEditTransport(res)
                                } else {
                                  onEditReservation(res)
                                }
                              }}
                              className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-750"
                              title="Edit"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => onDeleteReservation(res.id)}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Places */}
                    {dayAssignments.map(a => {
                      const place = a.place || (a.place_id ? placeMap.get(a.place_id) : null)
                      if (!place) return null
                      const categoryName = typeof place.category === 'object' && place.category ? (place.category as any).name : (typeof place.category === 'string' ? place.category : null)
                      const categoryColor = (typeof place.category === 'object' && place.category ? (place.category as any).color : null) || (place as any).category_color
                      return (
                        <div key={`place-${a.id}`} className="group relative flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50">
                          <div className="mt-0.5" style={{ color: categoryColor || 'var(--accent)' }}>
                            <MapPin size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate pr-12">
                              {place.name}
                            </div>
                            <div className="text-xs text-zinc-500 mt-1 truncate">
                              {place.address || categoryName || 'Location'}
                            </div>
                          </div>
                          {/* Hover Actions */}
                          {canEdit && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-white/90 dark:bg-zinc-800/90 rounded-md p-0.5 shadow-sm border border-zinc-200 dark:border-zinc-700">
                              <button
                                onClick={() => onEditPlace(place, a.id)}
                                className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-750"
                                title="Edit"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => onRemoveAssignment(day.id, a.id)}
                                className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                                title="Remove from Day"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </>
                )}
              </div>

              {/* Actions Footer */}
              {canEdit && (
                <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-[#18181b]/30 flex gap-2">
                  <select
                    className="flex-1 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1.5 cursor-pointer text-zinc-700 dark:text-zinc-300"
                    onChange={(e) => {
                      const placeId = Number(e.target.value)
                      if (placeId) {
                        onAssignPlace(placeId, day.id)
                        e.target.value = '' // Reset
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>+ {t('calendar.addPlace') || 'Add Place'}</option>
                    {places.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => onAddReservation(day.id)}
                    className="p-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-semibold"
                    title={t('calendar.addBooking') || 'Add Booking'}
                  >
                    + Booking
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
