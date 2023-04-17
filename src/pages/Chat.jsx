import {
  Avatar,
  AvatarBadge,
  Button,
  Divider as ChakraDivider,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { socket } from '../socket'
import axios from 'axios'
import { io } from 'socket.io-client'
import { IconButton } from '@chakra-ui/react'
import { FaPaperclip } from 'react-icons/fa'

const Chat = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const [inputMessage, setInputMessage] = useState('')
  const [users, setUsers] = useState([])
  const [receiverUser, setReceiverUser] = useState(null)
  const messageInputRef = useRef('')
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  // const socket = io('http://localhost:3000', {
  //   query: { accessToken: localStorage.getItem('token') },
  // })

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onMessageEvent(value) {
      console.log({'receive': value });
      setMessages((previous) => {
        return [...previous, value]
      })
    }

    async function getUser() {
      const token = localStorage.getItem('token')
      const result = await axios.get('http://localhost:3000/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(result.data)
      const usersResult = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(usersResult.data)
    }

    function OnAcknowledgement(value) {
      setMessages((old) => [...old, value])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('receive', onMessageEvent)
    socket.on('acknowledgement', OnAcknowledgement)

    return async () => {
      await getUser()
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('receive', onMessageEvent)
      socket.off('acknowledgement', OnAcknowledgement)
    }
  }, [])

  function handleFileSelected(event) {
    setFile(event.target.files[0])
    // do something with the selected file
  }

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef()
    useEffect(() => elementRef.current.scrollIntoView())
    return <div ref={elementRef} />
  }

  const handleSendMessage = async () => {
    if (!messageInputRef.current.value.trim().length && !file) {
      return
    }
    const data = messageInputRef.current.value.trim()

    const chatContent = {
      ticket_id: 'tickets:cosdak61qsb8gkp3pyvi',
      receiver_id: receiverUser.id,
      sender_id: user.id,
      message: data,
      file: file,
    }

    socket.timeout(5000).emit('send', chatContent)

    messageInputRef.current.value = ''
    setFile(null)
  }

  if (Boolean(receiverUser)) {
    return (
      <Flex w="100%" h="100vh" justify="center" align="center">
        <Flex w={['100%', '100%', '40%']} h="90%" flexDir="column">
          {/* Header */}
          <Flex w="100%">
            <Avatar
              size="lg"
              name={receiverUser.name}
              src="https://bit.ly/dan-abramov"
            >
              <AvatarBadge
                boxSize="1.25em"
                bg={isConnected ? 'green.500' : 'red.500'}
              />
            </Avatar>
            <Flex flexDirection="column" mx="5" justify="center">
              <Text fontSize="lg" fontWeight="bold">
                {receiverUser && receiverUser.name}
              </Text>
              <Text color={isConnected ? 'green.500' : 'red.500'}>
                {isConnected ? 'Online' : 'Offline'}
              </Text>
            </Flex>
          </Flex>

          {/*Divider*/}
          <ChakraDivider
            w="100%"
            borderBottomWidth="3px"
            color="black"
            mt="5"
          />

          {/*<Messages messages={messages} />*/}
          <Flex
            w="100%"
            h="80%"
            overflowY="scroll"
            flexDirection="column"
            p="3"
          >
            {messages &&
              messages.map((item, index) => {
                if (item.sender_id === user.id) {
                  return (
                    <Flex key={index} w="100%" justify="flex-end">
                      <Flex
                        bg="black"
                        color="white"
                        minW="100px"
                        maxW="350px"
                        my="1"
                        p="3"
                        flexDir={'column'}
                      >
                        <Text>{item.message}</Text>
                        {item.file && (
                          <a href={item.file} target="_blank">
                            <FaPaperclip />
                          </a>
                        )}
                      </Flex>
                    </Flex>
                  )
                } else {
                  return (
                    <Flex key={index} w="100%">
                      <Avatar
                        name="User"
                        src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                        bg="blue.300"
                      ></Avatar>
                      <Flex
                        bg="gray.100"
                        color="black"
                        minW="100px"
                        maxW="350px"
                        my="1"
                        p="3"
                        flexDir={'column'}
                      >
                        <Text>{item.message}</Text>
                        {item.file && (
                          <a href={item.file} target="_blank">
                            <FaPaperclip />
                          </a>
                        )}
                      </Flex>
                    </Flex>
                  )
                }
              })}
            <AlwaysScrollToBottom />
          </Flex>

          {/*<Divider />*/}
          <ChakraDivider
            w="100%"
            borderBottomWidth="3px"
            color="black"
            mt="5"
          />

          {/*<Footer*/}
          {/*  inputMessage={inputMessage}*/}
          {/*  setInputMessage={setInputMessage}*/}
          {/*  handleSendMessage={handleSendMessage}*/}
          {/*/>*/}

          {
            // console.log(file)
            file && <p>{file.name}</p>
          }
          <Flex w="100%" mt="5">
            <Input
              placeholder="Type Something..."
              border="none"
              borderRadius="none"
              _focus={{
                border: '1px solid black',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage()
                }
              }}
              ref={messageInputRef}
              autoFocus={true}
              // onChange={(e) => setInputMessage(e.target.value)}
            />
            <input
              type={'file'}
              style={{ display: 'none' }}
              ref={fileRef}
              onChange={handleFileSelected}
            />
            <IconButton
              icon={<FaPaperclip />}
              aria-label="Add item"
              onClick={() => fileRef.current.click()}
            />
            <Button
              bg="black"
              color="white"
              borderRadius="none"
              _hover={{
                bg: 'white',
                color: 'black',
                border: '1px solid black',
              }}
              disabled={inputMessage.trim().length <= 0}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Flex>
        </Flex>
      </Flex>
    )
  } else {
    return (
      <>
        {users
          .filter((u) => u.id !== user.id)
          .map((u, index) => (
            <Button key={index} onClick={() => setReceiverUser(u)}>
              {u.name}
            </Button>
          ))}
      </>
    )
  }
}

export default Chat
