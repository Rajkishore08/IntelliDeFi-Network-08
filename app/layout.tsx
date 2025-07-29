import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  // ...existing code...
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        {/* Favicon for browser tab */}
        <link rel="icon" type="image/png" href="/logo_eth_global.png" />
      </head>
          <body>
            {/* Header logo removed, only sidebar logo remains */}
            {children}
          </body>
    </html>
  )
}
