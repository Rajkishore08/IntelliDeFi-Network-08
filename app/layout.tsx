import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/contexts/WalletContext"
import { NotificationProvider } from "@/contexts/NotificationContext"
import ErrorBoundary from "@/components/ErrorBoundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IntelliDeFi Network",
  description: "AI-Powered Cross-Chain DeFi Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <NotificationProvider>
            <WalletProvider>
              {children}
            </WalletProvider>
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
