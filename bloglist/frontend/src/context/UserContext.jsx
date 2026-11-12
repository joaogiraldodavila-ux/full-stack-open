import { createContext, useReducer, useEffect, useContext } from "react"
import persistentUser from "../services/persistentUser"
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

  useEffect(() => {
    const loggedUser = persistentUser.getUser()
    if (loggedUser) {
      userDispatch({ type: "SET_USER", payload: loggedUser })
      blogService.setToken(loggedUser.token)
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
