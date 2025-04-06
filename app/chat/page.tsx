"use client"

import { useState, useEffect, useRef } from "react"
import useSocket from "../../hooks/useSocket"
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Settings, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
// import ProfileSettings from "@/components/profile-settings"
import LoginForm from "../../components/login-form"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import CTA from "@/components/CTA"
import API from '../services/api';
import axios from "axios"


const ChatPage = () => {
  const socket = useSocket()
  const [messages, setMessages] = useState([
    { text: "Hello there!", sender: "user2", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { text: "Hi! How are you?", sender: "user1", timestamp: new Date(Date.now() - 3500000).toISOString() },
    {
      text: "I'm doing great, thanks for asking!",
      sender: "user2",
      timestamp: new Date(Date.now() - 3400000).toISOString(),
    },
    { text: "What are you up to today?", sender: "user1", timestamp: new Date(Date.now() - 3300000).toISOString() },
  ])
  const [msg, setMsg] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [username, setUsername] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("username") || ""
    }
    return ""
  })
  const [profilePicture, setProfilePicture] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("profilePicture") || "/placeholder-avatar.svg"
    }
    return "/placeholder-avatar.svg"
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { toast } = useToast()

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/chat/rooms")
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/ping")
      .then((res) => console.log("✅ Connected to API:", res.data))
      .catch((err) => console.error("❌ API Connection failed:", err));
  }, []);

  useEffect(() => {
    API.get('/chat/rooms')
      .then(res => setChatRooms(res.data))
      .catch(err => console.error(err));
  }, []);

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

    const newMsg = {
      text: msg,
      sender: "user1",
      roomId: "room1",
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

    socket.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message])
    })

    socket.current.on("userTyping", (data) => {
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

  if (!username) {
    return <LoginForm setUsername={setUsername} setProfilePicture={setProfilePicture} />
  }

  function handleFileClick(e){
    const file = e.target.files;

    if (!file || file ===0){
      const selectedFile = file[0];
      console.log("selectedFile",)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <main className="bg-white text-gray-900">
      
    </main>
      {/* <LoginForm/> */}
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
          <Phone className="h-5 w-5 cursor-pointer hover:text-blue-200 transition-colors" />
          <Video className="h-5 w-5 cursor-pointer hover:text-blue-200 transition-colors" />
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
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <span className="text-[10px] text-gray-500 block text-right mt-1">{formatTime(m.timestamp)}</span>

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

      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center gap-2 bg-[#f5f5f5] rounded-full px-4 py-2">
          <Paperclip className="h-5 w-5 text-gray-500 cursor-pointer hover:text-[#5682a3] transition-colors" />
          <textarea
            className="flex-1 bg-transparent outline-none resize-none max-h-32 py-1"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            rows={1}
            onClick={handleFileClick}
          />
          <Smile className="h-5 w-5 text-gray-500 cursor-pointer hover:text-[#5682a3] transition-colors" />
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
      {isSettingsOpen && (
        <ProfileSettings
          username={username}
          setUsername={setUsername}
          profilePicture={profilePicture}
          setProfilePicture={setProfilePicture}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  )
}

export default ChatPage;
