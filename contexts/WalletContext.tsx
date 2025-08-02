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

      // Wait for MetaMask to be available
      let attempts = 0
      const maxAttempts = 10
      
      while (!window.ethereum && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }

      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install MetaMask.")
      }

      // Check if MetaMask is unlocked with retry logic
      let accounts: string[] = []
      let accountAttempts = 0
      const maxAccountAttempts = 5
      
      while (accountAttempts < maxAccountAttempts) {
        try {
          accounts = await window.ethereum.request({ method: 'eth_accounts' })
          break
        } catch (error) {
          console.error(`Account check attempt ${accountAttempts + 1} failed:`, error)
          accountAttempts++
          if (accountAttempts >= maxAccountAttempts) {
            throw new Error("Failed to check MetaMask accounts after multiple attempts")
          }
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      if (accounts.length === 0) {
        // Request account access with retry logic
        let requestAttempts = 0
        const maxRequestAttempts = 3
        
        while (requestAttempts < maxRequestAttempts) {
          try {
            accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            })
            break
          } catch (error: any) {
            console.error(`Request accounts attempt ${requestAttempts + 1} failed:`, error)
            requestAttempts++
            
            if (error.code === 4001) {
              throw new Error("Connection rejected by user")
            } else if (error.code === -32002) {
              throw new Error("MetaMask request already pending. Please check MetaMask.")
            } else if (requestAttempts >= maxRequestAttempts) {
              throw new Error("Failed to request accounts after multiple attempts: " + (error.message || 'Unknown error'))
            }
            
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found. Please create an account in MetaMask.")
        }
      }

      // Create ethers provider with retry logic
      let ethersProvider: ethers.BrowserProvider
      let signer: ethers.JsonRpcSigner
      let userAddress: string
      
      let providerAttempts = 0
      const maxProviderAttempts = 3
      
      while (providerAttempts < maxProviderAttempts) {
        try {
          ethersProvider = new ethers.BrowserProvider(window.ethereum)
          signer = await ethersProvider.getSigner()
          userAddress = await signer.getAddress()
          break
        } catch (error) {
          console.error(`Provider creation attempt ${providerAttempts + 1} failed:`, error)
          providerAttempts++
          if (providerAttempts >= maxProviderAttempts) {
            throw new Error("Failed to create ethers provider after multiple attempts")
          }
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }
      
      // Get ETH balance with retry logic
      let balanceBig: bigint
      let balanceAttempts = 0
      const maxBalanceAttempts = 3
      
      while (balanceAttempts < maxBalanceAttempts) {
        try {
          balanceBig = await ethersProvider!.getBalance(userAddress!)
          break
        } catch (error) {
          console.error(`Balance fetch attempt ${balanceAttempts + 1} failed:`, error)
          balanceAttempts++
          if (balanceAttempts >= maxBalanceAttempts) {
            // Use fallback balance if we can't fetch it
            balanceBig = BigInt(0)
            break
          }
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      const balanceFormatted = ethers.formatEther(balanceBig || BigInt(0))
      
      // Update state
      setIsConnected(true)
      setAddress(userAddress!)
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
