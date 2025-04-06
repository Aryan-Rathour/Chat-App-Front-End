import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Created by Aryan Rathour',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
