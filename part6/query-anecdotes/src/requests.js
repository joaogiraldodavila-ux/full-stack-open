const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const createAnecdote = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote)
  })
  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }
  return response.json()
}