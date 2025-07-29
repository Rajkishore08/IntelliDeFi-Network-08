"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, RefreshCw, ExternalLink, Loader2, TrendingUp } from "lucide-react"
import { useNotification } from "@/contexts/NotificationContext"
import { useWallet } from "@/contexts/WalletContext"

/**
 * Props interface for SwapPanel component
 */
interface SwapPanelProps {
  /** Callback for executing swaps */
  onSwap?: (swapData: SwapData) => Promise<SwapResult>
  /** Callback for fetching quotes */
  onFetchQuote?: (quoteParams: QuoteParams) => Promise<QuoteData>
  /** Callback for fetching token prices */
  onFetchPrices?: (tokens: string[]) => Promise<Record<string, number>>
  /** Custom className for styling */
  className?: string
  /** Default tokens to display */
  defaultTokens?: { from: string; to: string }
  /** Available tokens list */
  availableTokens?: Token[]
}

/**
 * Swap data structure
 */
interface SwapData {
  fromToken: string
  toToken: string
  amount: string
  slippage: number
  chain: string
  gasPrice?: string
}

/**
 * Quote parameters
 */
interface QuoteParams {
  fromToken: string
  toToken: string
  amount: string
  chain: string
}

/**
 * Quote data structure
 */
interface QuoteData {
  rate: string
  gasEstimate: string
  slippage: string
  route: string[]
  priceImpact: string
  estimatedOutput: string
  validUntil: number
}

/**
 * Swap result structure
 */
interface SwapResult {
  txHash: string
  status: "pending" | "confirmed" | "failed"
  gasUsed?: string
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
 * Swap status types
 */
type SwapStatus = "idle" | "fetching-quote" | "swapping" | "success" | "error"

/**
 * Swap Panel Component
 *
 * Provides classic token swapping functionality with real-time quotes,
 * animated interactions, and comprehensive error handling.
 *
 * @param props - Component props
 * @returns JSX.Element
 */
export default function SwapPanel({
  onSwap,
  onFetchQuote,
  onFetchPrices,
  className = "",
  defaultTokens = { from: "ETH", to: "USDC" },
  availableTokens = [],
}: SwapPanelProps) {
  const [fromToken, setFromToken] = useState(defaultTokens.from)
  const [toToken, setToToken] = useState(defaultTokens.to)
  const [amount, setAmount] = useState("")
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [status, setStatus] = useState<SwapStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastQuoteTime, setLastQuoteTime] = useState<number>(0)

  const { addNotification } = useNotification()
  const { isConnected, connect } = useWallet()

  /**
   * Default quote fetching function
   * TODO: Replace with actual 1inch API integration
   */
  const defaultFetchQuote = useCallback(async (params: QuoteParams): Promise<QuoteData> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock quote data
    return {
      rate: `1 ${params.fromToken} = 2,450.32 ${params.toToken}`,
      gasEstimate: "$12.50",
      slippage: "0.5%",
      route: ["1inch", "Uniswap V3", "SushiSwap"],
      priceImpact: "0.02%",
      estimatedOutput: (Number.parseFloat(params.amount) * 2450.32).toFixed(2),
      validUntil: Date.now() + 30000, // 30 seconds
    }
  }, [])

  /**
   * Fetch quote with error handling
   */
  const fetchQuote = useCallback(
    async (force = false) => {
      if (!amount || !fromToken || !toToken || Number.parseFloat(amount) <= 0) return

      // Prevent too frequent requests
      const now = Date.now()
      if (!force && now - lastQuoteTime < 2000) return

      setStatus("fetching-quote")
      setError(null)
      setLastQuoteTime(now)

      try {
        const quoteParams: QuoteParams = {
          fromToken,
          toToken,
          amount,
          chain: "ethereum",
        }

        const fetchFunction = onFetchQuote || defaultFetchQuote
        const quoteData = await fetchFunction(quoteParams)

        setQuote(quoteData)
        setStatus("idle")

        // Auto-refresh quote before expiry
        setTimeout(() => {
          if (quoteData.validUntil > Date.now()) {
            fetchQuote(true)
          }
        }, 25000)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch quote"
        setError(errorMessage)
        setStatus("error")

        addNotification({
          type: "error",
          message: "Failed to fetch swap quote",
          duration: 4000,
        })
      }
    },
    [amount, fromToken, toToken, onFetchQuote, defaultFetchQuote, lastQuoteTime, addNotification],
  )

  /**
   * Handle token swap execution
   */
  const handleSwap = useCallback(async () => {
    if (!isConnected) {
      await connect()
      return
    }

    if (!quote || !amount) return

    const swapData: SwapData = {
      fromToken,
      toToken,
      amount,
      slippage: 0.5,
      chain: "ethereum",
    }

    setStatus("swapping")
    setError(null)

    try {
      let result: SwapResult

      if (onSwap) {
        result = await onSwap(swapData)
      } else {
        // Default swap simulation
        await new Promise((resolve) => setTimeout(resolve, 3000))
        result = {
          txHash: "0x" + Math.random().toString(16).substr(2, 64),
          status: "confirmed",
          gasUsed: "21000",
        }
      }

      setStatus("success")

      addNotification({
        type: "success",
        message: `Successfully swapped ${amount} ${fromToken} for ${toToken}`,
        duration: 5000,
      })

      // Reset form after success
      setTimeout(() => {
        setAmount("")
        setQuote(null)
        setStatus("idle")
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Swap failed"
      setError(errorMessage)
      setStatus("error")

      addNotification({
        type: "error",
        message: "Swap transaction failed",
        duration: 5000,
      })
    }
  }, [isConnected, connect, quote, amount, fromToken, toToken, onSwap, addNotification])

  /**
   * Handle token swap (reverse order)
   */
  const handleTokenSwap = useCallback(() => {
    setFromToken(toToken)
    setToToken(fromToken)
    setQuote(null)
    setError(null)
  }, [fromToken, toToken])

  /**
   * Handle refresh quote
   */
  const handleRefreshQuote = useCallback(async () => {
    setIsRefreshing(true)
    await fetchQuote(true)
    setIsRefreshing(false)
  }, [fetchQuote])

  /**
   * Auto-fetch quote when parameters change
   */
  useEffect(() => {
    if (amount && fromToken && toToken) {
      const timer = setTimeout(() => fetchQuote(), 500)
      return () => clearTimeout(timer)
    }
  }, [amount, fromToken, toToken, fetchQuote])

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const quoteVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <motion.div className={className} variants={cardVariants} initial="hidden" animate="visible">
      <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowUpDown className="h-5 w-5 text-blue-400" />
            <span>1inch Aggregation Swap</span>
            {status === "fetching-quote" && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Token Input */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-sm text-gray-400">From</label>
            <div className="flex space-x-2">
              <Input
                placeholder="0.0"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^\d*\.?\d*$/.test(value)) {
                    setAmount(value)
                  }
                }}
                className="flex-1 bg-gray-800/50 border-blue-500/30 focus:border-blue-400 h-12 text-lg"
                disabled={status === "swapping"}
                aria-label={`Amount of ${fromToken} to swap`}
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="border-blue-500/30 hover:bg-blue-500/20 bg-gray-800/30 px-6 h-12"
                  disabled={status === "swapping"}
                >
                  {fromToken}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTokenSwap}
                disabled={status === "swapping"}
                className="rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 w-10 h-10"
                aria-label="Swap token order"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* To Token Input */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-sm text-gray-400">To</label>
            <div className="flex space-x-2">
              <Input
                placeholder="0.0"
                value={quote?.estimatedOutput || ""}
                readOnly
                className="flex-1 bg-gray-800/30 border-blue-500/20 h-12 text-lg"
                aria-label={`Estimated ${toToken} output`}
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="border-blue-500/30 hover:bg-blue-500/20 bg-gray-800/30 px-6 h-12"
                  disabled={status === "swapping"}
                >
                  {toToken}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Quote Display */}
          <AnimatePresence>
            {quote && (
              <motion.div
                variants={quoteVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Best Route</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-300">1inch Aggregation</span>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRefreshQuote}
                        disabled={status === "fetching-quote" || isRefreshing}
                        className="w-6 h-6"
                        aria-label="Refresh quote"
                      >
                        <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="text-lg font-semibold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {quote.rate}
                </motion.div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Gas: </span>
                    <span className="text-white">{quote.gasEstimate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Slippage: </span>
                    <span className="text-white">{quote.slippage}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Price Impact: </span>
                    <span className="text-white">{quote.priceImpact}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Route: </span>
                    <span className="text-blue-300">{quote.route.join(" → ")}</span>
                  </div>
                </div>

                {/* Quote Expiry Timer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Quote expires in: {Math.max(0, Math.floor((quote.validUntil - Date.now()) / 1000))}s</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Live pricing</span>
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
                <div className="flex items-center justify-between">
                  <span className="text-red-300 text-sm">{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-300 h-6 px-2"
                  >
                    Dismiss
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swap Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSwap}
              disabled={!amount || !quote || status === "swapping" || status === "fetching-quote"}
              className="w-full neon-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border border-blue-400/50 shadow-lg shadow-blue-500/20 h-12"
            >
              {status === "swapping" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Swapping...
                </>
              ) : status === "success" ? (
                "Swap Successful!"
              ) : !isConnected ? (
                "Connect Wallet"
              ) : (
                "Swap Tokens"
              )}
            </Button>
          </motion.div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Powered by 1inch Protocol</span>
            <div className="flex items-center space-x-1">
              <ExternalLink className="h-3 w-3" />
              <span>View on Explorer</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
