import React, { useState, useEffect, SetStateAction } from 'react'
import { socket } from './socket'
import { ConnectionState } from './components/socket/connection-state'
import { ConnectionManager } from './components/socket/connector-manager'
import { MyForm } from './components/socket/my-form'
import { Events } from './components/socket/my-events'

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [fooEvents, setFooEvents] = useState([])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onFooEvent(value) {
      setFooEvents((previous ) => {
        return [...previous, value]
      })
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('foo', onFooEvent)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('foo', onFooEvent)
    }
  }, [])

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  )
}
