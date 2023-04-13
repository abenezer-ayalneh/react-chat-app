import React, { useState } from 'react'
import { socket } from '../../socket'

export function MyForm() {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    const chatContent = {
      receiver_id: 'users:asieuh2io3axi',
      message: value,
    }

    socket.timeout(5000).emit('chat', chatContent, () => {
      setIsLoading(false)
      console.log(value)
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={(e) => setValue(e.target.value)} />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  )
}
