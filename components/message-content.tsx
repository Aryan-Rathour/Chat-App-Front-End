"use client"

import { useState } from "react"
import { FileText, MapPin, Play, Pause, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MessageContentProps {
  content: any
  type: string
}

export default function MessageContent({ content, type }: MessageContentProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  if (type === "text") {
    return <p className="whitespace-pre-wrap break-words">{content}</p>
  }

  if (type === "image") {
    return (
      <div className="relative">
        <img
          src={content || "/placeholder.svg"}
          alt="Image"
          className={`rounded-md max-w-full cursor-pointer ${isImageExpanded ? "max-h-96" : "max-h-48"}`}
          onClick={() => setIsImageExpanded(!isImageExpanded)}
        />
      </div>
    )
  }

  if (type === "document") {
    const fileName = content.name || "Document"
    const fileSize = content.size ? formatFileSize(content.size) : ""

    return (
      <div className="flex items-center gap-3 p-2 bg-white/50 rounded-md">
        <div className="w-10 h-10 rounded-md bg-[#5682a3]/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-[#5682a3]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <p className="text-xs text-gray-500">{fileSize}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#5682a3]"
          onClick={() => window.open(content.url || content, "_blank")}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (type === "audio") {
    return (
      <div className="flex items-center gap-3 p-2 bg-white/50 rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-[#5682a3] text-white"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-1 h-1 bg-gray-200 rounded-full">
          <div className="h-full w-1/3 bg-[#5682a3] rounded-full"></div>
        </div>
        <span className="text-xs text-gray-500">0:30</span>
      </div>
    )
  }

  if (type === "location") {
    let locationData = { latitude: "0", longitude: "0" }

    try {
      if (typeof content === "string") {
        locationData = JSON.parse(content)
      } else {
        locationData = content
      }
    } catch (e) {
      console.error("Failed to parse location data", e)
    }

    return (
      <div className="relative">
        <div className="bg-gray-200 rounded-md h-32 w-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-[#5682a3]" />
          </div>
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${locationData.latitude},${locationData.longitude}&zoom=13&size=300x150&markers=color:red%7C${locationData.latitude},${locationData.longitude}&key=YOUR_API_KEY`}
            alt="Map location"
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              // If the Google Maps image fails to load (no API key), show a fallback
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
        <div className="mt-1 text-xs text-center text-gray-500">
          Location: {locationData.latitude}, {locationData.longitude}
        </div>
      </div>
    )
  }

  // Default fallback
  return <p className="whitespace-pre-wrap break-words">{content}</p>
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

