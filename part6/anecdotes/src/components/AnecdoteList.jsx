import { useAnecdotes } from '../store'
import { useNotificationStore } from '../notificationStore'

const AnecdoteList = () => {
  const { anecdotes, filter = '', vote, removeAnecdote } = useAnecdotes()

  const handleVote = (id) => {
    vote(id)
  }

  const handleDelete = async (anecdote) => {
    await removeAnecdote(anecdote.id)
    useNotificationStore.getState().showNotification(`you deleted '${anecdote.content}'`, 5)
  }

  const searchTerm = filter ? filter.toLowerCase() : ''

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(searchTerm)
  )

  const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
            
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