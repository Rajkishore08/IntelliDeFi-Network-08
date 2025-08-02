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
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        throw new Error("Please use a web browser to connect wallet")
      }

      // Detect MetaMask provider
      const provider: any = await detectEthereumProvider({ mustBeMetaMask: true })
      
      if (!provider) {
        throw new Error("MetaMask not detected. Please install MetaMask.")
      }

      // Check if MetaMask is unlocked
      const accounts = await provider.request({ method: 'eth_accounts' })
      
      if (accounts.length === 0) {
        // Request account access
        const requestedAccounts = await provider.request({ 
          method: 'eth_requestAccounts' 
        })
        
        if (!requestedAccounts || requestedAccounts.length === 0) {
          throw new Error("No accounts found. Please create an account in MetaMask.")
        }
      }

      // Create ethers provider and get signer
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      const userAddress = await signer.getAddress()
      
      // Get ETH balance
      const balanceBig = await ethersProvider.getBalance(userAddress)
      const balanceFormatted = ethers.formatEther(balanceBig)
      
      // Update state
      setIsConnected(true)
      setAddress(userAddress)
      setBalance(balanceFormatted)
      
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      
      // Reset state on error
      setIsConnected(false)
      setAddress(null)
      setBalance("0.00")
      
      // Re-throw the error for the component to handle
      throw error
    }
  }, [])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0.00")
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
