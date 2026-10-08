import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'Si algo duele, hazlo más seguido.',
    'Añadir personal a un proyecto retrasado lo retrasa más.',
    'El primer 90% del código toma el primer 10% del tiempo.',
    'Cualquier tonto puede escribir código que una computadora entienda.',
    'La optimización prematura es la raíz de todos los males.',
    'Depurar es el doble de difícil que escribir el código.',
    'Programar sin console.log es como un médico sin rayos X.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const handleNext = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  // Obtenemos el número máximo de votos y el índice de esa anécdota
  const maxVotes = Math.max(...votes)
  const mostVotedIndex = votes.indexOf(maxVotes)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      {maxVotes === 0 ? (
        <p>No votes yet</p>
      ) : (
        <>
          <p>{anecdotes[mostVotedIndex]}</p>
          <p>has {maxVotes} votes</p>
        </>
      )}
    </div>
  )
}

export default App