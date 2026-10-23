import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// Exporta setToken junto con tus otras funciones (getAll, etc.)
export default { getAll, setToken }
