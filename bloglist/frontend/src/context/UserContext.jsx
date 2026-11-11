import { createContext, useReducer, useEffect, useContext } from "react"
import blogService from "../services/blogs"

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload
    case "CLEAR_USER":
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  // Cargar usuario y configurar el token en el servicio al iniciar la app
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: "SET_USER", payload: user })
      blogService.setToken(user.token) // <-- ESTO ES CLAVE
    }
  }, [])

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[0]
}

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[1]
}

export default UserContext
