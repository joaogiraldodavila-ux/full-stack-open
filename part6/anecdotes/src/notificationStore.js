import { create } from 'zustand'

let timeoutId = null

export const useNotificationStore = create((set) => ({
  message: null,
  showNotification: (text, seconds = 5) => {
    // Si ya había un temporizador corriendo, lo cancelamos antes de crear uno nuevo
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    set({ message: text })

    timeoutId = setTimeout(() => {
      set({ message: null })
      timeoutId = null
    }, seconds * 1000)
  },
  clearNotification: () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    set({ message: null })
  }
}))