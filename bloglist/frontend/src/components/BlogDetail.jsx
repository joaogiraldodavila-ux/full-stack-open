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

  // Estilos visuales mejorados (Ejercicio 7.21)
  const styles = {
    container: {
      padding: "20px",
      maxWidth: "600px",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      marginBottom: "10px",
    },
    section: {
      marginTop: "20px",
    },
    form: {
      display: "flex",
      gap: "10px",
      marginTop: "10px",
      marginBottom: "15px",
    },
    input: {
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      flexGrow: "1",
    },
    button: {
      padding: "8px 15px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    list: {
      paddingLeft: "20px",
    },
    listItem: {
      marginBottom: "6px",
      color: "#333",
    },
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>
      <div style={{ margin: "10px 0" }}>
        {blog.likes} likes <button style={{ marginLeft: "5px" }}>like</button>
      </div>
      <div>added by {blog.user ? blog.user.name : "anonymous"}</div>

      <div style={styles.section}>
        <h3>comments</h3>

        {/* Formulario para añadir nuevo comentario */}
        <form onSubmit={handleAddComment} style={styles.form}>
          <input
            type="text"
            value={commentText}
            onChange={({ target }) => setCommentText(target.value)}
            placeholder="write a comment..."
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            add comment
          </button>
        </form>

        {/* Lista de comentarios */}
        <ul style={styles.list}>
          {comments.map((comment, index) => (
            <li key={index} style={styles.listItem}>
              {comment}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogDetail
