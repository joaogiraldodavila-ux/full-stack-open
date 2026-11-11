import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className="form-container">
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div className="form-group">
          title:
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="title"
            className="form-input" /* <-- Clase para el input */
          />
        </div>
        <div className="form-group">
          author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="author"
            className="form-input" /* <-- Clase para el input */
          />
        </div>
        <div className="form-group">
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="url"
            className="form-input" /* <-- Clase para el input */
          />
        </div>
        <button type="submit" className="form-button">create</button> {/* <-- Clase para el botón */}
      </form>
    </div>
  )
}

export default BlogForm