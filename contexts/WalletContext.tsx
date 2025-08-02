"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
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

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask.")
      }

      // Check if MetaMask is unlocked
      let accounts: string[] = []
      try {
        accounts = await window.ethereum.request({ method: 'eth_accounts' })
      } catch (error) {
        console.error('Error checking accounts:', error)
        throw new Error("Failed to check MetaMask accounts")
      }
      
      if (accounts.length === 0) {
        // Request account access
        try {
          accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          })
        } catch (error: any) {
          if (error.code === 4001) {
            throw new Error("Connection rejected by user")
          } else if (error.code === -32002) {
            throw new Error("MetaMask request already pending. Please check MetaMask.")
          } else {
            throw new Error("Failed to request accounts: " + (error.message || 'Unknown error'))
          }
        }
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found. Please create an account in MetaMask.")
        }
      }

      // Create ethers provider and get signer
      const ethersProvider = new ethers.BrowserProvider(window.ethereum)
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
