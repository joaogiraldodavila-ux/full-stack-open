import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success') // 'success' o 'error'

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // Función auxiliar para mostrar notificaciones limpias
  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
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
            showNotification(`Se actualizó correctamente el número de ${returnedPerson.name}`, 'success')
          })
          .catch(error => {
            // AQUÍ MANEJAMOS EL ERROR VISUAL EN ROJO EN LUGAR DE ALERT()
            showNotification(
              `Información de ${newName} ya ha sido eliminada del servidor previamente`,
              'error'
            )
            setPersons(persons.filter(p => p.id !== existingPerson.id))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

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
        showNotification(`Se añadió exitosamente a ${returnedPerson.name}`, 'success')
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Se eliminó correctamente a ${name}`, 'success')
        })
        .catch(error => {
          showNotification(`El contacto ${name} ya había sido eliminado del servidor`, 'error')
          setPersons(persons.filter(p => p.id !== id))
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

      {/* Pasamos el mensaje y el tipo de notificación al componente */}
      <Notification message={notificationMessage} type={notificationType} />

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