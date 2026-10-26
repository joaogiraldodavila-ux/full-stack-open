import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  
  const blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/') // Redirige a la vista principal de blogs tras iniciar sesión
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    navigate('/') // Redirige a la vista principal al cerrar sesión
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const likeBlog = async (id) => {
    if (!user) {
      alert('Debes iniciar sesión para dar "Me gusta"')
      return
    }

    const blogToLike = blogs.find(b => b.id === id)
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user ? blogToLike.user.id : null
    }
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id === id ? { ...returnedBlog, user: blogToLike.user } : blog))
    } catch (exception) {
      setErrorMessage('Error updating likes')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        setSuccessMessage(`Blog ${blogToDelete.title} removed successfully`)
        setTimeout(() => setSuccessMessage(null), 5000)
      } catch (exception) {
        setErrorMessage('Error deleting blog')
        setTimeout(() => setErrorMessage(null), 5000)
      }
    }
  }

  const navStyle = {
    background: '#d3d3d3',
    padding: '10px',
    marginBottom: '15px'
  }

  const match = useMatch('/blogs/:id')
  const blogById = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div>
      {/* Barra de navegación con React Router */}
      <div style={navStyle}>
        <Link to="/" style={{ marginRight: '10px' }}>blogs</Link>
        {user === null ? (
          <Link to="/login">login</Link>
        ) : (
          <>
            <span>{user.name} logged in </span>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </div>

      <h2>blogs</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

      {/* Definición de rutas según el Ejercicio 5.24 */}
      <Routes>
        <Route path="/" element={
          <div>
            {user !== null && (
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Togglable>
            )}
            
            {blogs
              .slice()
              .sort((a, b) => b.likes - a.likes)
              .map(blog =>
                <Blog
                  key={blog.id}
                  blog={blog}
                  updateLikes={() => likeBlog(blog.id)}
                  removeBlog={() => deleteBlog(blog.id)}
                  user={user}
                />
              )}
          </div>
        } />

        <Route path="/login" element={
      user === null ? (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      ) : (
        <div>
          <p>Ya has iniciado sesión como {user.name}.</p>
          <button onClick={handleLogout}>logout</button>
        </div>
      )
    } />
        <Route path="/blogs/:id" element={
    blogById ? (
      <div>
        <h2>{blogById.title} {blogById.author}</h2>
        <a href={blogById.url} target="_blank" rel="noreferrer">{blogById.url}</a>
        <div>
          likes {blogById.likes} <button onClick={() => likeBlog(blogById.id)}>like</button>
        </div>
        <div>Added by {blogById.user ? blogById.user.name : 'Unknown'}</div>
      </div>
    ) : null
  } />
  </Routes>
    </div>
  )
}

export default App