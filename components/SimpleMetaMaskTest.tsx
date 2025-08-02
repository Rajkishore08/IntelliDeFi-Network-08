"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/contexts/NotificationContext"
import { Wallet, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function SimpleMetaMaskTest() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isMetaMaskUnlocked, setIsMetaMaskUnlocked] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.00")
  const [network, setNetwork] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<any>({})

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
            
            if (accounts.length > 0) {
              setAddress(accounts[0])
              setIsConnected(true)
              
              // Get network info
              try {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' })
                const networkName = getNetworkName(parseInt(chainId, 16))
                setNetwork(networkName)
                
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
              } catch (error) {
                console.error('Error getting network info:', error)
              }
            }
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

  const handleSimpleConnection = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected")
      }

      // Simple connection without ethers.js
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        
        // Get network and balance
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          const networkName = getNetworkName(parseInt(chainId, 16))
          setNetwork(networkName)
          
          const balanceHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          })
          const balanceWei = parseInt(balanceHex, 16)
          const balanceEth = (balanceWei / 1e18).toFixed(4)
          setBalance(balanceEth)
        } catch (error) {
          console.error('Error getting additional info:', error)
        }
        
        addNotification({
          type: "success",
          message: "Simple connection successful!",
          duration: 3000,
        })
      } else {
        throw new Error("No accounts found")
      }
    } catch (error: any) {
      console.error('Simple connection failed:', error)
      addNotification({
        type: "error",
        message: `Simple connection failed: ${error.message}`,
        duration: 5000,
      })
    }
  }

  const handleDebugInfo = async () => {
    const info: any = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      windowEthereum: !!window.ethereum,
      ethereumMethods: [],
      error: null
    }

    try {
      if (window.ethereum) {
        // Test basic MetaMask methods
        const methods = [
          'eth_accounts',
          'eth_chainId',
          'eth_getBalance',
          'eth_requestAccounts'
        ]

        for (const method of methods) {
          try {
            if (method === 'eth_getBalance' && address) {
              await window.ethereum.request({
                method,
                params: [address, 'latest']
              })
            } else if (method === 'eth_requestAccounts') {
              // Skip this one as it requires user interaction
              continue
            } else {
              await window.ethereum.request({ method })
            }
            info.ethereumMethods.push(`${method}: OK`)
          } catch (error: any) {
            info.ethereumMethods.push(`${method}: ${error.message}`)
          }
        }
      }
    } catch (error: any) {
      info.error = error.message
    }

    setDebugInfo(info)
    console.log('Debug info:', info)
  }

  return (
    <div className="glass-panel border border-gray-700/50 rounded-xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Simple MetaMask Test (No Ethers.js)</h3>
      
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
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleSimpleConnection}
          disabled={!isMetaMaskInstalled}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Test Simple Connection (No Ethers.js)
        </Button>

        <Button
          onClick={handleDebugInfo}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Info className="h-4 w-4 mr-2" />
          Test MetaMask Methods
        </Button>
      </div>

      {Object.keys(debugInfo).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Debug Results:</h4>
          <div className="bg-gray-800/50 p-3 rounded text-sm">
            <pre className="text-gray-300 text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {!isMetaMaskInstalled && (
        <div className="text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded-lg">
          Please install MetaMask to test the connection.
        </div>
      )}
    </div>
  )
} 