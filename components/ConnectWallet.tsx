"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wallet, 
  Wallet2, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { useNotification } from "@/contexts/NotificationContext"

interface WalletInfo {
  address: string
  balance: string
  network: string
  chainId: number
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function ConnectWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

  const { addNotification } = useNotification()

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== "undefined" && window.ethereum) {
        setIsMetaMaskInstalled(true)
      }
    }
    checkMetaMask()
  }, [])

  // Check connection status on mount and set up event listeners
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            await handleWalletConnection()
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error)
        }
      }
    }
    checkConnection()

    // Set up MetaMask event listeners
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setIsConnected(false)
          setWalletInfo(null)
          addNotification({
            type: "info",
            message: "Wallet disconnected",
            duration: 3000,
          })
        } else {
          // User switched accounts
          handleWalletConnection()
        }
      }

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const handleWalletConnection = useCallback(async () => {
    if (typeof window === "undefined") {
      addNotification({
        type: "error",
        message: "Please use a web browser to connect wallet",
        duration: 5000,
      })
      return
    }

    if (!window.ethereum) {
      addNotification({
        type: "error",
        message: "MetaMask is not installed. Please install MetaMask to continue.",
        duration: 5000,
      })
      return
    }

    setIsConnecting(true)

    try {
      // First check if MetaMask is unlocked
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      })
      
      if (accounts.length === 0) {
        addNotification({
          type: "error",
          message: "Please unlock MetaMask and try again",
          duration: 5000,
        })
        return
      }

      // Request account access with better error handling
      const requestedAccounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      if (requestedAccounts && requestedAccounts.length > 0) {
        const account = requestedAccounts[0]
        
        // Get network info
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        const network = getNetworkName(parseInt(chainId, 16))
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest']
        })
        
        const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4)

        setWalletInfo({
          address: account,
          balance: balanceInEth,
          network,
          chainId: parseInt(chainId, 16)
        })
        
        setIsConnected(true)
        setShowDropdown(false)

        addNotification({
          type: "success",
          message: `Connected to ${network}`,
          duration: 3000,
        })
      } else {
        addNotification({
          type: "error",
          message: "No accounts found. Please create an account in MetaMask.",
          duration: 5000,
        })
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      
      if (error.code === 4001) {
        addNotification({
          type: "error",
          message: "Connection rejected by user",
          duration: 3000,
        })
      } else if (error.code === -32002) {
        addNotification({
          type: "error",
          message: "MetaMask request already pending. Please check MetaMask.",
          duration: 5000,
        })
      } else if (error.message?.includes('User rejected')) {
        addNotification({
          type: "error",
          message: "Connection rejected by user",
          duration: 3000,
        })
      } else {
        addNotification({
          type: "error",
          message: `Failed to connect wallet: ${error.message || 'Unknown error'}`,
          duration: 5000,
        })
      }
    } finally {
      setIsConnecting(false)
    }
  }, [addNotification])

  const disconnectWallet = useCallback(() => {
    setIsConnected(false)
    setWalletInfo(null)
    setShowDropdown(false)
    
    addNotification({
      type: "success",
      message: "Wallet disconnected",
      duration: 3000,
    })
  }, [addNotification])

  const copyAddress = useCallback(async () => {
    if (walletInfo?.address) {
      try {
        await navigator.clipboard.writeText(walletInfo.address)
        addNotification({
          type: "success",
          message: "Address copied to clipboard",
          duration: 2000,
        })
      } catch (error) {
        addNotification({
          type: "error",
          message: "Failed to copy address",
          duration: 2000,
        })
      }
    }
  }, [walletInfo?.address, addNotification])

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

  const getNetworkColor = (chainId: number): string => {
    switch (chainId) {
      case 1:
        return "bg-blue-500/20 text-blue-400"
      case 137:
        return "bg-purple-500/20 text-purple-400"
      case 56:
        return "bg-yellow-500/20 text-yellow-400"
      case 42161:
        return "bg-blue-500/20 text-blue-400"
      case 10:
        return "bg-red-500/20 text-red-400"
      case 8453:
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isConnected ? (
          // Connected State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <Button
              onClick={() => setShowDropdown(!showDropdown)}
              variant="ghost"
              className="glass-panel border-green-500/30 hover:border-green-400/50 text-green-300 hover:text-green-200 px-4 py-2"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden md:inline">
                  {walletInfo?.address.slice(0, 6)}...{walletInfo?.address.slice(-4)}
                </span>
                {showDropdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </Button>

            {/* Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-80 glass-panel border border-gray-700/50 rounded-lg shadow-xl z-50"
                >
                  <div className="p-4 space-y-4">
                    {/* Wallet Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Address</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyAddress}
                          className="h-6 px-2 text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded text-sm font-mono">
                        {walletInfo?.address}
                      </div>
                    </div>

                    {/* Network */}
                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">Network</span>
                      <Badge className={getNetworkColor(walletInfo?.chainId || 0)}>
                        {walletInfo?.network}
                      </Badge>
                    </div>

                    {/* Balance */}
                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">Balance</span>
                      <div className="text-lg font-semibold text-white">
                        {walletInfo?.balance} ETH
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-gray-700/50">
                      <Button
                        onClick={disconnectWallet}
                        variant="ghost"
                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Disconnect Wallet
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Disconnected State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Button
              onClick={handleWalletConnection}
              disabled={isConnecting || !isMetaMaskInstalled}
              className="glass-panel border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 px-4 py-2"
            >
              <div className="flex items-center space-x-2">
                {isConnecting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                ) : (
                  <Wallet2 className="h-4 w-4" />
                )}
                <span className="hidden md:inline">
                  {isConnecting ? "Connecting..." : isMetaMaskInstalled ? "Connect Wallet" : "Install MetaMask"}
                </span>
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MetaMask Not Installed Warning */}
      <AnimatePresence>
        {!isMetaMaskInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-80 glass-panel border border-yellow-500/30 rounded-lg p-4 z-50"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-300">MetaMask Required</h4>
                <p className="text-sm text-gray-300">
                  Please install MetaMask to connect your wallet and access all features.
                </p>
                <Button
                  onClick={() => window.open('https://metamask.io/download/', '_blank')}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Install MetaMask
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 