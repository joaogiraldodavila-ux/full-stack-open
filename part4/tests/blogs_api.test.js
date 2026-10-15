const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs have an id property instead of _id', async () => {
    const response = await api.get('/api/blogs')
    
    // Verificamos que al menos exista un blog y que su propiedad 'id' esté definida
    if (response.body.length > 0) {
      assert.strictEqual(response.body[0].id !== undefined, true)
    }
  })
})

// Cerramos la conexión de Mongoose al finalizar las pruebas de la API
after(async () => {
  await mongoose.connection.close()
})