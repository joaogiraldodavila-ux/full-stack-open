import { useAnecdotes } from '../store'

const AnecdoteList = () => {
  const { anecdotes, vote } = useAnecdotes()

  const handleVote = (id) => {
    vote(id)
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
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