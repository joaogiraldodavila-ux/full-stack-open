import { useNotificationValue } from "../context/NotificationContext"

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) {
    return null
  }

  const message =
    typeof notification === "object" ? notification.message : notification
  const styleType =
    typeof notification === "object" && notification.type === "error"
      ? "error"
      : "success"
  const className =
    styleType === "error" ? "notification error" : "notification success"

  return <div className={className}>{message}</div>
}

export default Notification
