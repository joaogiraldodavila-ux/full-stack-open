const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  return await response.json()
}

// NUEVA FUNCIÓN PARA CREAR ANÉCDOTAS
const createNew = async (content) => {
  const object = { content, votes: 0 } // No necesitamos poner ID, JSON Server se encarga de generarlo
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(object),
  })
  return await response.json()
}

const update = async (id, updatedObject) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedObject),
  })
  return await response.json()
}

export default { getAll, createNew, update }