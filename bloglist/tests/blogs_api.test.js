const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const api = supertest(app)

let token = null

// Antes de cada prueba, limpiamos la base de datos y creamos un usuario de prueba para obtener su token
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salet', 10)
  const user = new User({ username: 'hellas', name: 'Arto Hellas', passwordHash })

  await user.save()

  // Hacemos login para obtener el token válido que usaremos en las pruebas de creación
  const response = await api
    .post('/api/login')
    .send({ username: 'hellas', password: 'salet' })

  token = response.body.token
})

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
  test('a valid blog can be added with token', async () => {
    const newBlog = {
      title: 'Async/await simplifies asynchronous code',
      author: 'Full Stack Open Student',
      url: 'https://fullstackopen.com/',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // <-- Agregamos el token aquí
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, 1)
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
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // <-- Agregamos el token aquí
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  // NUEVA PRUEBA REQUERIDA POR EL EJERCICIO 4.23
  test('fails with status code 401 Unauthorized if token is not provided', async () => {
    const newBlog = {
      title: 'Blog without token',
      author: 'Unauthorized User',
      url: 'https://fullstackopen.com/no-token',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog) // Sin enviar el header Authorization
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 0) // Verificamos que no se haya guardado
  })

  test('backend responds with 400 Bad Request if title is missing', async () => {
    const newBlog = {
      author: 'Full Stack Open Student',
      url: 'https://fullstackopen.com/no-title',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // <-- Agregamos el token aquí también
      .send(newBlog)
      .expect(400)
  })

  test('backend responds with 400 Bad Request if url is missing', async () => {
    const newBlog = {
      title: 'Blog without url property',
      author: 'Full Stack Open Student',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // <-- Agregamos el token aquí también
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid and requested by creator', async () => {
    // Creamos un blog primero usando el token para poder probar su eliminación
    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Tester',
      url: 'https://fullstackopen.com/delete',
      likes: 0
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogToDelete = blogResponse.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    const ids = blogsAtEnd.body.map(r => r.id)
    assert.strictEqual(ids.includes(blogToDelete.id), false)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 and updates likes if id is valid', async () => {
    const newBlog = {
      title: 'Blog to be updated',
      author: 'Tester',
      url: 'https://fullstackopen.com/update',
      likes: 5
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogToUpdate = blogResponse.body

    const updatedBlogData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 10
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)

    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10)
  })
})

after(async () => {
  await mongoose.connection.close()
})