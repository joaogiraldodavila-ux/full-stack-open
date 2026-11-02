import { useAnecdotes } from '../store'

const AnecdoteList = () => {
  const { anecdotes, filter = '', vote } = useAnecdotes()

  const handleVote = (id) => {
    vote(id)
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
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList