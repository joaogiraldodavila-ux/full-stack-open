import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
  event.preventDefault()

  // Buscamos si el contacto ya existe en el array
  const existingPerson = persons.find(
    p => p.name.toLowerCase() === newName.toLowerCase()
  )

  if (existingPerson) {
    // Si ya existe, preguntamos si desea actualizar su número
    const confirmUpdate = window.confirm(
      `${newName} ya está agregado a la libreta de teléfonos, ¿desea reemplazar el número antiguo por el nuevo?`
    )

    if (confirmUpdate) {
      const updatedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(
            persons.map(p => p.id !== existingPerson.id ? p : returnedPerson)
          )
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          alert(
            `La información de ${newName} ya ha sido eliminada del servidor previamente.`
          )
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
    }
    return
  }

  // Si no existe, lo creamos normalmente como antes
  const personObject = {
    name: newName,
    number: newNumber
  }

  personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
}

  const deletePerson = (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(`Ocurrió un error al intentar eliminar a ${name}`)
        })
    }
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
            {person.name} {person.number} {' '}
            <button onClick={() => deletePerson(person.id, person.name)}>eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App