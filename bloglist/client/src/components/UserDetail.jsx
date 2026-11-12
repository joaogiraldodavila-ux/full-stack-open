import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import userService from "../services/users"

const UserDetail = () => {
  const { id } = useParams()

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return <div>loading user...</div>
  }

  if (isError) {
    return <div>error loading user data</div>
  }

  const user = users.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserDetail
