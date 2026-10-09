import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Cargar datos iniciales desde json-server (Ejercicio 2.11)
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  // Manejador del envío del formulario (Ejercicio 2.12)
  const addPerson = (event) => {
    event.preventDefault()

    const personExists = persons.some(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    if (personExists) {
      alert(newName + " ya ha sido agregado a la libreta de teléfonos")
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    axios
      .post('http://localhost:3001/persons', personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Libreta de Teléfonos</h2>

      <div>
        Buscar por nombre: <input value={filter} onChange={handleFilterChange} />
      </div>

      <h3>Agregar nuevo contacto</h3>

      <form onSubmit={addPerson}>
        <div>
          Nombre: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          Teléfono: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">Agregar</button>
        </div>
      </form>

      <h3>Números</h3>

      <ul>
        {personsToShow.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App