"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, CheckCircle, AlertCircle, Info, RefreshCw } from "lucide-react"

export default function Web3MetaMaskTest() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.00")
  const [network, setNetwork] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [web3Provider, setWeb3Provider] = useState<any>(null)

  useEffect(() => {
    checkMetaMaskStatus()
  }, [])

  const checkMetaMaskStatus = async () => {
    if (typeof window === "undefined") return

    // Check if MetaMask is installed
    if (window.ethereum) {
      setIsMetaMaskInstalled(true)
      
      try {
        // Try to create a Web3 provider
        const Web3 = await import('web3')
        const web3 = new Web3.default(window.ethereum)
        setWeb3Provider(web3)
        
        // Check if MetaMask is unlocked
        const accounts = await web3.eth.getAccounts()
        
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          setError(null)
          
          // Get network info
          try {
            const chainId = await web3.eth.getChainId()
            const networkName = getNetworkName(Number(chainId))
            setNetwork(networkName)
          } catch (error) {
            console.error('Error getting network info:', error)
          }
          
          // Get balance
          try {
            const balanceWei = await web3.eth.getBalance(accounts[0])
            const balanceEth = web3.utils.fromWei(balanceWei, 'ether')
            setBalance(parseFloat(balanceEth).toFixed(4))
          } catch (error) {
            console.error('Error getting balance:', error)
          }
        }
      } catch (error) {
        console.error('Error checking MetaMask status:', error)
        setError("Failed to check MetaMask status")
      }
    } else {
      setIsMetaMaskInstalled(false)
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
      // Use Web3 to request accounts
      const Web3 = await import('web3')
      const web3 = new Web3.default(window.ethereum)
      
      const accounts = await web3.eth.requestAccounts()

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        setWeb3Provider(web3)
        
        // Get network info
        try {
          const chainId = await web3.eth.getChainId()
          const networkName = getNetworkName(Number(chainId))
          setNetwork(networkName)
        } catch (error) {
          console.error('Error getting network info:', error)
        }
        
        // Get balance
        try {
          const balanceWei = await web3.eth.getBalance(accounts[0])
          const balanceEth = web3.utils.fromWei(balanceWei, 'ether')
          setBalance(parseFloat(balanceEth).toFixed(4))
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
    setWeb3Provider(null)
  }

  const handleRefresh = () => {
    checkMetaMaskStatus()
  }

  const handleTestWeb3 = async () => {
    if (!web3Provider) {
      setError("Web3 provider not available")
      return
    }

    try {
      // Test Web3 methods
      const accounts = await web3Provider.eth.getAccounts()
      const chainId = await web3Provider.eth.getChainId()
      const blockNumber = await web3Provider.eth.getBlockNumber()
      
      console.log('Web3 test results:', {
        accounts: accounts.length,
        chainId: Number(chainId),
        blockNumber: Number(blockNumber)
      })
      
      setError(null)
    } catch (error: any) {
      console.error('Web3 test failed:', error)
      setError(`Web3 test failed: ${error.message}`)
    }
  }

  return (
    <div className="glass-panel border border-gray-700/50 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Web3 MetaMask Test</h3>
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

          {web3Provider && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">
                Web3 Provider: Available
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
                Connect with Web3
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={handleDisconnect}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Disconnect
            </Button>
            <Button
              onClick={handleTestWeb3}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Test Web3 Methods
            </Button>
          </div>
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