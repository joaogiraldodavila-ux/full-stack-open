const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  // Evaluamos si el tipo es error para asignar la clase correspondiente
  const className = type === 'error' ? 'notification error' : 'notification success'

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification