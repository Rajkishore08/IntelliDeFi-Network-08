"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"
import { Wallet, CheckCircle, AlertCircle } from "lucide-react"

export default function MetaMaskTest() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isMetaMaskUnlocked, setIsMetaMaskUnlocked] = useState(false)
  const { isConnected, address, connect } = useWallet()
  const { addNotification } = useNotification()

  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window !== "undefined") {
        // Check if MetaMask is installed
        if (window.ethereum) {
          setIsMetaMaskInstalled(true)
          
          // Check if MetaMask is unlocked
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            setIsMetaMaskUnlocked(accounts.length > 0)
          } catch (error) {
            console.error('Error checking MetaMask unlock status:', error)
            setIsMetaMaskUnlocked(false)
          }
        } else {
          setIsMetaMaskInstalled(false)
          setIsMetaMaskUnlocked(false)
        }
      }
    }

    checkMetaMask()
  }, [])

  const handleTestConnection = async () => {
    try {
      await connect()
      addNotification({
        type: "success",
        message: "MetaMask connection successful!",
        duration: 3000,
      })
    } catch (error: any) {
      addNotification({
        type: "error",
        message: `Connection failed: ${error.message}`,
        duration: 5000,
      })
    }
  }

  return (
    <div className="glass-panel border border-gray-700/50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">MetaMask Connection Test</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {isMetaMaskInstalled ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
          <span className="text-gray-300">
            MetaMask Installed: {isMetaMaskInstalled ? "Yes" : "No"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isMetaMaskUnlocked ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          )}
          <span className="text-gray-300">
            MetaMask Unlocked: {isMetaMaskUnlocked ? "Yes" : "No"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
          <span className="text-gray-300">
            Connected: {isConnected ? "Yes" : "No"}
          </span>
        </div>

        {address && (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-gray-300">
              Address: {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        )}
      </div>

      <Button
        onClick={handleTestConnection}
        disabled={!isMetaMaskInstalled}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Wallet className="h-4 w-4 mr-2" />
        Test MetaMask Connection
      </Button>

      {!isMetaMaskInstalled && (
        <div className="text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded-lg">
          Please install MetaMask to test the connection.
        </div>
      )}
    </div>
  )
} 