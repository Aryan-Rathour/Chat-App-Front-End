"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface LoginFormProps {
  setUsername: (username: string) => void
  setProfilePicture: (profilePicture: string) => void
}

const LoginForm: React.FC<LoginFormProps> = ({ setUsername, setProfilePicture }) => {
  const [name, setName] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("/placeholder-avatar.svg")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
    
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setUsername(name)
      if (image) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setProfilePicture(reader.result as string)
        }
        reader.readAsDataURL(image)
      } else {
        setProfilePicture("/placeholder-avatar.svg")
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#e7ebf0]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#5682a3]">Telegram Chat</h2>
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24 border-2 border-[#5682a3]/20">
            <AvatarImage src={previewUrl} alt="Preview" />
            <AvatarFallback>{name ? name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5682a3]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="profile-picture" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#5682a3]/10 file:text-[#5682a3] hover:file:bg-[#5682a3]/20"
            />
          </div>
          <Button 
            type="submit" 
            className="mt-2 bg-[#5682a3] hover:bg-[#4a7398] text-white"
            disabled={!name.trim()}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
