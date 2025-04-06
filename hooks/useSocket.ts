"use client"

import { useRef, useEffect } from "react"

// This is a mock implementation since we don't have the actual socket.io setup
const useSocket = () => {
  const socket = useRef({
    emit: (event: string, data: any) => {
      console.log(`Emitted ${event} with data:`, data)
      // Mock receiving a message after sending one
      if (event === "sendMessage") {
        setTimeout(() => {
          if (socket.current.onReceiveMessage) {
            // If it's a text message, generate a reply
            if (data.type === "text") {
              socket.current.onReceiveMessage({
                type: "text",
                content: `Reply to: ${data.content}`,
                sender: "user2",
                timestamp: new Date().toISOString(),
              })
            }
            // If it's an image, acknowledge it
            else if (data.type === "image") {
              socket.current.onReceiveMessage({
                type: "text",
                content: "Nice picture! 📸",
                sender: "user2",
                timestamp: new Date().toISOString(),
              })
            }
            // If it's a document, acknowledge it
            else if (data.type === "document") {
              socket.current.onReceiveMessage({
                type: "text",
                content: "Thanks for the document! I'll take a look. 📄",
                sender: "user2",
                timestamp: new Date().toISOString(),
              })
            }
            // If it's a location, acknowledge it
            else if (data.type === "location") {
              socket.current.onReceiveMessage({
                type: "text",
                content: "I see your location! I'll meet you there. 📍",
                sender: "user2",
                timestamp: new Date().toISOString(),
              })
            }
            // If it's audio, acknowledge it
            else if (data.type === "audio") {
              socket.current.onReceiveMessage({
                type: "text",
                content: "I'll listen to your audio message soon! 🎵",
                sender: "user2",
                timestamp: new Date().toISOString(),
              })
            }
          }
        }, 1000)
      }
    },
    on: (event: string, callback: any) => {
      console.log(`Registered listener for ${event}`)
      if (event === "receiveMessage") {
        socket.current.onReceiveMessage = callback
      } else if (event === "userTyping") {
        socket.current.onUserTyping = callback
      }
    },
    off: (event: string) => {
      console.log(`Removed listener for ${event}`)
      if (event === "receiveMessage") {
        socket.current.onReceiveMessage = null
      } else if (event === "userTyping") {
        socket.current.onUserTyping = null
      }
    },
    onReceiveMessage: null as any,
    onUserTyping: null as any,
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

