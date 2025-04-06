"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Paperclip, Image, File, MapPin, Mic, VoteIcon as Poll } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AttachmentMenuProps {
  onFileSelect: (file: File, type: string) => void
}

export default function AttachmentMenu({ onFileSelect }: AttachmentMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    imageInputRef.current?.click()
    setIsOpen(false)
  }

  const handleDocumentClick = () => {
    documentInputRef.current?.click()
    setIsOpen(false)
  }

  const handleAudioClick = () => {
    audioInputRef.current?.click()
    setIsOpen(false)
  }

  const handleLocationClick = () => {
    // For demo purposes, we'll just send a random location
    const latitude = (Math.random() * 180 - 90).toFixed(6)
    const longitude = (Math.random() * 360 - 180).toFixed(6)

    // Create a mock file with location data
    const locationData = JSON.stringify({ latitude, longitude })
    const blob = new Blob([locationData], { type: "application/json" })
    // const file = new File([blob], "location.json", { type: "application/json" })

    // onFileSelect(file, "location")
    setIsOpen(false)
  }

  const handlePollClick = () => {
    alert("Poll creation is not implemented in this demo")
    setIsOpen(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file, type)
    }
    // Reset the input
    e.target.value = ""
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-500 hover:text-[#5682a3] transition-colors p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg p-2 z-10 w-56">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleImageClick}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#5682a3]/10 flex items-center justify-center mb-1">
                <Image className="h-5 w-5 text-[#5682a3]" />
              </div>
              <span className="text-xs text-gray-700">Photo</span>
            </button>

            <button
              onClick={handleDocumentClick}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#5682a3]/10 flex items-center justify-center mb-1">
                <File className="h-5 w-5 text-[#5682a3]" />
              </div>
              <span className="text-xs text-gray-700">File</span>
            </button>

            <button
              onClick={handleLocationClick}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#5682a3]/10 flex items-center justify-center mb-1">
                <MapPin className="h-5 w-5 text-[#5682a3]" />
              </div>
              <span className="text-xs text-gray-700">Location</span>
            </button>

            <button
              onClick={handleAudioClick}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#5682a3]/10 flex items-center justify-center mb-1">
                <Mic className="h-5 w-5 text-[#5682a3]" />
              </div>
              <span className="text-xs text-gray-700">Audio</span>
            </button>

            <button
              onClick={handlePollClick}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#5682a3]/10 flex items-center justify-center mb-1">
                <Poll className="h-5 w-5 text-[#5682a3]" />
              </div>
              <span className="text-xs text-gray-700">Poll</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileChange(e, "image")}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={documentInputRef}
        onChange={(e) => handleFileChange(e, "document")}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
        className="hidden"
      />
      <input
        type="file"
        ref={audioInputRef}
        onChange={(e) => handleFileChange(e, "audio")}
        accept="audio/*"
        className="hidden"
      />
    </div>
  )
}

