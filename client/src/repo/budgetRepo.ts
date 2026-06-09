import { budgetApi } from '../api/client'
import { offlineDb, upsertBudgetItems } from '../db/offlineDb'
import type { BudgetItem } from '../types'

export const budgetRepo = {
  async list(tripId: number | string, params?: Record<string, any>): Promise<{ items: BudgetItem[] }> {
    if (!navigator.onLine) {
      let cached = await offlineDb.budgetItems
        .where('trip_id')
        .equals(Number(tripId))
        .toArray()
      if (params) {
        if (params.q) {
          const q = params.q.toLowerCase()
          cached = cached.filter(i => (i.name && i.name.toLowerCase().includes(q)) || (i.note && i.note.toLowerCase().includes(q)))
        }
        if (params.category) {
          cached = cached.filter(i => i.category === params.category)
        }
        if (params.user_id || params.persons) {
          const uId = Number(params.user_id || params.persons)
          cached = cached.filter(i => i.members && i.members.some(m => m.user_id === uId))
        }
      }
      return { items: cached }
    }
    const result = await budgetApi.list(tripId, params)
    upsertBudgetItems(result.items)
    return result
  },
}
