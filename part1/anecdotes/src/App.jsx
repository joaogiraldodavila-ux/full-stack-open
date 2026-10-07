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

  // Inicializa un arreglo de ceros con la misma longitud que 'anecdotes'
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  // Función para pasar a la siguiente anécdota
  const handleNext = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  // Función para votar por la anécdota seleccionada
  const handleVote = () => {
    // 1. Hacemos una copia del arreglo de votos para mantener la inmutabilidad
    const copy = [...votes]
    // 2. Incrementamos en 1 el voto de la anécdota en la posición 'selected'
    copy[selected] += 1
    // 3. Actualizamos el estado con la copia modificada
    setVotes(copy)
  }

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>
    </div>
  )
}

export default App