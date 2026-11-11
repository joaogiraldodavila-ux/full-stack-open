import { useState } from 'react'
import { Link } from 'react-router-dom'

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
    marginBottom: 5,
    padding: 10
  }

  const showDeleteButton = user && blog.user && blog.user.username === user.username

  return (
    <div style={blogStyle} className="blog">
      <div className="blogSummary">
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
        <button onClick={toggleVisibility} style={{ marginLeft: 10 }}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      <div style={showWhenVisible} className="blogDetails">
        <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
        <div>
          likes {blog.likes} <button onClick={updateLikes}>like</button>
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