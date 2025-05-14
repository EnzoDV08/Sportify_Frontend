import { useEffect, useState } from 'react'
import { getUsers } from '../api'

function AdminDashboard() {
const [users, setUsers] = useState<{ name: string; email: string }[]>([])

useEffect(() => {
  getUsers().then(data => {
    console.log("Fetched users:", data)
    setUsers(data)
  })
}, [])

  return (
    <div>
      <h2>Users</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
    </div>
  )
}

export default AdminDashboard
