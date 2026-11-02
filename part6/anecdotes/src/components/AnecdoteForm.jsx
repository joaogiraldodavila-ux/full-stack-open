import { useAnecdotes } from '../store'
import anecdoteService from '../services/anecdotes'
import { useNotificationStore } from '../notificationStore'

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdotes()
  // Importamos la función para mostrar notificaciones fuera de React hooks si usamos getState(), 
  // o podemos invocarla directamente:

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value

    if (content.trim() !== '') {
      event.target.anecdote.value = ''

      // 1. Guardamos la nueva anécdota en el backend mediante POST
      const newAnecdote = await anecdoteService.createNew(content)

      // 2. Pasamos el objeto devuelto por el servidor al store de Zustand
      createAnecdote(newAnecdote)

      // 3. ¡Disparamos la notificación aquí!
      useNotificationStore.getState().showNotification(`You created ${content}'`, 5)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm