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
    </div>
  )
}

export default BlogDetail
