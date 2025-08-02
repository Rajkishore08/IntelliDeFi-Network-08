"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

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

      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask.")
      }

      // Use a more direct approach without ethers.js initially
      let accounts: string[] = []
      
      try {
        // First check if we already have accounts
        accounts = await window.ethereum.request({ method: 'eth_accounts' })
      } catch (error) {
        console.error('Error checking existing accounts:', error)
      }
      
      if (accounts.length === 0) {
        // Request accounts if none are available
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

      const userAddress = accounts[0]
      
      // Get balance directly from MetaMask
      let balanceFormatted = "0.00"
      try {
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [userAddress, 'latest']
        })
        const balanceWei = parseInt(balanceHex, 16)
        balanceFormatted = (balanceWei / 1e18).toFixed(4)
      } catch (error) {
        console.error('Error getting balance:', error)
        balanceFormatted = "0.00"
      }
      
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
