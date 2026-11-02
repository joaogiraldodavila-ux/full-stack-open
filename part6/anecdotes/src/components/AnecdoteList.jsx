import { useAnecdotes } from '../store'

const AnecdoteList = () => {
  const { anecdotes, vote } = useAnecdotes()

  const handleVote = (id) => {
    vote(id)
  }

  // Ordenamos las anécdotas de mayor a menor número de votos usando toSorted
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

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