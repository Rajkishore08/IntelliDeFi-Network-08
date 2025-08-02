"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"
import { Wallet, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const { isConnected, address, connect } = useWallet()
  const { addNotification } = useNotification()

  useEffect(() => {
    const gatherDebugInfo = async () => {
      const info: any = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        windowEthereum: typeof window !== "undefined" ? !!window.ethereum : false,
        ethereumProvider: null,
        accounts: [],
        chainId: null,
        error: null
      }

      try {
        if (typeof window !== "undefined" && window.ethereum) {
          info.ethereumProvider = "Available"
          
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            info.accounts = accounts
            
            const chainId = await window.ethereum.request({ method: 'eth_chainId' })
            info.chainId = chainId
          } catch (error: any) {
            info.error = error.message
          }
        }
      } catch (error: any) {
        info.error = error.message
      }

      setDebugInfo(info)
    }

    gatherDebugInfo()
  }, [])

  const handleTestConnection = async () => {
    try {
      await connect()
      addNotification({
        type: "success",
        message: "Connection successful!",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">MetaMask Debug Page</h1>
          <p className="text-gray-400">Debug information for MetaMask connection issues</p>
        </div>

        <div className="glass-panel border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Connection Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              <span className="text-gray-300">Connected: {isConnected ? "Yes" : "No"}</span>
            </div>
            
            {address && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Address: {address}</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleTestConnection}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
        </div>

        <div className="glass-panel border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Debug Information</h2>
          <div className="space-y-4">
            {Object.entries(debugInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start">
                <span className="text-gray-400 font-mono text-sm">{key}:</span>
                <span className="text-gray-300 font-mono text-sm max-w-md break-all">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Troubleshooting Steps</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">1. Check MetaMask Installation</h3>
                <p className="text-sm text-gray-400">Ensure MetaMask is installed and unlocked</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">2. Check Network</h3>
                <p className="text-sm text-gray-400">Make sure you're connected to a supported network (Ethereum, Polygon, etc.)</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">3. Clear Browser Cache</h3>
                <p className="text-sm text-gray-400">Try clearing your browser cache and reloading the page</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">4. Check Console Errors</h3>
                <p className="text-sm text-gray-400">Open browser developer tools and check for any JavaScript errors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 