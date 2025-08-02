"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, CheckCircle, AlertCircle, Info, RefreshCw } from "lucide-react"

export default function IsolatedMetaMaskTest() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isMetaMaskUnlocked, setIsMetaMaskUnlocked] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.00")
  const [network, setNetwork] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkMetaMaskStatus()
  }, [])

  const checkMetaMaskStatus = async () => {
    if (typeof window === "undefined") return

    // Check if MetaMask is installed
    if (window.ethereum) {
      setIsMetaMaskInstalled(true)
      
      // Check if MetaMask is unlocked
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setIsMetaMaskUnlocked(accounts.length > 0)
        
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          setError(null)
          
          // Get network info
          try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' })
            const networkName = getNetworkName(parseInt(chainId, 16))
            setNetwork(networkName)
          } catch (error) {
            console.error('Error getting network info:', error)
          }
          
          // Get balance
          try {
            const balanceHex = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest']
            })
            const balanceWei = parseInt(balanceHex, 16)
            const balanceEth = (balanceWei / 1e18).toFixed(4)
            setBalance(balanceEth)
          } catch (error) {
            console.error('Error getting balance:', error)
          }
        }
      } catch (error) {
        console.error('Error checking MetaMask status:', error)
        setIsMetaMaskUnlocked(false)
        setError("Failed to check MetaMask status")
      }
    } else {
      setIsMetaMaskInstalled(false)
      setIsMetaMaskUnlocked(false)
    }
  }

  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet"
      case 137:
        return "Polygon"
      case 56:
        return "BSC"
      case 42161:
        return "Arbitrum"
      case 10:
        return "Optimism"
      case 8453:
        return "Base"
      default:
        return `Chain ID: ${chainId}`
    }
  }

  const handleConnect = async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request accounts
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        
        // Get network info
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          const networkName = getNetworkName(parseInt(chainId, 16))
          setNetwork(networkName)
        } catch (error) {
          console.error('Error getting network info:', error)
        }
        
        // Get balance
        try {
          const balanceHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          })
          const balanceWei = parseInt(balanceHex, 16)
          const balanceEth = (balanceWei / 1e18).toFixed(4)
          setBalance(balanceEth)
        } catch (error) {
          console.error('Error getting balance:', error)
        }
      } else {
        setError("No accounts found")
      }
    } catch (error: any) {
      console.error('Connection failed:', error)
      
      if (error.code === 4001) {
        setError("Connection rejected by user")
      } else if (error.code === -32002) {
        setError("MetaMask request already pending")
      } else {
        setError(error.message || "Connection failed")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0.00")
    setNetwork("")
    setError(null)
  }

  const handleRefresh = () => {
    checkMetaMaskStatus()
  }

  return (
    <div className="glass-panel border border-gray-700/50 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Isolated MetaMask Test</h3>
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {network && (
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-400" />
            <span className="text-gray-300">Network: {network}</span>
          </div>
        )}

        {balance !== "0.00" && (
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-400" />
            <span className="text-gray-300">Balance: {balance} ETH</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">Error: {error}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            disabled={!isMetaMaskInstalled || isConnecting}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isConnecting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect MetaMask
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleDisconnect}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Disconnect
          </Button>
        )}
      </div>

      {!isMetaMaskInstalled && (
        <div className="text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded-lg">
          Please install MetaMask to test the connection.
        </div>
      )}
    </div>
  )
} 