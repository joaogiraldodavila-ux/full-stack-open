import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  // Controlador para manejar el envío del formulario
  const addName = (event) => {
    event.preventDefault()
    
    // Creación del nuevo objeto persona
    const nameObject = {
      name: newName
    }

    // Actualización del estado agregando la nueva persona
    setPersons(persons.concat(nameObject))
    
    // Limpiar el campo del input
    setNewName('')
  }

  // Controlador para rastrear los cambios en el input
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => (
          <p key={person.name}>{person.name}</p>
        ))}
      </div>
    </div>
  )
}

export default App