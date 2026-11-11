import { useState, useEffect } from "react"
import { useRef } from "react"
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Notification from "./components/Notification"
import BlogForm from "./components/BlogForm"
import { useNotificationDispatch } from "./context/NotificationContext"

// Componente que se mostrará cuando ocurra un error de renderizado (Ejercicio 9)
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Something went wrong :(</h2>
      <p>Please make a bug report to mluukkai in Discord</p>
    </div>
  )
}

const App = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useNotificationDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 1. Obtener los blogs usando TanStack Query (useQuery)
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  const blogs = result.data || []

  // 2. Mantener la sesión del usuario al recargar la página
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // 3. Mutación para crear un nuevo blog
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (returnedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      dispatch({
        type: "SHOW",
        payload: {
          message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          type: "success",
        },
      })
      setTimeout(() => dispatch({ type: "HIDE" }), 5000)
      navigate("/")
    },
    onError: () => {
      dispatch({
        type: "SHOW",
        payload: {
          message: "Wrong credentials or missing fields",
          type: "error",
        },
      })
      setTimeout(() => dispatch({ type: "HIDE" }), 5000)
    },
  })

  // 4. Mutación para actualizar likes
  const updateBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
    },
    onError: () => {
      dispatch({
        type: "SHOW",
        payload: { message: "Error updating likes", type: "error" },
      })
      setTimeout(() => dispatch({ type: "HIDE" }), 5000)
    },
  })

  // 5. Mutación para eliminar un blog
  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      const blogToDelete = blogs.find((b) => b.id === id)
      dispatch({
        type: "SHOW",
        payload: {
          message: `Blog ${blogToDelete ? blogToDelete.title : ""} removed successfully`,
          type: "success",
        },
      })
      setTimeout(() => dispatch({ type: "HIDE" }), 5000)
      navigate("/")
    },
    onError: () => {
      dispatch({
        type: "SHOW",
        payload: { message: "Error deleting blog", type: "error" },
      })
      setTimeout(() => dispatch({ type: "HIDE" }), 5000)
    },
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
      navigate("/")
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: { message: "Wrong username or password", type: "error" },
      })
      setTimeout(() => dispatch({ type: "HIDE" }), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    setUser(null)
    navigate("/")
  }

  const addBlog = async (blogObject) => {
    newBlogMutation.mutate(blogObject)
  }

  const likeBlog = async (id) => {
    if (!user) {
      alert('Debes iniciar sesión para dar "Me gusta"')
      return
    }

    const blogToLike = blogs.find((b) => b.id === id)
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user ? blogToLike.user.id : null,
    }
    updateBlogMutation.mutate({ id, updatedBlog })
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find((b) => b.id === id)
    if (
      window.confirm(
        `Remove blog ${blogToDelete ? blogToDelete.title : ""} by ${blogToDelete.author}?`,
      )
    ) {
      deleteBlogMutation.mutate(id)
    }
  }

  const match = useMatch("/blogs/:id")
  const blogById = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null

  // Manejo de estado de carga inicial de TanStack Query
  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  return (
    <div>
      {/* 1. La barra de navegación queda FUERA del ErrorBoundary para que no desaparezca */}
      <div className="navbar">
        <span className="navbar-brand">Blog App</span>
        <div className="navbar-links">
          <Link to="/">blogs</Link>
          <button onClick={() => navigate("/create")}>new blog</button>
          {user === null ? (
            <Link to="/login">login</Link>
          ) : (
            <>
              <span>{user.name} logged in</span>
              <button onClick={handleLogout}>logout</button>
            </>
          )}
        </div>
      </div>

      {/* 2. El ErrorBoundary envuelve el contenido de la aplicación y las rutas */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <h2>blogs</h2>
        <Notification />

        <Routes>
          <Route
            path="/"
            element={
              <div>
                {blogs
                  .slice()
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <Blog
                      key={blog.id}
                      blog={blog}
                      updateLikes={() => likeBlog(blog.id)}
                      removeBlog={() => deleteBlog(blog.id)}
                      user={user}
                    />
                  ))}
              </div>
            }
          />

          <Route
            path="/login"
            element={
              user === null ? (
                <LoginForm
                  username={username}
                  password={password}
                  handleUsernameChange={({ target }) =>
                    setUsername(target.value)
                  }
                  handlePasswordChange={({ target }) =>
                    setPassword(target.value)
                  }
                  handleSubmit={handleLogin}
                />
              ) : (
                <div>
                  <p>Ya has iniciado sesión como {user.name}.</p>
                  <button onClick={handleLogout}>logout</button>
                </div>
              )
            }
          />

          <Route
            path="/blogs/:id"
            element={
              blogById ? (
                <div>
                  <h2>
                    {blogById.title} {blogById.author}
                  </h2>
                  <a href={blogById.url} target="_blank" rel="noreferrer">
                    {blogById.url}
                  </a>
                  <div>
                    likes {blogById.likes}{" "}
                    <button onClick={() => likeBlog(blogById.id)}>like</button>
                  </div>
                  <div>
                    Added by {blogById.user ? blogById.user.name : "Unknown"}
                  </div>
                </div>
              ) : null
            }
          />

          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />

          {/* RUTA SPLAT PARA MANEJAR URLS INEXISTENTES (Ejercicio 10) */}
          <Route
            path="*"
            element={
              <div>
                <h2>404 – Page not found</h2>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
