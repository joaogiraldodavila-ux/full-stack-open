import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import blogService from "../services/blogs"

const BlogDetail = () => {
  const { id } = useParams()

  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return <div>loading blog...</div>
  }

  if (isError) {
    return <div>error loading blog data</div>
  }

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return null
  }

  // Aseguramos que blog.comments exista o sea un arreglo vacío por defecto
  const comments = blog.comments || []

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes <button>like</button>
      </div>
      <div>added by {blog.user ? blog.user.name : "anonymous"}</div>

      {/* Sección de Comentarios requerida para el Ejercicio 7.19 */}
      <h3>comments</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogDetail
