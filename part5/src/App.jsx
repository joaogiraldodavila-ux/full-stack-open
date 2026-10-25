import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useRef } from 'react' // Asegúrate de importar useRef

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const blogFormRef = useRef() 

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
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
      setErrorMessage(null)
    }, 5000) // Se oculta tras 5 segundos
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility() // <--- Oculta el formulario al crear con éxito
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      
      setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const deleteBlog = async (id) => {
  const blogToRemove = blogs.find(b => b.id === id)
  
  if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`)) {
    try {
      await blogService.remove(id)
      // Actualizamos el estado filtrando el blog eliminado
      setBlogs(blogs.filter(b => b.id !== id))
    } catch (error) {
      console.error('Error al eliminar el blog', error)
    }
  }
}

  const likeBlog = async (id) => {
  const blogToUpdate = blogs.find(b => b.id === id)
  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
    user: blogToUpdate.user ? blogToUpdate.user.id : undefined 
  }

  try {
    const returnedBlog = await blogService.update(id, updatedBlog)
    
    // Nos aseguramos de conservar el objeto 'user' original 
    // combinando la respuesta con el usuario que ya teníamos en 'blogToUpdate.user'
    setBlogs(blogs.map(b => b.id === id ? { ...returnedBlog, user: blogToUpdate.user } : b))
  } catch (exception) {
    console.error('Error al dar like', exception)
  }
}

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} type="error" />
        <Notification message={successMessage} type="success" />

        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

      <h2>blogs</h2>
      <p>
        {user.name} logged in 
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
      </Togglable>

      <br />

      {blogs
      .slice() // Creamos una copia para no mutar el estado original
      .sort((a, b) => b.likes - a.likes) // Ordenamos de mayor a menor likes
      .map(blog => (
      <Blog 
      key={blog.id} 
      blog={blog} 
      updateLikes={() => likeBlog(blog.id)} 
      removeBlog={() => deleteBlog(blog.id)}
      user={user} // Pasamos el usuario actual para validar la propiedad del blog
      />
      ))
      }
    }
    </div>
  )
}

export default App