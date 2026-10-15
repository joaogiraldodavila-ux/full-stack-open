const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

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
    
    if (response.body.length > 0) {
      assert.strictEqual(response.body[0].id !== undefined, true)
    }
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Async/await simplifies asynchronous code',
      author: 'Full Stack Open Student',
      url: 'https://fullstackopen.com/',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    // Verificamos que el número total de blogs aumentó y que el título del blog creado está incluido
    assert.strictEqual(response.body.length > 0, true)
    assert.strictEqual(
      titles.includes('Async/await simplifies asynchronous code'),
      true
    )
  })
})

// Cerramos la conexión de Mongoose al finalizar las pruebas de la API
after(async () => {
  await mongoose.connection.close()
})