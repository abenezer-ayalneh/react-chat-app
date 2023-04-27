import React, { useEffect, useRef, useState } from 'react'
import Chat from './pages/Chat'
import axios from 'axios'

export default function App() {
  const [token, setToken] = useState(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  const login = async () => {
    console.log('Login')
    const result = await axios.post('http://localhost:3000/auth/email/signin', {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    })

    localStorage.setItem('token', result.data.accessToken)
    setToken(result.data.accessToken)
  }

  if (token) {
    return (
      <>
        <Chat />
      </>
    )
  } else {
    return (
      <div
        style={{
          backgroundColor: '#202025',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ color: '#fff', fontSize: '20px' }}>Login Page</h1>
          <br />
          <label htmlFor={'email'} style={{ color: '#fff' }}>
            Email
          </label>
          <input
            type={'text'}
            ref={emailRef}
            id={'email'}
            style={{ padding: '10px' }}
          />
          <br />
          <label htmlFor={'password'} style={{ color: '#fff' }}>
            Password
          </label>
          <input
            type={'password'}
            ref={passwordRef}
            id={'password'}
            style={{ padding: '10px' }}
          />
          <br />
          <button
            type={'button'}
            style={{
              padding: '10px',
              color: 'rgb(57,125,168)',
              backgroundColor: 'rgb(16,47,66)',
            }}
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    )
  }
}
