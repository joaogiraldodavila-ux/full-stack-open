import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import blogService from "../services/blogs"

const BlogDetail = () => {
  const { id } = useParams()
  const [commentText, setCommentText] = useState("")
  const queryClient = useQueryClient()

  // 1. Obtener blogs desde TanStack Query
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  // 2. Mutación para agregar un comentario y refrescar la caché de React Query
  const commentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
    },
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

  const comments = blog.comments || []

  // 3. Manejador del envío del formulario
  const handleAddComment = (event) => {
    event.preventDefault()
    if (!commentText.trim()) return

    commentMutation.mutate({ id: blog.id, comment: commentText })
    setCommentText("")
  }

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

      <h3>comments</h3>

      {/* Formulario para añadir nuevo comentario */}
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={commentText}
          onChange={({ target }) => setCommentText(target.value)}
          placeholder="write a comment..."
        />
        <button type="submit">add comment</button>
      </form>

      {/* Lista de comentarios */}
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogDetail
