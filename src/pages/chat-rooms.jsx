import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@mui/material'

const ChatRooms = () => {
  const [users, setUsers] = useState([])

  useEffect(async () => {
    const token = localStorage.getItem('token')
    const result = await axios.get('http://localhost:3000/users', { headers: { 'Authorization': `Bearer ${token}` } })
    setUsers(result.data)
  }, [])

  if (users.length > 0) {
    return (
      <>
        {
          users.map((user, index) => (
            <Button>{user.name}</Button>
          ))
        }
      </>
    )
  } else {
    return (
      <>
      </>
    )
  }
}