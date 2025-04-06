"use client"

import { useRef, useEffect } from "react"

// This is a mock implementation since we don't have the actual socket.io setup
const useSocket = () => {
  const socket = useRef({
    emit: (event, data) => {
      console.log(`Emitted ${event} with data:`, data)
      // Mock receiving a message after sending one
      if (event === "sendMessage") {
        setTimeout(() => {
          if (socket.current.onReceiveMessage) {
            socket.current.onReceiveMessage({
              text: `Reply to: ${data.text}`,
              sender: "user2",
              timestamp: new Date().toISOString(),
            })
          }
        }, 1000)
      }
    },
    on: (event, callback) => {
      console.log(`Registered listener for ${event}`)
      if (event === "receiveMessage") {
        socket.current.onReceiveMessage = callback
      } else if (event === "userTyping") {
        socket.current.onUserTyping = callback
      }
    },
    off: (event) => {
      console.log(`Removed listener for ${event}`)
      if (event === "receiveMessage") {
        socket.current.onReceiveMessage = null
      } else if (event === "userTyping") {
        socket.current.onUserTyping = null
      }
    },
    onReceiveMessage: null,
    onUserTyping: null,
  })

  // Simulate typing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      if (socket.current.onUserTyping) {
        socket.current.onUserTyping({ isTyping: Math.random() > 0.7 })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return socket
}

export default useSocket

