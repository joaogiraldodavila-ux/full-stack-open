import { useState } from 'react'

const App = () => {
  // Arreglo con las frases o anécdotas de prueba
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

  // Genera un número entero aleatorio dentro del rango del arreglo
  const handleNext = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <button onClick={handleNext}>next anecdote</button>
    </div>
  )
}

export default App