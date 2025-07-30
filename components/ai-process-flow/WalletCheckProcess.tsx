"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Shield,
  Network,
  Coins,
  Activity
} from "lucide-react"

interface WalletStatus {
  connected: boolean
  address: string
  balance: number
  network: string
  gasBalance: number
  lastActivity: string
}

interface ProcessStep {
  id: string
  title: string
  description: string
  status: "pending" | "processing" | "completed" | "error"
  details?: string
  duration?: number
}

const initialSteps: ProcessStep[] = [
  {
    id: "connect",
    title: "Wallet Connection",
    description: "Establishing secure connection to wallet",
    status: "pending"
  },
  {
    id: "network",
    title: "Network Detection",
    description: "Detecting active blockchain network",
    status: "pending"
  },
  {
    id: "balance",
    title: "Balance Check",
    description: "Fetching token balances and assets",
    status: "pending"
  },
  {
    id: "gas",
    title: "Gas Estimation",
    description: "Calculating transaction gas requirements",
    status: "pending"
  },
  {
    id: "permissions",
    title: "Permission Verification",
    description: "Checking wallet permissions and allowances",
    status: "pending"
  },
  {
    id: "security",
    title: "Security Validation",
    description: "Validating wallet security and integrity",
    status: "pending"
  }
]

export const WalletCheckProcess = React.memo(function WalletCheckProcess() {
  const [walletStatus, setWalletStatus] = useState<WalletStatus | null>(null)
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  const mockWalletStatus: WalletStatus = {
    connected: true,
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    balance: 12450.25,
    network: "Ethereum Mainnet",
    gasBalance: 0.045,
    lastActivity: "2 hours ago"
  }

  useEffect(() => {
    setProcessSteps(initialSteps)
  }, [])

  const startWalletCheck = async () => {
    setIsChecking(true)
    setCurrentStep(0)

    // Simulate wallet check process
    for (let i = 0; i < initialSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
      
      setProcessSteps(prev => prev.map((step, index) => {
        if (index === i) {
          return { ...step, status: "processing" as const }
        }
        return step
      }))

      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300))

      setProcessSteps(prev => prev.map((step, index) => {
        if (index === i) {
          return { 
            ...step, 
            status: "completed" as const,
            details: getStepDetails(step.id)
          }
        }
        return step
      }))

      setCurrentStep(i + 1)
    }

    setWalletStatus(mockWalletStatus)
    setIsChecking(false)
  }

  const getStepDetails = (stepId: string): string => {
    const details = {
      connect: "Connected to MetaMask wallet",
      network: "Detected Ethereum Mainnet (Chain ID: 1)",
      balance: "Found 12,450.25 USDC, 2.5 ETH, 150 DAI",
      gas: "Estimated gas: 0.002 ETH for swap transaction",
      permissions: "Approved 1inch router for USDC spending",
      security: "Wallet security validated - no suspicious activity"
    }
    return details[stepId as keyof typeof details] || "Step completed successfully"
  }

  const getStepIcon = (step: ProcessStep) => {
    const iconProps = { className: "h-5 w-5" }

    switch (step.status) {
      case "completed":
        return <CheckCircle {...iconProps} className="h-5 w-5 text-green-500" />
      case "processing":
        return <Activity {...iconProps} className="h-5 w-5 animate-spin text-blue-500" />
      case "error":
        return <AlertCircle {...iconProps} className="h-5 w-5 text-red-500" />
      default:
        return <Clock {...iconProps} className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepColor = (step: ProcessStep) => {
    switch (step.status) {
      case "completed":
        return "border-green-500/30 bg-green-500/5"
      case "processing":
        return "border-blue-500/30 bg-blue-500/5"
      case "error":
        return "border-red-500/30 bg-red-500/5"
      default:
        return "border-gray-500/30 bg-gray-500/5"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-blue-400" />
            <span>Wallet Check Process</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Process Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Verification Steps</h3>
              <Badge variant={isChecking ? "default" : "secondary"}>
                {isChecking ? "Checking..." : "Ready"}
              </Badge>
            </div>

            <div className="space-y-3">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${getStepColor(step)} transition-all duration-300`}
                >
                  <div className="flex items-center space-x-3">
                    {getStepIcon(step)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{step.title}</h4>
                        <Badge 
                          variant={
                            step.status === "completed" ? "default" :
                            step.status === "processing" ? "secondary" :
                            step.status === "error" ? "destructive" : "outline"
                          }
                          className="text-xs"
                        >
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                      {step.details && (
                        <p className="text-xs text-green-400 mt-2">{step.details}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round((currentStep / processSteps.length) * 100)}%</span>
              </div>
              <Progress value={(currentStep / processSteps.length) * 100} className="h-2" />
            </div>

            {/* Start Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={startWalletCheck}
                disabled={isChecking}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 rounded-lg font-medium transition-all duration-200"
              >
                {isChecking ? "Checking Wallet..." : "Start Wallet Check"}
              </button>
            </motion.div>
          </div>

          {/* Wallet Status Display */}
          <AnimatePresence>
            {walletStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-green-300">Wallet Connected Successfully</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Address:</span>
                      <span className="text-white font-mono text-sm">{walletStatus.address.slice(0, 6)}...{walletStatus.address.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white">{walletStatus.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Balance:</span>
                      <span className="text-white font-semibold">${walletStatus.balance.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas Balance:</span>
                      <span className="text-white">{walletStatus.gasBalance} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Activity:</span>
                      <span className="text-white">{walletStatus.lastActivity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
} 