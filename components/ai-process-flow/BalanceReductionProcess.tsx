"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingDown, 
  TrendingUp, 
  Coins, 
  Calculator,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"

interface BalanceUpdate {
  token: string
  symbol: string
  beforeAmount: number
  afterAmount: number
  change: number
  changePercent: number
  price: number
  value: number
}

interface TransactionStep {
  id: string
  title: string
  description: string
  status: "pending" | "processing" | "completed" | "error"
  balanceUpdates?: BalanceUpdate[]
  gasUsed?: number
  fees?: number
}

export function BalanceReductionProcess() {
  const [transactionSteps, setTransactionSteps] = useState<TransactionStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [totalFees, setTotalFees] = useState(0)

  const mockBalanceUpdates: BalanceUpdate[] = [
    {
      token: "USDC",
      symbol: "USDC",
      beforeAmount: 1000,
      afterAmount: 900,
      change: -100,
      changePercent: -10,
      price: 1.00,
      value: 100
    },
    {
      token: "ETH",
      symbol: "ETH",
      beforeAmount: 2.5,
      afterAmount: 2.5,
      change: 0,
      changePercent: 0,
      price: 2500,
      value: 0
    },
    {
      token: "ETH",
      symbol: "ETH",
      beforeAmount: 2.5,
      afterAmount: 2.54,
      change: 0.04,
      changePercent: 1.6,
      price: 2500,
      value: 100
    }
  ]

  const initialSteps: TransactionStep[] = [
    {
      id: "validate",
      title: "Transaction Validation",
      description: "Validating transaction parameters and balances",
      status: "pending"
    },
    {
      id: "calculate",
      title: "Fee Calculation",
      description: "Calculating gas fees and slippage",
      status: "pending"
    },
    {
      id: "approve",
      title: "Token Approval",
      description: "Approving token spending allowance",
      status: "pending"
    },
    {
      id: "execute",
      title: "Transaction Execution",
      description: "Executing swap transaction on blockchain",
      status: "pending"
    },
    {
      id: "confirm",
      title: "Transaction Confirmation",
      description: "Waiting for blockchain confirmation",
      status: "pending"
    },
    {
      id: "update",
      title: "Balance Update",
      description: "Updating wallet balances and portfolio",
      status: "pending"
    }
  ]

  useEffect(() => {
    setTransactionSteps(initialSteps)
  }, [])

  const startTransaction = async () => {
    setIsProcessing(true)
    setCurrentStep(0)
    setTotalFees(0)

    // Simulate transaction process
    for (let i = 0; i < initialSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500))
      
      setTransactionSteps(prev => prev.map((step, index) => {
        if (index === i) {
          return { ...step, status: "processing" as const }
        }
        return step
      }))

      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))

      // Add balance updates for specific steps
      let balanceUpdates: BalanceUpdate[] = []
      let gasUsed = 0
      let fees = 0

      if (i === 2) { // Approve step
        balanceUpdates = [mockBalanceUpdates[0]]
        fees = 0.001
      } else if (i === 3) { // Execute step
        balanceUpdates = mockBalanceUpdates
        gasUsed = 0.002
        fees = 0.005
      } else if (i === 5) { // Update step
        balanceUpdates = mockBalanceUpdates
      }

      setTransactionSteps(prev => prev.map((step, index) => {
        if (index === i) {
          return { 
            ...step, 
            status: "completed" as const,
            balanceUpdates,
            gasUsed,
            fees
          }
        }
        return step
      }))

      if (fees > 0) {
        setTotalFees(prev => prev + fees)
      }

      setCurrentStep(i + 1)
    }

    setIsProcessing(false)
  }

  const getStepIcon = (step: TransactionStep) => {
    const iconProps = { className: "h-5 w-5" }

    switch (step.status) {
      case "completed":
        return <CheckCircle {...iconProps} className="h-5 w-5 text-green-500" />
      case "processing":
        return <Calculator {...iconProps} className="h-5 w-5 animate-spin text-blue-500" />
      case "error":
        return <AlertTriangle {...iconProps} className="h-5 w-5 text-red-500" />
      default:
        return <Clock {...iconProps} className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepColor = (step: TransactionStep) => {
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
      <Card className="glass-panel border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="h-6 w-6 text-orange-400" />
            <span>Balance Reduction Process</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Transaction Steps</h3>
              <Badge variant={isProcessing ? "default" : "secondary"}>
                {isProcessing ? "Processing..." : "Ready"}
              </Badge>
            </div>

            <div className="space-y-3">
              {transactionSteps.map((step, index) => (
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
                      
                      {/* Balance Updates */}
                      {step.balanceUpdates && step.balanceUpdates.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h5 className="text-sm font-medium text-gray-300">Balance Changes:</h5>
                          <div className="space-y-2">
                            {step.balanceUpdates.map((update, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
                              >
                                <div className="flex items-center space-x-2">
                                  <Coins className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm font-medium">{update.symbol}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm">
                                    <span className="text-gray-400">{update.beforeAmount.toFixed(4)}</span>
                                    <span className="mx-2">→</span>
                                    <span className="text-white">{update.afterAmount.toFixed(4)}</span>
                                  </div>
                                  <div className={`text-xs ${update.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {update.change >= 0 ? '+' : ''}{update.change.toFixed(4)} ({update.changePercent.toFixed(1)}%)
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gas and Fees */}
                      {(step.gasUsed || step.fees) && (
                        <div className="mt-3 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Gas Used:</span>
                            <span className="text-white">{step.gasUsed?.toFixed(4) || 0} ETH</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Fees:</span>
                            <span className="text-white">${step.fees?.toFixed(3) || 0}</span>
                          </div>
                        </div>
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
                <span>{Math.round((currentStep / transactionSteps.length) * 100)}%</span>
              </div>
              <Progress value={(currentStep / transactionSteps.length) * 100} className="h-2" />
            </div>

            {/* Start Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={startTransaction}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 rounded-lg font-medium transition-all duration-200"
              >
                {isProcessing ? "Processing Transaction..." : "Start Transaction"}
              </button>
            </motion.div>
          </div>

          {/* Transaction Summary */}
          <AnimatePresence>
            {!isProcessing && currentStep === transactionSteps.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-green-300">Transaction Completed Successfully</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Fees:</span>
                      <span className="text-white font-semibold">${totalFees.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas Used:</span>
                      <span className="text-white">0.002 ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transaction Hash:</span>
                      <span className="text-white font-mono text-sm">0x742d...b6</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge className="bg-green-500/20 text-green-400">Confirmed</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Block Number:</span>
                      <span className="text-white">18,245,632</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confirmation Time:</span>
                      <span className="text-white">12 seconds</span>
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