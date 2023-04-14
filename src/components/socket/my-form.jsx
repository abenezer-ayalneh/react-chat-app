import React, { useState } from 'react'
import { socket } from '../../socket'

export function MyForm() {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)

  function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    const chatContent = {
      ticket_id: 'tickets:wxryuilmg3ye42z0dtrn',
      sender_id: 'users:m66s783jowkd2ijqfhbm',
      receiver_id: 'users:m66s783jowkd2ijqfhbm',
      // "receiver_id": "users:yi06pyqld6w6tnajw0qa",
      message: value,
    }

    socket.timeout(5000).emit('chat', chatContent, () => {
      setIsLoading(false)
    })

    socket.on('chat', (data) => console.log(data))
  }

  function uploadFile(event) {
    event.preventDefault()

    // console.log(file);
    const chatContent = {
      ticket_id: 'tickets:wxryuilmg3ye42z0dtrn',
      sender_id: 'users:m66s783jowkd2ijqfhbm',
      receiver_id: 'users:m66s783jowkd2ijqfhbm',
      // "receiver_id": "users:yi06pyqld6w6tnajw0qa",
      file: file,
    }
    socket.emit('chat', chatContent, (status) => {
      console.log(status)
    })

    // const formData = new FormData();
    // formData.append('file', file);
    // // Now you can send the form data (with the file) using AJAX or fetch
    // // For example:
    // fetch('http://localhost:3000/files', {
    //   method: 'POST',
    //   body: formData
    // }).then(response => {
    //   console.log('Upload successful!');
    // }).catch(error => {
    //   console.error('Upload failed:', error);
    // });
  }

  const handleFileInputChange = event => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input onChange={(e) => setValue(e.target.value)} />

        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>

      <form onSubmit={uploadFile}>
        <input type="file" name="file" onChange={handleFileInputChange} />

        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
    </>
  )
}
