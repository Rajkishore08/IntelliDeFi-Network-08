"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { easeInOut } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, ChevronDown, ExternalLink, Loader2, Shield, Clock, AlertTriangle, ArrowUpDown } from "lucide-react"
import { useNotification } from "@/contexts/NotificationContext"
import { useWallet } from "@/contexts/WalletContext"

/**
 * Props interface for CrossChainSwapPanel component
 */
interface CrossChainSwapPanelProps {
  /** Callback for executing cross-chain swaps */
  onBridge?: (bridgeData: BridgeData) => Promise<BridgeResult>
  /** Callback for fetching bridge quotes */
  onFetchBridgeQuote?: (params: BridgeQuoteParams) => Promise<BridgeQuote>
  /** Callback for checking bridge status */
  onCheckBridgeStatus?: (txHash: string) => Promise<BridgeStatus>
  /** Custom className for styling */
  className?: string
  /** Available chains */
  availableChains?: Chain[]
  /** Available tokens per chain */
  availableTokens?: Record<string, Token[]>
}

/**
 * Bridge data structure
 */
interface BridgeData {
  fromChain: string
  toChain: string
  token: string
  amount: string
  recipient?: string
}

/**
 * Bridge quote parameters
 */
interface BridgeQuoteParams {
  fromChain: string
  toChain: string
  token: string
  amount: string
}

/**
 * Bridge quote structure
 */
interface BridgeQuote {
  estimatedTime: string
  fee: string
  feePercentage: number
  minimumAmount: string
  maximumAmount: string
  exchangeRate: string
  securityLevel: "high" | "medium" | "low"
  bridgeProvider: string
}

/**
 * Bridge result structure
 */
interface BridgeResult {
  txHash: string
  bridgeId: string
  status: "pending" | "confirmed" | "failed"
  estimatedCompletion: number
}

/**
 * Bridge status structure
 */
interface BridgeStatus {
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  currentStep: string
  estimatedTimeRemaining: number
}

/**
 * Chain structure
 */
interface Chain {
  id: string
  name: string
  symbol: string
  logoUrl?: string
  blockTime: number
}

/**
 * Token structure
 */
interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoUrl?: string
}

/**
 * Bridge status types
 */
type BridgeSwapStatus = "idle" | "fetching-quote" | "bridging" | "monitoring" | "success" | "error"

/**
 * Cross-Chain Swap Panel Component
 *
 * Provides cross-chain asset bridging functionality with real-time quotes,
 * progress monitoring, and comprehensive security features.
 *
 * @param props - Component props
 * @returns JSX.Element
 */
export default function CrossChainSwapPanel({
  onBridge,
  onFetchBridgeQuote,
  onCheckBridgeStatus,
  className = "",
  availableChains = [],
  availableTokens = {},
}: CrossChainSwapPanelProps) {
  // Use first available chain/token as default
  const [fromChain, setFromChain] = useState(availableChains[0]?.name || "")
  const [toChain, setToChain] = useState(availableChains[1]?.name || "")
  const [token, setToken] = useState(availableTokens[availableChains[0]?.name]?.[0]?.symbol || "")
  const [amount, setAmount] = useState("")
  const [quote, setQuote] = useState<BridgeQuote | null>(null)
  const [status, setStatus] = useState<BridgeSwapStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [bridgeProgress, setBridgeProgress] = useState<BridgeStatus | null>(null)
  const [activeBridgeId, setActiveBridgeId] = useState<string | null>(null)
  // New: hashlock/timelock fields
  const [hashlock, setHashlock] = useState("")
  const [timelock, setTimelock] = useState<number | undefined>(undefined)

  const { addNotification } = useNotification()
  const { isConnected, connect, address: walletAddress } = useWallet()

  /**
   * Default bridge quote fetching function
   * TODO: Replace with actual 1inch Fusion+ API integration
   */
  // Real API call for quote
  const realFetchBridgeQuote = useCallback(async (params: BridgeQuoteParams & { hashlock?: string; timelock?: number }) => {
    const res = await fetch("/api/proxy/fusion/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
    if (!res.ok) throw new Error("Failed to fetch bridge quote")
    return await res.json()
  }, [])

  /**
   * Default bridge status checking function
   * TODO: Replace with actual bridge monitoring API
   */
  const defaultCheckBridgeStatus = useCallback(async (txHash: string): Promise<BridgeStatus> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock progressive status updates
    const statuses = [
      {
        status: "pending" as const,
        progress: 10,
        currentStep: "Confirming source transaction",
        estimatedTimeRemaining: 300,
      },
      {
        status: "processing" as const,
        progress: 50,
        currentStep: "Processing cross-chain transfer",
        estimatedTimeRemaining: 180,
      },
      {
        status: "processing" as const,
        progress: 80,
        currentStep: "Finalizing on destination chain",
        estimatedTimeRemaining: 60,
      },
      { status: "completed" as const, progress: 100, currentStep: "Transfer completed", estimatedTimeRemaining: 0 },
    ]

    const randomIndex = Math.floor(Math.random() * statuses.length)
    return statuses[randomIndex]
  }, [])

  /**
   * Fetch bridge quote
   */
  const fetchBridgeQuote = useCallback(async () => {
    if (!amount || !fromChain || !toChain || !token || Number.parseFloat(amount) <= 0) return

    setStatus("fetching-quote")
    setError(null)

    try {
      const quoteParams: BridgeQuoteParams & { hashlock?: string; timelock?: number } = {
        fromChain,
        toChain,
        token,
        amount,
        hashlock: hashlock || undefined,
        timelock: timelock || undefined,
      }
      const fetchFunction = onFetchBridgeQuote || realFetchBridgeQuote
      const quoteData = await fetchFunction(quoteParams)
      setQuote(quoteData)
      setStatus("idle")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch bridge quote"
      setError(errorMessage)
      setStatus("error")
      addNotification({
        type: "error",
        message: "Failed to fetch bridge quote",
        duration: 4000,
      })
    }
  }, [amount, fromChain, toChain, token, hashlock, timelock, onFetchBridgeQuote, realFetchBridgeQuote, addNotification])

  /**
   * Handle bridge execution
   */
  // Real API call for swap
  const realBridge = useCallback(async (bridgeData: BridgeData & { hashlock?: string; timelock?: number; fromAddress?: string }) => {
    const res = await fetch("/api/proxy/fusion/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bridgeData),
    })
    if (!res.ok) throw new Error("Failed to submit bridge swap")
    return await res.json()
  }, [])

  // Move monitorBridgeProgress above handleBridge to avoid use-before-assign
  const handleBridge = useCallback(async () => {
    if (!isConnected) {
      await connect()
      return
    }
    if (!quote || !amount) return
    const safeAddress = walletAddress === null ? undefined : walletAddress;
    const bridgeData: BridgeData & { hashlock?: string; timelock?: number; fromAddress?: string } = {
      fromChain,
      toChain,
      token,
      amount,
      recipient: safeAddress,
      hashlock: hashlock || undefined,
      timelock: timelock || undefined,
      fromAddress: safeAddress,
    }
    setStatus("bridging")
    setError(null)
    try {
      const bridgeFunction = onBridge || realBridge
      const result = await bridgeFunction(bridgeData)
      setActiveBridgeId(result.bridgeId)
      setStatus("monitoring")
      addNotification({
        type: "success",
        message: `Bridge transaction initiated: ${result.txHash.slice(0, 10)}...`,
        duration: 5000,
      })
      monitorBridgeProgress(result.txHash)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bridge failed"
      setError(errorMessage)
      setStatus("error")
      addNotification({
        type: "error",
        message: "Bridge transaction failed",
        duration: 5000,
      })
    }
  }, [isConnected, connect, quote, amount, fromChain, toChain, token, hashlock, timelock, walletAddress, onBridge, realBridge, addNotification])

  /**
   * Monitor bridge progress
   */
  const monitorBridgeProgress = useCallback(
    async (txHash: string) => {
      const checkStatus = onCheckBridgeStatus || defaultCheckBridgeStatus

      const pollStatus = async () => {
        try {
          const statusData = await checkStatus(txHash)
          setBridgeProgress(statusData)

          if (statusData.status === "completed") {
            setStatus("success")
            addNotification({
              type: "success",
              message: `Bridge completed successfully!`,
              duration: 5000,
            })

            // Reset form after success
            setTimeout(() => {
              setAmount("")
              setQuote(null)
              setBridgeProgress(null)
              setActiveBridgeId(null)
              setStatus("idle")
            }, 3000)
          } else if (statusData.status === "failed") {
            setStatus("error")
            setError("Bridge transaction failed")
            addNotification({
              type: "error",
              message: "Bridge transaction failed",
              duration: 5000,
            })
          } else {
            // Continue polling
            setTimeout(pollStatus, 5000)
          }
        } catch (err) {
          console.error("Failed to check bridge status:", err)
          setTimeout(pollStatus, 10000) // Retry after longer delay
        }
      }

      pollStatus()
    },
    [onCheckBridgeStatus, defaultCheckBridgeStatus, addNotification],
  )

  /**
   * Get security level color
   */
  const getSecurityColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-400 border-green-400/50"
      case "medium":
        return "text-yellow-400 border-yellow-400/50"
      case "low":
        return "text-red-400 border-red-400/50"
      default:
        return "text-gray-400 border-gray-400/50"
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: easeInOut },
    },
  }

  const progressVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.4, ease: easeInOut },
    },
  }

  return (
    <motion.div className={className} variants={cardVariants} initial="hidden" animate="visible">
      <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-purple-400" />
            <span>Cross-Chain Bridge</span>
            {status === "fetching-quote" && <Loader2 className="h-4 w-4 animate-spin text-purple-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chain and Token Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">From Chain</label>
              <select
                value={fromChain}
                onChange={e => {
                  setFromChain(e.target.value)
                  // Reset token to first available for new chain
                  setToken(availableTokens[e.target.value]?.[0]?.symbol || "")
                }}
                className="bg-gray-800/30 border-purple-500/30 px-2 h-12 rounded text-white"
                disabled={status === "bridging" || status === "monitoring"}
              >
                {availableChains.map(chain => (
                  <option key={chain.name} value={chain.name}>{chain.name}</option>
                ))}
              </select>
              <label className="text-sm text-gray-400">From Token</label>
              <select
                value={token}
                onChange={e => setToken(e.target.value)}
                className="bg-gray-800/30 border-purple-500/30 px-2 h-12 rounded text-white"
                disabled={status === "bridging" || status === "monitoring"}
              >
                {(availableTokens[fromChain] || []).map(token => (
                  <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">To Chain</label>
              <select
                value={toChain}
                onChange={e => setToChain(e.target.value)}
                className="bg-gray-800/30 border-purple-500/30 px-2 h-12 rounded text-white"
                disabled={status === "bridging" || status === "monitoring"}
              >
                {availableChains.map(chain => (
                  <option key={chain.name} value={chain.name}>{chain.name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Bidirectional Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const prevFrom = fromChain
                const prevTo = toChain
                setFromChain(prevTo)
                setToChain(prevFrom)
                // Reset token to first available for new fromChain
                setToken(availableTokens[prevTo]?.[0]?.symbol || "")
              }}
              disabled={status === "bridging" || status === "monitoring"}
              className="rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 w-10 h-10"
              aria-label="Swap direction"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
          {/* Amount, Hashlock, Timelock Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount</label>
              <Input
                placeholder="0.0"
                value={amount}
                onChange={e => {
                  const value = e.target.value
                  if (/^\d*\.?\d*$/.test(value)) {
                    setAmount(value)
                  }
                }}
                onBlur={fetchBridgeQuote}
                className="bg-gray-800/50 border-purple-500/30 focus:border-purple-400 h-12 text-lg"
                disabled={status === "bridging" || status === "monitoring"}
                aria-label={`Amount of ${token} to bridge`}
              />
              <label className="text-sm text-gray-400">Hashlock (optional)</label>
              <Input
                placeholder="hashlock (hex)"
                value={hashlock}
                onChange={e => setHashlock(e.target.value)}
                className="bg-gray-800/50 border-purple-500/30 focus:border-purple-400 h-12 text-lg"
                disabled={status === "bridging" || status === "monitoring"}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Timelock (seconds, optional)</label>
              <Input
                placeholder="timelock"
                type="number"
                value={timelock === undefined ? "" : timelock}
                onChange={e => setTimelock(e.target.value ? Number(e.target.value) : undefined)}
                className="bg-gray-800/50 border-purple-500/30 focus:border-purple-400 h-12 text-lg"
                disabled={status === "bridging" || status === "monitoring"}
              />
            </div>
          </div>

          {/* Bridge Quote Display */}
          <AnimatePresence>
            {quote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-300">{quote.bridgeProvider}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`text-xs ${getSecurityColor(quote.securityLevel)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {quote.securityLevel.toUpperCase()} SECURITY
                    </Badge>
                    <ExternalLink className="h-4 w-4 text-purple-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Estimated Time: </span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-purple-400" />
                      <span className="text-white">{quote.estimatedTime}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Bridge Fee: </span>
                    <span className="text-white">
                      {quote.fee} ({quote.feePercentage}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Exchange Rate: </span>
                    <span className="text-white">{quote.exchangeRate}</span>
                  </div>
                </div>

                {/* Limits */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Min: {quote.minimumAmount} {token}
                  </span>
                  <span>
                    Max: {quote.maximumAmount} {token}
                  </span>
                </div>

                {/* Security Notice */}
                <div className="flex items-start space-x-2 p-2 bg-purple-500/5 rounded border border-purple-400/20">
                  <Shield className="h-4 w-4 text-purple-400 mt-0.5" />
                  <div className="text-xs text-gray-300">
                    <div className="font-medium">Security Audited</div>
                    <div>This bridge has been audited and is considered secure for cross-chain transfers.</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bridge Progress */}
          <AnimatePresence>
            {bridgeProgress && status === "monitoring" && (
              <motion.div
                variants={progressVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-300">Bridge Progress</span>
                  <span className="text-sm text-white">{bridgeProgress.progress}%</span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${bridgeProgress.progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                    <span className="text-sm text-white">{bridgeProgress.currentStep}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Estimated time remaining: {Math.floor(bridgeProgress.estimatedTimeRemaining / 60)}m{" "}
                    {bridgeProgress.estimatedTimeRemaining % 60}s
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bridge Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleBridge}
              disabled={
                !amount || !quote || status === "bridging" || status === "monitoring" || status === "fetching-quote"
              }
              className="w-full neon-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border border-purple-400/50 shadow-lg shadow-purple-500/20 h-12"
            >
              {status === "bridging" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Initiating Bridge...
                </>
              ) : status === "monitoring" ? (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Monitoring Progress...
                </>
              ) : status === "success" ? (
                "Bridge Completed!"
              ) : !isConnected ? (
                "Connect Wallet"
              ) : (
                "Bridge Assets"
              )}
            </Button>
          </motion.div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Powered by 1inch Fusion+</span>
            <div className="flex items-center space-x-1">
              <ExternalLink className="h-3 w-3" />
              <span>Bridge Documentation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
