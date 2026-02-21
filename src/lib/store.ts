import { create } from 'zustand'

interface VvE {
  id: string
  name: string
  address: string
  city: string
  postal_code: string
  type: 'garage' | 'storage' | 'apartment' | 'mixed'
  total_units: number
}

interface AppStore {
  currentVvE: VvE | null
  setCurrentVvE: (vve: VvE | null) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  currentVvE: null,
  setCurrentVvE: (vve) => set({ currentVvE: vve }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
