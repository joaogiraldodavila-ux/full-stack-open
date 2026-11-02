import { create } from 'zustand'
import anecdoteService from './services/anecdotes' // Importa tu servicio

export const useAnecdotes = create((set, get) => ({
  anecdotes: [],
  filter: '',
  setAnecdotes: (anecdotes) => set({ anecdotes }),
  setFilter: (value) => set({ filter: value }),

  // MODIFICAMOS VOTE PARA QUE SEA ASÍNCRONO Y PERSISTA EN EL BACKEND
  vote: async (id) => {
    const anecdotes = get().anecdotes
    const anecdoteToChange = anecdotes.find(a => a.id === id)
    
    // Creamos el objeto modificado incrementando los votos en 1
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    }

    // 1. Guardamos el cambio en el backend usando el servicio
    await anecdoteService.update(id, changedAnecdote)

    // 2. Actualizamos el estado local de Zustand
    set({
      anecdotes: anecdotes.map(a => a.id !== id ? a : changedAnecdote)
    })
  },

  createAnecdote: (content) => set((state) => ({
    anecdotes: [...state.anecdotes, content]
  }))
}))