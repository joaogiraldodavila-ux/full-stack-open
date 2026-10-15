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

    assert.strictEqual(response.body.length > 0, true)
    assert.strictEqual(
      titles.includes('Async/await simplifies asynchronous code'),
      true
    )
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlogWithoutLikes = {
      title: 'Blog without likes property',
      author: 'Full Stack Open Student',
      url: 'https://fullstackopen.com/no-likes'
      // Omitimos la propiedad likes a propósito
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Verificamos que el valor por defecto de likes sea 0
    assert.strictEqual(response.body.likes, 0)
  })
})

// Cerramos la conexión de Mongoose al finalizar las pruebas de la API
after(async () => {
  await mongoose.connection.close()
})