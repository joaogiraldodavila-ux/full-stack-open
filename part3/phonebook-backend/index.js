const express = require('express')
require('dotenv').config() // <- Importante para leer el .env
const morgan = require('morgan')
const cors = require('cors') // <-- 1. Importar cors
const Person = require('./models/person') // <- Importante para usar el modelo

const app = express()

app.use(express.static('dist'))
// Middleware para parsear los datos JSON que llegan en las peticiones POST
app.use(express.json())
app.use(cors()) // <-- 2. Usar cors para permitir solicitudes desde cualquier origen, habilitar CORS para todas las rutas

// 1. Crear un token personalizado de Morgan para mostrar el body en formato JSON
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// 2. Configurar morgan usando un formato personalizado que incluya nuestro token :body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

// Ruta GET para obtener un contacto individual por su ID
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// Ruta GET para obtener todas las personas desde MongoDB
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


// 3. Ruta DELETE para eliminar un contacto por su ID
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// 4. Ruta POST para añadir un nuevo contacto a MongoDB
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Validación: si falta el nombre o el número
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Falta el nombre o el número' 
    })
  }

  // Creamos una nueva instancia del modelo Person con los datos recibidos
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  // Guardamos el documento en MongoDB Atlas
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// Configuración del puerto y arranque del servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})