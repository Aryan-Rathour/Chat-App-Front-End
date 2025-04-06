"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import useSocket from "../../hooks/useSocket"
import { Send, Phone, Video, MoreVertical, Settings, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import ProfileSettings from "@/components/profile-settings"
import LoginForm from "@/components/login-form"
import EmojiPicker from "@/components/emoji-picker"
import VoiceCall from "@/components/voice-call"
import VideoCall from "@/components/video-call"
import AttachmentMenu from "@/components/attachment-menu"
import MessageContent from "@/components/message-content"

// Define message type
interface Message {
  type: "text" | "image" | "document" | "audio" | "location"
  content: any
  sender: string
  timestamp: string
}

const ChatPage = () => {
  const socket = useSocket()
  const [messages, setMessages] = useState<Message[]>([
    { type: "text", content: "Hello there!", sender: "user2", timestamp: new Date(Date.now() - 3600000).toISOString() },
    {
      type: "text",
      content: "Hi! How are you?",
      sender: "user1",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
    },
    {
      type: "text",
      content: "I'm doing great, thanks for asking!",
      sender: "user2",
      timestamp: new Date(Date.now() - 3400000).toISOString(),
    },
    {
      type: "text",
      content: "What are you up to today?",
      sender: "user1",
      timestamp: new Date(Date.now() - 3300000).toISOString(),
    },
  ])
  const [msg, setMsg] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [username, setUsername] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("username") || ""
    }
    return ""
  })
  const [profilePicture, setProfilePicture] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("profilePicture") || "/placeholder-avatar.svg"
    }
    return "/placeholder-avatar.svg"
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false)
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username)
    }
    if (profilePicture) {
      localStorage.setItem("profilePicture", profilePicture)
    }
  }, [username, profilePicture])

  const sendMessage = () => {
    if (!msg.trim()) return

    const newMsg: Message = {
      type: "text",
      content: msg,
      sender: "user1",
      timestamp: new Date().toISOString(),
    }

    socket.current.emit("sendMessage", newMsg)
    setMessages((prev) => [...prev, newMsg])
    setMsg("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    socket.current.emit("joinRoom", { roomId: "room1" })

    socket.current.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    socket.current.on("userTyping", (data: { isTyping: boolean }) => {
      setIsTyping(data.isTyping)
    })

    return () => {
      socket.current.off("receiveMessage")
      socket.current.off("userTyping")
    }
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("profilePicture")
    setUsername("")
    setProfilePicture("/placeholder-avatar.svg")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleEmojiSelect = (emoji: string) => {
    setMsg((prev) => prev + emoji)
  }

  const startVoiceCall = () => {
    setIsVoiceCallActive(true)
    toast({
      title: "Voice Call Started",
      description: "You are now in a voice call.",
    })
  }

  const startVideoCall = () => {
    setIsVideoCallActive(true)
    toast({
      title: "Video Call Started",
      description: "You are now in a video call.",
    })
  }

  const handleFileSelect = (file: File, type: string) => {
    // For images and audio, create a data URL
    if (type === "image" || type === "audio") {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newMsg: Message = {
          type: type as any,
          content: reader.result,
          sender: "user1",
          timestamp: new Date().toISOString(),
        }

        socket.current.emit("sendMessage", newMsg)
        setMessages((prev) => [...prev, newMsg])
      }
      reader.readAsDataURL(file)
    }
    // For documents, create an object with file details
    else if (type === "document") {
      const newMsg: Message = {
        type: "document",
        content: {
          name: file.name,
          size: file.size,
          type: file.type,
          // In a real app, you would upload this file to a server and get a URL
          url: URL.createObjectURL(file),
        },
        sender: "user1",
        timestamp: new Date().toISOString(),
      }

      socket.current.emit("sendMessage", newMsg)
      setMessages((prev) => [...prev, newMsg])
    }
    // For location, parse the JSON
    else if (type === "location") {
      const reader = new FileReader()
      reader.onloadend = () => {
        try {
          const locationData = JSON.parse(reader.result as string)
          const newMsg: Message = {
            type: "location",
            content: locationData,
            sender: "user1",
            timestamp: new Date().toISOString(),
          }

          socket.current.emit("sendMessage", newMsg)
          setMessages((prev) => [...prev, newMsg])
        } catch (e) {
          console.error("Failed to parse location data", e)
        }
      }
      reader.readAsText(file)
    }

    toast({
      title: "File Attached",
      description: `Your ${type} has been attached and sent.`,
    })
  }

  if (!username) {
    return <LoginForm setUsername={setUsername} setProfilePicture={setProfilePicture} />
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-[#5682a3] text-white p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src={profilePicture} alt={username} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg">{username}</h1>
            <p className="text-xs text-blue-100">{isTyping ? "typing..." : "online"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={startVoiceCall}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#4a7398] transition-colors"
          >
            <Phone className="h-5 w-5" />
          </button>
          <button
            onClick={startVideoCall}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#4a7398] transition-colors"
          >
            <Video className="h-5 w-5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-white hover:bg-[#4a7398]">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e7ebf0]">
        {messages.map((m, i) => {
          const isUser = m.sender === "user1"
          const showAvatar = i === 0 || messages[i - 1]?.sender !== m.sender

          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} relative`}>
              <div className={`flex items-end gap-2 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {!isUser && showAvatar && (
                  <Avatar className="h-8 w-8 mb-1">
                    <AvatarImage src="/placeholder-avatar.svg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`
                    relative p-3 rounded-lg 
                    ${isUser ? "bg-[#effdde] text-slate-800 rounded-br-none" : "bg-white text-slate-800 rounded-bl-none"}
                    shadow-sm
                  `}
                >
                  <MessageContent content={m.content} type={m.type} />
                  <span className="text-[10px] text-gray-500 block text-right mt-1">{formatTime(m.timestamp)}</span>

                  {/* Message tail */}
                  <div
                    className={`absolute bottom-0 ${isUser ? "-right-2" : "-left-2"} w-4 h-4 overflow-hidden`}
                    style={{ transform: isUser ? "scaleX(-1)" : "" }}
                  >
                    <div
                      className={`absolute transform rotate-45 w-3 h-3 ${isUser ? "bg-[#effdde]" : "bg-white"}`}
                      style={{ bottom: "6px", [isUser ? "right" : "left"]: "-1.5px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center gap-2 bg-[#f5f5f5] rounded-full px-4 py-2">
          <AttachmentMenu onFileSelect={handleFileSelect} />
          <textarea
            className="flex-1 bg-transparent outline-none resize-none max-h-32 py-1"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            rows={1}
          />
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          <Button
            onClick={sendMessage}
            disabled={!msg.trim()}
            size="icon"
            className="h-8 w-8 rounded-full bg-[#5682a3] hover:bg-[#4a7398] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      {isSettingsOpen && (
        <ProfileSettings
          username={username}
          setUsername={setUsername}
          profilePicture={profilePicture}
          setProfilePicture={setProfilePicture}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isVoiceCallActive && (
        <VoiceCall username={username} profilePicture={profilePicture} onClose={() => setIsVoiceCallActive(false)} />
      )}

      {isVideoCallActive && (
        <VideoCall username={username} profilePicture={profilePicture} onClose={() => setIsVideoCallActive(false)} />
      )}
    </div>
  )
}

export default ChatPage

