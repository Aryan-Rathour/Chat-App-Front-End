"use client"

import { useState, useEffect } from "react"
import { X, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface VoiceCallProps {
  username: string
  profilePicture: string
  onClose: () => void
}

export default function VoiceCall({ username, profilePicture, onClose }: VoiceCallProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOff, setIsSpeakerOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [callStatus, setCallStatus] = useState<"connecting" | "connected">("connecting")

  // Simulate call connecting
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus("connected")
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (callStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [callStatus])

  // Format call duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-between p-6">
      <div className="w-full flex justify-end">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 rounded-full">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <Avatar className="h-32 w-32 mb-6 border-2 border-white/20">
          <AvatarImage src={profilePicture} alt={username} />
          <AvatarFallback className="text-3xl">{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <h2 className="text-2xl font-semibold text-white mb-2">{username}</h2>

        <div className="text-white/70 mb-6">
          {callStatus === "connecting" ? "Connecting..." : formatDuration(callDuration)}
        </div>

        <div className="flex gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={`rounded-full h-14 w-14 ${isMuted ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white"}`}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSpeakerOff(!isSpeakerOff)}
            className={`rounded-full h-14 w-14 ${isSpeakerOff ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white"}`}
          >
            {isSpeakerOff ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <Button
        variant="destructive"
        className="rounded-full px-8 py-6 mt-6 bg-red-600 hover:bg-red-700"
        onClick={onClose}
      >
        End Call
      </Button>
    </div>
  )
}

