import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotify } from '../NotificationContext' // Importamos el hook

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notify = useNotify() // Inicializamos el hook

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${newAnecdote.content}' created`) // Limpio y encapsulado
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'too short anecdote, must have length 5 or more'
      notify(errorMessage) // Limpio y encapsulado para errores también
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <div>
          <input name='anecdote' data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm