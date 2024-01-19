import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import ToasterProvider from '@/providers/ToasterProvider'
import ConfettiProvider from '@/providers/ConfettiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Learnitees',
  description: 'Start learning online now !! ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToasterProvider />
          {children}
        </body>

      </html>
    </ClerkProvider>
  )
}
