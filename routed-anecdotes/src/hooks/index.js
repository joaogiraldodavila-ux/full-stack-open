import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

// (Aquí mantienes tu useField existente del ejercicio anterior...)
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

// Nuevo hook personalizado
export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => {
      setAnecdotes(data)
    })
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    setAnecdotes(anecdotes.concat(newAnecdote))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id) // o la implementación con fetch
    setAnecdotes(anecdotes.filter(a => a.id !== id))
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}