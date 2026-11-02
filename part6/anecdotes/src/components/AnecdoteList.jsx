import { useAnecdotes } from '../store'
import { useNotificationStore } from '../notificationStore' // Importamos el store de notificaciones

const AnecdoteList = () => {
  // 1. Extraemos removeAnecdote además de anecdotes, filter y vote
  const { anecdotes, filter = '', vote, removeAnecdote } = useAnecdotes()

  const handleVote = (id) => {
    vote(id)
  }

  // 2. Función para manejar la eliminación de la anécdota
  const handleDelete = async (anecdote) => {
    await removeAnecdote(anecdote.id)
    useNotificationStore.getState().showNotification(`You deleted '${anecdote.content}'`, 5)
  }

  // Filtramos de forma segura asegurando que filter sea un string
  const searchTerm = filter ? filter.toLowerCase() : ''

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(searchTerm)
  )

  const sortedAnecdotes = filteredAnecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
            
            {/* 3. Renderizamos el botón delete SOLO si los votos son 0 */}
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList