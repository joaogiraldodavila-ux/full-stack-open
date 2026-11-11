import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import userService from "../services/users"

const UsersView = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  })

  if (result.isLoading) {
    return <div>loading users...</div>
  }

  const users = result.data || []

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: "left", paddingRight: "20px" }}>Name</th>
            <th style={{ textAlign: "left", paddingRight: "20px" }}>
              Username
            </th>
            <th style={{ textAlign: "left" }}>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ paddingRight: "20px", paddingTop: "10px" }}>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td style={{ paddingRight: "20px", paddingTop: "10px" }}>
                {user.username}
              </td>
              <td style={{ paddingTop: "10px" }}>
                {user.blogs ? user.blogs.length : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersView
