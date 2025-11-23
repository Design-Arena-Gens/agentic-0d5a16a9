import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'App Icon - Cyber Container',
  description: 'Dark glass shipping container with glowing neon elements',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
