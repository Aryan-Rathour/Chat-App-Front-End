"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProfileSettingsProps {
  username: string
  setUsername: (username: string) => void
  profilePicture: string
  setProfilePicture: (profilePicture: string) => void
  onClose: () => void
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  username,
  setUsername,
  profilePicture,
  setProfilePicture,
  onClose,
}) => {
  const [newName, setNewName] = useState(username)
  const [newImage, setNewImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(profilePicture)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNewImage(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (newName.trim()) {
      setUsername(newName)
    }

    if (newImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(newImage)
    }

    onClose()
  }

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-[#5682a3]">Profile Settings</h2>

        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4 border-2 border-[#5682a3]/20">
            <AvatarImage src={previewUrl} alt={username} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <label
            htmlFor="profile-picture-upload"
            className="cursor-pointer text-sm font-medium text-[#5682a3] hover:text-[#4a7398]"
          >
            Change Profile Picture
          </label>
          <input
            type="file"
            id="profile-picture-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="username-input" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username-input"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5682a3]"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#5682a3] hover:bg-[#4a7398]" disabled={!newName.trim()}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings

