"use client"
import { useRouter } from "next/navigation";

export default function Hero() {

  const router = useRouter()
  function handleClick(){
    router.push('/chat')
  }
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Connect Instantly with <span className="text-yellow-300">Chatter</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Your fast, secure, and modern real-time chat application. Chat freely, wherever you are.
        </p>
        <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition" onClick={handleClick}>
          Get Started
        </button>
      </section>
    );
  }
  