"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import { ethers } from "ethers"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.00")

  const connect = useCallback(async () => {
    try {
      const provider: any = await detectEthereumProvider()
      if (provider) {
        // Request account access if needed
        await provider.request({ method: 'eth_requestAccounts' })
        const ethersProvider = new ethers.BrowserProvider(provider)
        const signer = await ethersProvider.getSigner()
        const userAddress = await signer.getAddress()
        setIsConnected(true)
        setAddress(userAddress)
        // Get ETH balance
        const balanceBig = await ethersProvider.getBalance(userAddress)
        setBalance(ethers.formatEther(balanceBig))
      } else {
        throw new Error("MetaMask not detected. Please install MetaMask.")
      }
    } catch (error) {
      setIsConnected(false)
      setAddress(null)
      setBalance("0.00")
      console.error("Failed to connect wallet:", error)
      alert("Failed to connect wallet: " + (error instanceof Error ? error.message : error))
    }
  }, [])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0.00")
    // Optionally, you can clear provider state or reload the page
  }, [])

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
