import { createContext, useReducer, useContext } from 'react' 

// Reducer para manejar el cambio de estado de la notificación
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

// Proveedor del contexto que envuelve la aplicación
export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

// Hook personalizado para LEER el mensaje actual
export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

// Hook personalizado para DESPACHAR (modificar) el estado
export const useNotificationDispatch = () => {
  const [, dispatch] = useContext(NotificationContext)
  return dispatch
}

export default NotificationContext