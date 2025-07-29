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
      </head>
          <body>
            <header className="w-full flex items-center justify-between px-6 py-4 border-b border-blue-500/20 bg-black/60">
              <div className="flex items-center space-x-3">
                <img src="/logo_eth_global.png" alt="Logo" className="h-10 w-10 rounded-full border border-blue-400 bg-white object-contain" />
                <span className="text-2xl font-bold text-blue-300 tracking-wide">IntelliDeFi Network</span>
              </div>
              {/* ...existing code... */}
            </header>
            {children}
          </body>
    </html>
  )
}
