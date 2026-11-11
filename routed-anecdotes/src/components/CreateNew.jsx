import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useAnecdotes } from '../hooks'


const CreateNew = () => {
  const { addAnecdote } = useAnecdotes()
  
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  // Función para resetear todos los campos a la vez
  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  // Extraemos la propiedad 'reset' para que no pase al input nativo y evitemos la advertencia
  const { reset: resetContent, ...contentWithoutReset } = content
  const { reset: resetAuthor, ...authorWithoutReset } = author
  const { reset: resetInfo, ...infoWithoutReset } = info

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentWithoutReset} />
        </div>
        <div>
          author
          <input {...authorWithoutReset} />
        </div>
        <div>
          url for more info
          <input {...infoWithoutReset} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew