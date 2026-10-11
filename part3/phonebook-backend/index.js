const express = require('express')
const app = express()

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-643122"
  },
  {
    "id": "5",
    "name": "Joao Giraldo",
    "number": "77-63-864321"
  }
]

// 1. Ruta para obtener todas las personas
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// 2. Ruta de información (Ejercicio 3.2)
app.get('/info', (req, res) => {
  const count = persons.length
  const currentTime = new Date()

  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${currentTime}</p>
  `)
})

// 3. Ruta para obtener una persona por ID (Ejercicio 3.3)
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})