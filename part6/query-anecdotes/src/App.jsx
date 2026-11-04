import { useGetAnecdotes, useAnecdoteMutations } from './hooks/useAnecdotes'
import AnecdoteForm from './components/AnecdoteForm'

const App = () => {
  const result = useGetAnecdotes()
  const { updateAnecdoteMutation } = useAnecdoteMutations()

  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  }

  return (
    <div>
      <h2>Anecdote app</h2>
      
      <AnecdoteForm />
      
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App