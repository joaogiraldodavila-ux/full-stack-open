import { create } from 'zustand'

export const useAnecdotes = create((set) => ({
  anecdotes: [], // Inicia vacío para llenarse con los datos del backend
  filter: '',
  setAnecdotes: (anecdotes) => set({ anecdotes }),
  setFilter: (value) => set({ filter: value }),
  vote: (id) => set((state) => ({
    anecdotes: state.anecdotes.map((a) => 
      a.id === id ? { ...a, votes: a.votes + 1 } : a
    )
  })),
  createAnecdote: (content) => set((state) => ({
    anecdotes: [...state.anecdotes, content]
  }))
}))