import { useState } from 'react'
import { Link } from 'react-router-dom' // <- Añade esta línea

const Blog = ({ blog, updateLikes, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // Comprobamos si el usuario actual es el creador del blog
  const showDeleteButton = user && blog.user && blog.user.username === user.username

  return (
    <div style={blogStyle} className="blog">
      {/* Elemento visible por defecto: título y autor como enlace */}
      <div className="blogSummary">
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {/* Elementos ocultos por defecto: URL y likes */}
      <div style={showWhenVisible} className="blogDetails">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={updateLikes}>like</button>
        </div>
        <div>{blog.user ? blog.user.name : 'anonymous'}</div>
        
        {showDeleteButton && (
          <button onClick={removeBlog} style={{ backgroundColor: '#ff6b6b', color: 'white' }}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog