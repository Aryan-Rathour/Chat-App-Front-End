"use client"

import { useState, useEffect, useRef } from "react"
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, RotateCcw } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface VideoCallProps {
  username: string
  profilePicture: string
  onClose: () => void
}

export default function VideoCall({ username, profilePicture, onClose }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [callStatus, setCallStatus] = useState<"connecting" | "connected">("connecting")
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Simulate getting local video stream
  useEffect(() => {
    let stream: MediaStream | null = null

    const getLocalStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Simulate connection delay
        setTimeout(() => {
          setCallStatus("connected")

          // Simulate remote video (just using the same stream for demo)
          if (remoteVideoRef.current && stream) {
            remoteVideoRef.current.srcObject = stream
          }
        }, 2000)
      } catch (err) {
        console.error("Error accessing media devices:", err)
        // If can't access camera, just show connecting and then connected state
        setTimeout(() => setCallStatus("connected"), 2000)
      }
    }

    getLocalStream()

    return () => {
      // Clean up streams when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
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

  // Toggle camera on/off
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)

    const stream = localVideoRef.current?.srcObject as MediaStream
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff // Toggle to opposite of current state
      })
    }
  }

  // Toggle microphone on/off
  const toggleMute = () => {
    setIsMuted(!isMuted)

    const stream = localVideoRef.current?.srcObject as MediaStream
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted // Toggle to opposite of current state
      })
    }
  }

  // Switch camera (just a UI demo, doesn't actually switch cameras)
  const switchCamera = () => {
    // In a real app, this would switch between front and back cameras
    // For this demo, we'll just show a notification
    alert("Camera switched (demo only)")
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Remote video (full screen) */}
      <div className="relative w-full h-full">
        {isVideoOff || callStatus === "connecting" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Avatar className="h-32 w-32 border-2 border-white/20">
              <AvatarImage src={profilePicture} alt={username} />
              <AvatarFallback className="text-3xl">{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}

        {/* Call status and duration */}
        <div className="absolute top-4 left-0 w-full text-center text-white">
          <div className="text-lg font-medium">{username}</div>
          <div className="text-sm opacity-80">
            {callStatus === "connecting" ? "Connecting..." : formatDuration(callDuration)}
          </div>
        </div>

        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-24 right-4 w-32 h-48 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
          {!isVideoOff ? (
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-8 w-8 text-white/70" />
            </div>
          )}
        </div>

        {/* Call controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className={`rounded-full h-12 w-12 ${isMuted ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white"}`}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={onClose}
              className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVideo}
              className={`rounded-full h-12 w-12 ${isVideoOff ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white"}`}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={switchCamera}
            className="absolute right-6 bottom-6 rounded-full h-10 w-10 bg-white/10 text-white"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

