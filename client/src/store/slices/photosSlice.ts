import { photosApi } from '../../api/client'
import type { StoreApi } from 'zustand'
import type { TripStoreState } from '../tripStore'
import type { Photo } from '../../types'
import { getApiErrorMessage } from '../../types'

type SetState = StoreApi<TripStoreState>['setState']
type GetState = StoreApi<TripStoreState>['getState']

export interface PhotosSlice {
  photos: Photo[]
  loadPhotos: (tripId: number | string) => Promise<void>
  addPhoto: (tripId: number | string, formData: FormData) => Promise<void>
  deletePhoto: (tripId: number | string, photoId: number) => Promise<void>
  updatePhoto: (tripId: number | string, photoId: number, data: Partial<Photo>) => Promise<void>
}

export const createPhotosSlice = (set: SetState, get: GetState): PhotosSlice => ({
  photos: [],
  loadPhotos: async (tripId) => {
    try {
      const data = await photosApi.list(tripId)
      set({ photos: data.photos })
    } catch (err: unknown) {
      console.error('Failed to load photos:', err)
    }
  },

  addPhoto: async (tripId, formData) => {
    try {
      const data = await photosApi.upload(tripId, formData)
      set(state => ({ photos: [...data.photos, ...state.photos] }))
    } catch (err: unknown) {
      throw new Error(getApiErrorMessage(err, 'Error uploading photo'))
    }
  },

  deletePhoto: async (tripId, photoId) => {
    try {
      await photosApi.delete(tripId, photoId)
      set(state => ({ photos: state.photos.filter(p => p.id !== photoId) }))
    } catch (err: unknown) {
      throw new Error(getApiErrorMessage(err, 'Error deleting photo'))
    }
  },

  updatePhoto: async (tripId, photoId, data) => {
    try {
      const result = await photosApi.update(tripId, photoId, data)
      set(state => ({
        photos: state.photos.map(p => p.id === photoId ? result.photo : p)
      }))
    } catch (err: unknown) {
      throw new Error(getApiErrorMessage(err, 'Error updating photo'))
    }
  },
})
