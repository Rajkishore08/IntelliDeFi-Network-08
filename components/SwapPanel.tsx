"use client"

import { useState, useCallback, useEffect } from "react"
import { useSwapQuote, useSwapSubmit } from "../hooks/useSwap1inch"
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
  const [fromAddress, setFromAddress] = useState<string>("")

  // 1inch hooks
  const { quote: oneInchQuote, loading: quoteLoading, error: quoteError, fetchQuote } = useSwapQuote();
  const { txHash, loading: swapLoading, error: swapError, submitSwap } = useSwapSubmit();

  const { addNotification } = useNotification()
  const { isConnected, connect } = useWallet()

  /**
   * Default quote fetching function
   * TODO: Replace with actual 1inch API integration
   */
  // Connect wallet and set address
  const connectWallet = async () => {
    if (window.ethereum) {
      const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setFromAddress(address);
    }
  }

  /**
   * Fetch quote with error handling
   */
  // Fetch quote using 1inch hook
  const handleGetQuote = async () => {
    if (!amount || !fromToken || !toToken) return;
    // For demo: assume 18 decimals for ETH, 6 for USDC
    const decimals = fromToken === "ETH" ? 18 : 6;
    const amountWei = (BigInt(Math.floor(Number(amount) * 10 ** decimals))).toString();
    await fetchQuote({
      chainId: 1,
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      amount: amountWei,
    });
  }

  /**
   * Handle token swap execution
   */
  // Submit swap using 1inch hook
  const handleSwap = async () => {
    if (!fromAddress || !amount || !fromToken || !toToken) return;
    const decimals = fromToken === "ETH" ? 18 : 6;
    const amountWei = (BigInt(Math.floor(Number(amount) * 10 ** decimals))).toString();
    await submitSwap({
      chainId: 1,
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      amount: amountWei,
      fromAddress,
      slippage: 1,
    });
  }

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
    // To refresh, just call handleGetQuote again
    await handleGetQuote();
    setIsRefreshing(false)
  }, [handleGetQuote])

  /**
   * Auto-fetch quote when parameters change
   */
  // Auto-fetch quote when parameters change (optional)
  // useEffect(() => {
  //   if (amount && fromToken && toToken) {
  //     handleGetQuote();
  //   }
  // }, [amount, fromToken, toToken]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] },
    },
  }

  const quoteVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] },
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
            disabled={swapLoading}
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
            value={oneInchQuote?.toTokenAmount ? (Number(oneInchQuote.toTokenAmount) / 1e6).toString() : ""}
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
          {/* Show 1inch quote info */}
          <AnimatePresence>
            {oneInchQuote && (
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
                  </div>
                </div>
                <motion.div
                  className="text-lg font-semibold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {oneInchQuote.toTokenAmount ? `${Number(oneInchQuote.toTokenAmount) / 1e6} USDC` : ''}
                </motion.div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Estimated Gas: </span>
                    <span className="text-white">{oneInchQuote.estimatedGas}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {(error || quoteError || swapError) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-red-300 text-sm">{error || quoteError || swapError}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setError(null); }}
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
              disabled={!amount || !oneInchQuote || swapLoading}
              className="w-full neon-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border border-blue-400/50 shadow-lg shadow-blue-500/20 h-12"
            >
              {swapLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Swapping...
                </>
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
