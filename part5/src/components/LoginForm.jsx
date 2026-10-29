const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>

      {/* Añadimos la clase para el contenedor del formulario */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
            className="form-input" /* <-- Clase para el input */
          />
        </div>
        <div className="form-group">
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
            className="form-input" /* <-- Clase para el input */
          />
        </div>
        <button type="submit" className="form-button">login</button> {/* <-- Clase para el botón */}
      </form>
    </div>
  )
}

export default LoginForm