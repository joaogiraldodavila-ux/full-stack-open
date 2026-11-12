import { useNotificationValue } from "../context/NotificationContext"

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) {
    return null
  }

  // Soportar tanto si se envía un string como un objeto { message, isError }
  const message =
    typeof notification === "string" ? notification : notification.message
  const isError = typeof notification === "object" && notification.isError

  const style = {
    color: isError ? "red" : "green",
    background: "lightgrey",
    fontSize: 18,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  }

  return <div style={style}>{message}</div>
}

export default Notification
