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

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "800px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "15px",
    },
    th: {
      borderBottom: "2px solid #ccc",
      padding: "10px",
      textAlign: "left",
      backgroundColor: "#f4f4f4",
    },
    td: {
      borderBottom: "1px solid #ddd",
      padding: "10px",
    },
  }

  return (
    <div style={styles.container}>
      <h2>Users</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.td}>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td style={styles.td}>{user.username}</td>
              <td style={styles.td}>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersView
