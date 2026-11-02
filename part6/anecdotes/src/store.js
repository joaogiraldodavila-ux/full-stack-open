import { create } from 'zustand'
import anecdoteService from './services/anecdotes'
import { useNotificationStore } from './notificationStore' // <-- 1. Importamos el store de notificaciones

export const useAnecdotes = create((set, get) => ({
  anecdotes: [],
  filter: '',
  setAnecdotes: (anecdotes) => set({ anecdotes }),
  setFilter: (value) => set({ filter: value }),

  // Al votar una anécdota
  vote: async (id) => {
    const anecdotes = get().anecdotes
    const anecdoteToChange = anecdotes.find(a => a.id === id)
    
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    }

    await anecdoteService.update(id, changedAnecdote)

    set({
      anecdotes: anecdotes.map(a => a.id !== id ? a : changedAnecdote)
    })

    // <-- 2. Disparamos la notificación de voto por 5 segundos
    useNotificationStore.getState().showNotification(`You voted '${anecdoteToChange.content}'`, 5)
  },

  // Al crear una anécdota (si manejas la creación aquí o en el componente)
  createAnecdote: (content) => set((state) => ({
    anecdotes: [...state.anecdotes, content]
  }))
}))