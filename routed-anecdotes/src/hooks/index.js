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

// Nuevo hook personalizado para el ejercicio 7.4
export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => {
      setAnecdotes(data)
    })
  }, [])

  return {
    anecdotes
    // Más adelante en el siguiente ejercicio ampliaremos esto para manejar la creación
  }
}