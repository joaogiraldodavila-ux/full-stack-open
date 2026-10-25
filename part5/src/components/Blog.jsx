import { useState } from 'react'

const Blog = ({ blog, updateLikes, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const removeButtonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '5px'
  }

  const showRemoveButton = user && blog.user && (
    (blog.user.username && user.username && blog.user.username === user.username) ||
    (blog.user.id && user.id && blog.user.id === user.id) ||
    (blog.user === user.id) ||
    (blog.user.name && user.name && blog.user.name === user.name)
  )

  return (
    <div style={{
      marginBottom: '10px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px'
    }}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} 
        <button onClick={toggleVisibility} style={{ marginLeft: '10px' }}>view</button>
      </div>

      <div style={showWhenVisible}>
        <div>
          {blog.title} {blog.author} 
          <button onClick={toggleVisibility} style={{ marginLeft: '10px' }}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} 
          <button onClick={updateLikes} style={{ marginLeft: '5px' }}>like</button>
        </div>
        <div>{blog.user ? blog.user.name : 'Desconocido'}</div>

        {showRemoveButton && (
          <div>
            <button onClick={removeBlog} style={removeButtonStyle}>
              remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog