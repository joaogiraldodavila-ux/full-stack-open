import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = ({ onSubmit, nameValue, onNameChange, numberValue, onNumberChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={nameValue} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={numberValue} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons }) => (
  <div>
    {persons.map(person => (
      <p key={person.id}>{person.name} {person.number}</p>
    ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const nameExists = persons.some(
      person => person.name.toLowerCase() === newName.trim().toLowerCase()
    )

    if (nameExists) {
      alert(newName + " is already added to phonebook")
      return
    }

    const nameObject = {
      name: newName.trim(),
      number: newNumber.trim(),
      id: String(persons.length + 1)
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>
      
      <PersonForm 
        onSubmit={addName}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App