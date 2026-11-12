import { useState, useEffect, useRef } from "react"
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Notification from "./components/Notification"
import BlogForm from "./components/BlogForm"
import Togglable from "./components/Togglable"
import { useNotificationDispatch } from "./context/NotificationContext"
import { useUserValue, useUserDispatch } from "./context/UserContext"
import UsersView from "./components/UsersView"
import UserDetail from "./components/UserDetail"
import BlogDetail from "./components/BlogDetail"
import persistentUser from "./services/persistentUser"

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Something went wrong</h2>
      <p>Please make a bug report to mluukkai in Discord</p>
    </div>
  )
}

const App = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const user = useUserValue()
  const userDispatch = useUserDispatch()

  const dispatch = useNotificationDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const blogFormRef = useRef()

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  // Mutación para crear blog con notificación
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]) || []
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog))

      dispatch({
        type: "SET",
        payload: {
          message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
          isError: false,
        },
      })
      setTimeout(() => dispatch({ type: "CLEAR" }), 5000)
    },
    onError: (error) => {
      dispatch({
        type: "SET",
        payload: {
          message: error.response?.data?.error || "Error adding blog",
          isError: true,
        },
      })
      setTimeout(() => dispatch({ type: "CLEAR" }), 5000)
    },
  })

  // Mutación para actualizar (likes) con notificación
  const updateBlogMutation = useMutation({
    mutationFn: ({ id, newObject }) => blogService.update(id, newObject),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })

      dispatch({
        type: "SET",
        payload: {
          message: `You liked '${updatedBlog.title}'`,
          isError: false,
        },
      })
      setTimeout(() => dispatch({ type: "CLEAR" }), 5000)
    },
  })

  // Mutación para eliminar con notificación
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })

      dispatch({
        type: "SET",
        payload: {
          message: `Blog removed successfully`,
          isError: false,
        },
      })
      setTimeout(() => dispatch({ type: "CLEAR" }), 5000)
    },
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })

      persistentUser.saveUser(loggedUser)
      blogService.setToken(loggedUser.token)

      userDispatch({ type: "SET_USER", payload: loggedUser })
      setUsername("")
      setPassword("")

      dispatch({
        type: "SET",
        payload: {
          message: `${loggedUser.name} logged in successfully`,
          isError: false,
        },
      })
      setTimeout(() => dispatch({ type: "CLEAR" }), 5000)
    } catch (exception) {
      dispatch({
        type: "SET",
        payload: {
          message: "Wrong credentials or missing fields",
          isError: true,
        },
      })
      setTimeout(() => dispatch({ type: "CLEAR" }), 5000)
    }
  }

  const handleLogout = () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    userDispatch({ type: "CLEAR_USER" })
    dispatch({
      type: "SET",
      payload: { message: "Logged out successfully", isError: false },
    })
    setTimeout(() => dispatch({ type: "CLEAR" }), 5000)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blogObject)
  }

  const likeBlog = (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    }
    updateBlogMutation.mutate({ id: blog.id, newObject: updatedBlog })
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id)
    }
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = result.data || []
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const navStyle = {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    marginBottom: "15px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    borderRadius: "4px",
  }

  return (
    <div className="container" style={{ padding: "10px 20px" }}>
      <h2>blogs</h2>
      <Notification />

      {/* Barra de navegación siempre visible y fuera del ErrorBoundary */}
      <div style={navStyle}>
        <Link to="/">blogs</Link>
        <Link to="/users">users</Link>
        {user && (
          <>
            <span>
              <strong>{user.name}</strong> logged in{" "}
            </span>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </div>

      {/* ErrorBoundary envolviendo únicamente a las rutas */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
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
                  <Togglable buttonLabel="new blog" ref={blogFormRef}>
                    <BlogForm createBlog={addBlog} />
                  </Togglable>

                  <div style={{ marginTop: "20px" }}>
                    {sortedBlogs.map((blog) => (
                      <Blog
                        key={blog.id}
                        blog={blog}
                        likeBlog={likeBlog}
                        deleteBlog={deleteBlog}
                        user={user}
                      />
                    ))}
                  </div>
                </div>
              )
            }
          />
          <Route path="/users" element={<UsersView />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route
            path="*"
            element={
              <div style={{ padding: "20px" }}>
                <h2>Page not found</h2>
                <p>The route you are looking for does not exist.</p>
                <Link to="/">Go back home</Link>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
