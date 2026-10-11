const express = require('express')
const app = express()

// Middleware para parsear los datos JSON que llegan en las peticiones POST
app.use(express.json())

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

// 1. Ruta GET para obtener todos los contactos
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// 2. Ruta GET para obtener un contacto individual por su ID
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// 3. Ruta DELETE para eliminar un contacto por su ID
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

// 4. Ruta POST para añadir un nuevo contacto
app.post('/api/persons', (req, res) => {
  const body = req.body

  // Validación si falta el nombre o el número
  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'Falta el nombre o el número' 
    })
  }

  // Generar un ID aleatorio único
  const randomId = Math.floor(Math.random() * 1000000).toString()

  const newPerson = {
    id: randomId,
    name: body.name,
    number: body.number
  }

  // Agregar el nuevo contacto al arreglo en memoria
  persons = persons.concat(newPerson)

  res.json(newPerson)
})

// Configuración del puerto y arranque del servidor
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})