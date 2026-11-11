import { createContext, useReducer, useContext } from "react"

// Reducer para manejar las acciones de la notificación
const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SHOW":
      return action.payload // payload será el texto del mensaje
    case "HIDE":
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

// Hook personalizado para usar la notificación fácilmente en cualquier componente
export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export default NotificationContext
