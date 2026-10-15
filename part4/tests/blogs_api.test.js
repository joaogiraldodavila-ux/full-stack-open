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

  describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.body.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert.strictEqual(titles.includes(blogToDelete.title), false)
  })
})

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlogWithoutLikes = {
      title: 'Blog without likes property',
      author: 'Full Stack Open Student',
      url: 'https://fullstackopen.com/no-likes'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('backend responds with 400 Bad Request if title is missing', async () => {
    const newBlog = {
      author: 'Full Stack Open Student',
      url: 'https://fullstackopen.com/no-title',
      likes: 2
    }

    await api
      .post('/api/blogs')
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
      .send(newBlog)
      .expect(400)
  })
})

// Cerramos la conexión de Mongoose al finalizar las pruebas de la API
after(async () => {
  await mongoose.connection.close()
})