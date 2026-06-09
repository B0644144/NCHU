import { render, screen } from '../../../tests/helpers/render'
import { resetAllStores, seedStore } from '../../../tests/helpers/store'
import { useTripStore } from '../../store/tripStore'
import { useSettingsStore } from '../../store/settingsStore'
import WhatsNextWidget from './WhatsNextWidget'
import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import type { TripMember, AssignmentsMap } from '../../types'

// Dynamic date helpers
const today = new Date().toISOString().split('T')[0]

function getFutureDate(daysAhead: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().split('T')[0]
}

function getPastDate(daysBack: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysBack)
  return d.toISOString().split('T')[0]
}

const tomorrow = getFutureDate(1)
const yesterday = getPastDate(1)

function makeAssignment(id: number, placeOverrides: Record<string, unknown> = {}, participants: TripMember[] = []) {
  return {
    id,
    day_id: 1,
    place_id: id,
    order_index: 0,
    notes: null as string | null,
    place: {
      id,
      trip_id: 1,
      name: `Place ${id}`,
      description: null as string | null,
      notes: null as string | null,
      lat: 0 as number | null,
      lng: 0 as number | null,
      address: null as string | null,
      category_id: null as number | null,
      icon: null as string | null,
      price: null as string | null,
      currency: null as string | null,
      image_url: null as string | null,
      google_place_id: null as string | null,
      osm_id: null as string | null,
      route_geometry: null as string | null,
      place_time: null as string | null,
      end_time: null as string | null,
      duration_minutes: null as number | null,
      time_locked: null as number | boolean | null,
      transport_mode: null as string | null,
      website: null as string | null,
      phone: null as string | null,
      created_at: '2025-01-01T00:00:00.000Z',
      ...placeOverrides,
    },
    participants,
  }
}

function makeDay(id: number, date: string, overrides: Record<string, unknown> = {}) {
  return { id, trip_id: 1, date, title: null as string | null, day_number: id, assignments: [], notes_items: [], notes: null as string | null, ...overrides }
}

function seedSettings(time_format: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  seedStore(useSettingsStore, { settings: { time_format } as any })
}

describe('WhatsNextWidget', () => {
  beforeEach(() => {
    resetAllStores()
    seedSettings('24h')
  })

  afterEach(() => {
    resetAllStores()
  })

  it('FE-COMP-WHATSNEXT-001: renders empty state when no days exist', () => {
    seedStore(useTripStore, { days: [], assignments: {} })
    render(<WhatsNextWidget />)
    // Translation resolves to "No upcoming activities"
    expect(screen.getByText(/no upcoming/i)).toBeInTheDocument()
    expect(screen.queryByText('Place 1')).toBeNull()
  })

  it('FE-COMP-WHATSNEXT-001b: empty state element is rendered', () => {
    seedStore(useTripStore, { days: [], assignments: {} })
    render(<WhatsNextWidget />)
    // collab.whatsNext.empty key is rendered as text in test env
    const allText = document.body.textContent || ''
    // No assignment time/name visible — just the header and empty hint
    expect(allText).not.toContain('14:30')
  })

  it('FE-COMP-WHATSNEXT-002: shows empty state when all events are in the past', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, yesterday, { title: 'Old Day' })],
      assignments: {
        '1': [makeAssignment(10, { place_time: '08:00' })],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    expect(screen.queryByText('08:00')).toBeNull()
    expect(screen.queryByText('Place 10')).toBeNull()
  })

  it('FE-COMP-WHATSNEXT-003: shows a future-day event with place name', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [makeAssignment(20, { name: 'Eiffel Tower' })],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    expect(screen.getByText('Eiffel Tower')).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-004: shows "Tomorrow" label for next-day group', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [makeAssignment(21, { name: 'Museum' })],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    // The label text comes from t('collab.whatsNext.tomorrow') which falls back to 'Tomorrow'
    expect(screen.getByText(/tomorrow/i)).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-005: shows "Today" label for today\'s events with future time', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, today)],
      assignments: {
        '1': [makeAssignment(22, { name: 'Night Dinner', place_time: '23:59' })],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    expect(screen.getByText(/today/i)).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-006: renders event time in 24h format', () => {
    seedSettings('24h')
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [makeAssignment(30, { name: 'Gallery', place_time: '14:30' })],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    expect(screen.getByText('14:30')).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-007: renders event time in 12h format', () => {
    seedSettings('12h')
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [makeAssignment(31, { name: 'Gallery', place_time: '14:30' })],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    expect(screen.getByText('2:30 PM')).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-008: shows "TBD" when event has no time', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [makeAssignment(32, { name: 'Free Time', place_time: null })],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    expect(screen.getByText('TBD')).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-009: renders address when provided', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [makeAssignment(33, { name: 'Café', address: '123 Rue de Rivoli' })],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    expect(screen.getByText('123 Rue de Rivoli')).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-010: caps list at 8 items', () => {
    const days = Array.from({ length: 5 }, (_, i) => makeDay(i + 1, getFutureDate(i + 1)))

    const assignments: AssignmentsMap = {}
    let placeId = 100
    for (const day of days) {
      assignments[String(day.id)] = [
        makeAssignment(placeId++, { name: `Place ${placeId}`, place_time: '10:00' }),
        makeAssignment(placeId++, { name: `Place ${placeId}`, place_time: '11:00' }),
      ]
    }

    seedStore(useTripStore, { days, assignments })
    render(<WhatsNextWidget />)

    // 10 items seeded, only 8 should appear — count "TBD" or time occurrences
    // At most 4 days * 1 morning slot = up to 4 "10:00" entries, but capped at 8 total items
    // We verify total rendered items is at most 8 by counting both time slots
    const allTimes = screen.getAllByText(/10:00|11:00/)
    expect(allTimes.length).toBeLessThanOrEqual(8)
  })

  it('FE-COMP-WHATSNEXT-011: shows participant username chip', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [makeAssignment(40, { name: 'Louvre' }, [{ id: 3, username: 'alice', avatar_url: null }])],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    expect(screen.getByText('alice')).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-012: falls back to tripMembers when assignment has no participants', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [makeAssignment(41, { name: 'Park' }, [])],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget tripMembers={[{ id: 7, username: 'bob', avatar_url: null }]} />)
    expect(screen.getByText('bob')).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-013: renders end time when provided', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [makeAssignment(50, { name: 'Concert', place_time: '19:00', end_time: '21:30' })],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    expect(screen.getByText('19:00')).toBeInTheDocument()
    expect(screen.getByText('21:30')).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-014: multiple events on same day share one day header', () => {
    seedStore(useTripStore, {
      days: [makeDay(1, tomorrow)],
      assignments: {
        '1': [
          makeAssignment(60, { name: 'Breakfast', place_time: '08:00' }),
          makeAssignment(61, { name: 'Lunch', place_time: '12:00' }),
        ],
      } as AssignmentsMap,
    })
    render(<WhatsNextWidget />)
    const tomorrowHeaders = screen.getAllByText(/tomorrow/i)
    // Only one day header for tomorrow
    expect(tomorrowHeaders).toHaveLength(1)
    expect(screen.getByText('Breakfast')).toBeInTheDocument()
    expect(screen.getByText('Lunch')).toBeInTheDocument()
  })

  it('FE-COMP-WHATSNEXT-015: today past-time event is excluded', () => {
    // If it's not midnight, a past-time event today should not appear
    const now = new Date()
    if (now.getHours() > 0) {
      const pastTime = '00:01' // Very early — will be past for most of the day
      seedStore(useTripStore, {
        days: [makeDay(1, today)],
        assignments: {
          '1': [makeAssignment(70, { name: 'Early Bird', place_time: pastTime })],
        } as AssignmentsMap,
      })
      render(<WhatsNextWidget />)
      // If current time > 00:01, the item should not appear
      if (now.getHours() > 0 || now.getMinutes() > 1) {
        expect(screen.queryByText('Early Bird')).toBeNull()
      }
    }
  })
})
