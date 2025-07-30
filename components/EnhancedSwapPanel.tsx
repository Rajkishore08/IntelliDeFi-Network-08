"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowUpDown, 
  ChevronDown, 
  RefreshCw, 
  ExternalLink, 
  Loader2, 
  TrendingUp,
  Wallet,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  Clock,
  Coins
} from "lucide-react"
import { useNotification } from "@/contexts/NotificationContext"

interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoUrl?: string
  price?: number
  balance?: string
}

interface Chain {
  id: number
  name: string
  symbol: string
  logoUrl?: string
  rpcUrl: string
  explorerUrl: string
}

interface SwapQuote {
  rate: string
  gasEstimate: string
  slippage: string
  route: string[]
  priceImpact: string
  estimatedOutput: string
  validUntil: number
  provider: string
}

interface SwapStatus {
  type: "idle" | "fetching-quote" | "approving" | "swapping" | "success" | "error"
  message: string
  progress?: number
}

const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    logoUrl: "/ethereum-logo.png",
    rpcUrl: "https://mainnet.infura.io/v3/your-project-id",
    explorerUrl: "https://etherscan.io"
  },
  {
    id: 137,
    name: "Polygon",
    symbol: "MATIC",
    logoUrl: "/polygon-logo.png",
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com"
  },
  {
    id: 56,
    name: "BSC",
    symbol: "BNB",
    logoUrl: "/bsc-logo.png",
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com"
  },
  {
    id: 42161,
    name: "Arbitrum",
    symbol: "ARB",
    logoUrl: "/arbitrum-logo.png",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io"
  }
]

const POPULAR_TOKENS: Token[] = [
  { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000", decimals: 18, price: 2500 },
  { symbol: "USDC", name: "USD Coin", address: "0xA0b86a33E6441b8C4C8C0C8C0C8C0C8C0C8C0C8", decimals: 6, price: 1 },
  { symbol: "USDT", name: "Tether", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6, price: 1 },
  { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8, price: 42000 },
  { symbol: "DAI", name: "Dai", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18, price: 1 },
  { symbol: "MATIC", name: "Polygon", address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608aCfeBB0", decimals: 18, price: 0.8 }
]

export default function EnhancedSwapPanel() {
  const [fromChain, setFromChain] = useState<Chain>(SUPPORTED_CHAINS[0])
  const [toChain, setToChain] = useState<Chain>(SUPPORTED_CHAINS[1])
  const [fromToken, setFromToken] = useState<Token>(POPULAR_TOKENS[0])
  const [toToken, setToToken] = useState<Token>(POPULAR_TOKENS[1])
  const [amount, setAmount] = useState("")
  const [estimatedOutput, setEstimatedOutput] = useState("")
  const [slippage, setSlippage] = useState(0.5)
  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null)
  const [swapStatus, setSwapStatus] = useState<SwapStatus>({ type: "idle", message: "Ready to swap" })
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [walletBalance, setWalletBalance] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { addNotification } = useNotification()

  // Check wallet connection on mount
  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = useCallback(async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setIsWalletConnected(true)
          setWalletAddress(accounts[0])
          await updateWalletBalance(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }, [])

  const updateWalletBalance = useCallback(async (address: string) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        })
        const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4)
        setWalletBalance(balanceInEth)
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        if (accounts.length > 0) {
          setIsWalletConnected(true)
          setWalletAddress(accounts[0])
          await updateWalletBalance(accounts[0])
          addNotification({
            type: "success",
            message: "Wallet connected successfully",
            duration: 3000,
          })
        }
      } catch (error: any) {
        if (error.code === 4001) {
          addNotification({
            type: "error",
            message: "Connection rejected by user",
            duration: 3000,
          })
        } else {
          addNotification({
            type: "error",
            message: "Failed to connect wallet",
            duration: 5000,
          })
        }
      }
    } else {
      addNotification({
        type: "error",
        message: "MetaMask is not installed",
        duration: 5000,
      })
    }
  }, [addNotification, updateWalletBalance])

  const handleGetQuote = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      addNotification({
        type: "error",
        message: "Please enter a valid amount",
        duration: 3000,
      })
      return
    }

    setSwapStatus({ type: "fetching-quote", message: "Fetching best quote..." })

    try {
      // Simulate API call to get quote
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockQuote: SwapQuote = {
        rate: (parseFloat(amount) * (fromToken.price || 1) / (toToken.price || 1)).toFixed(6),
        gasEstimate: "0.002",
        slippage: slippage.toString(),
        route: [fromToken.symbol, "USDC", toToken.symbol],
        priceImpact: "0.12",
        estimatedOutput: (parseFloat(amount) * (fromToken.price || 1) / (toToken.price || 1) * (1 - slippage / 100)).toFixed(6),
        validUntil: Date.now() + 30000, // 30 seconds
        provider: "1inch"
      }

      setSwapQuote(mockQuote)
      setEstimatedOutput(mockQuote.estimatedOutput)
      setSwapStatus({ type: "idle", message: "Quote received" })

      addNotification({
        type: "success",
        message: `Best quote found: ${mockQuote.estimatedOutput} ${toToken.symbol}`,
        duration: 3000,
      })
    } catch (error) {
      setSwapStatus({ type: "error", message: "Failed to fetch quote" })
      addNotification({
        type: "error",
        message: "Failed to fetch quote. Please try again.",
        duration: 5000,
      })
    }
  }, [amount, fromToken, toToken, slippage, addNotification])

  const handleSwap = useCallback(async () => {
    if (!isWalletConnected) {
      addNotification({
        type: "error",
        message: "Please connect your wallet first",
        duration: 3000,
      })
      return
    }

    if (!swapQuote) {
      addNotification({
        type: "error",
        message: "Please get a quote first",
        duration: 3000,
      })
      return
    }

    setSwapStatus({ type: "swapping", message: "Executing swap...", progress: 0 })

    try {
      // Simulate swap process
      for (let i = 0; i <= 100; i += 20) {
        setSwapStatus({ type: "swapping", message: "Executing swap...", progress: i })
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setSwapStatus({ type: "success", message: "Swap completed successfully!" })
      
      addNotification({
        type: "success",
        message: `Successfully swapped ${amount} ${fromToken.symbol} for ${estimatedOutput} ${toToken.symbol}`,
        duration: 5000,
      })

      // Reset form
      setAmount("")
      setEstimatedOutput("")
      setSwapQuote(null)
      
      // Update wallet balance
      await updateWalletBalance(walletAddress)

    } catch (error) {
      setSwapStatus({ type: "error", message: "Swap failed" })
      addNotification({
        type: "error",
        message: "Swap failed. Please try again.",
        duration: 5000,
      })
    }
  }, [isWalletConnected, swapQuote, amount, fromToken, toToken, estimatedOutput, walletAddress, updateWalletBalance, addNotification])

  const handleSwapDirection = useCallback(() => {
    setFromChain(toChain)
    setToChain(fromChain)
    setFromToken(toToken)
    setToToken(fromToken)
    setAmount("")
    setEstimatedOutput("")
    setSwapQuote(null)
  }, [fromChain, toChain, fromToken, toToken])

  const getStatusIcon = () => {
    switch (swapStatus.type) {
      case "fetching-quote":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
      case "swapping":
        return <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      default:
        return <Zap className="h-5 w-5 text-blue-400" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowUpDown className="h-6 w-6 text-blue-400" />
            <span>Enhanced Swap Panel</span>
            <Badge variant="secondary" className="ml-auto">
              Powered by 1inch
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Connection */}
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-400">Wallet Status</div>
                <div className="text-white font-medium">
                  {isWalletConnected ? "Connected" : "Not Connected"}
                </div>
              </div>
            </div>
            {isWalletConnected ? (
              <div className="text-right">
                <div className="text-sm text-gray-400">Balance</div>
                <div className="text-white font-medium">{walletBalance} ETH</div>
              </div>
            ) : (
              <Button onClick={connectWallet} size="sm" className="bg-blue-600 hover:bg-blue-700">
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Chain Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">From Chain</label>
              <Select value={fromChain.id.toString()} onValueChange={(value) => {
                const chain = SUPPORTED_CHAINS.find(c => c.id.toString() === value)
                if (chain) setFromChain(chain)
              }}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <span>{chain.name}</span>
                        <Badge variant="outline" className="text-xs">{chain.symbol}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">To Chain</label>
              <Select value={toChain.id.toString()} onValueChange={(value) => {
                const chain = SUPPORTED_CHAINS.find(c => c.id.toString() === value)
                if (chain) setToChain(chain)
              }}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <span>{chain.name}</span>
                        <Badge variant="outline" className="text-xs">{chain.symbol}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Token Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">From Token</label>
              <Select value={fromToken.symbol} onValueChange={(value) => {
                const token = POPULAR_TOKENS.find(t => t.symbol === value)
                if (token) setFromToken(token)
              }}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {POPULAR_TOKENS.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center space-x-2">
                        <span>{token.symbol}</span>
                        <span className="text-gray-400">{token.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">To Token</label>
              <Select value={toToken.symbol} onValueChange={(value) => {
                const token = POPULAR_TOKENS.find(t => t.symbol === value)
                if (token) setToToken(token)
              }}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {POPULAR_TOKENS.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center space-x-2">
                        <span>{token.symbol}</span>
                        <span className="text-gray-400">{token.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSwapDirection}
              variant="ghost"
              size="sm"
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Amount</label>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800/50 border-gray-700/50 text-white"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Balance: {walletBalance} {fromToken.symbol}</span>
              <span>Price: ${fromToken.price}</span>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-gray-400 hover:text-white"
            >
              {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Advanced Settings
            </Button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Slippage Tolerance (%)</label>
                    <Input
                      type="number"
                      placeholder="0.5"
                      value={slippage}
                      onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                      className="bg-gray-800/50 border-gray-700/50 text-white"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quote Display */}
          {swapQuote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-blue-300">Quote Details</h4>
                <Badge variant="outline" className="text-blue-400">{swapQuote.provider}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Rate:</span>
                  <div className="text-white font-medium">1 {fromToken.symbol} = {swapQuote.rate} {toToken.symbol}</div>
                </div>
                <div>
                  <span className="text-gray-400">Estimated Output:</span>
                  <div className="text-white font-medium">{swapQuote.estimatedOutput} {toToken.symbol}</div>
                </div>
                <div>
                  <span className="text-gray-400">Gas Estimate:</span>
                  <div className="text-white font-medium">{swapQuote.gasEstimate} ETH</div>
                </div>
                <div>
                  <span className="text-gray-400">Price Impact:</span>
                  <div className="text-white font-medium">{swapQuote.priceImpact}%</div>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-500/20">
                <div className="text-xs text-gray-400">Route: {swapQuote.route.join(" → ")}</div>
              </div>
            </motion.div>
          )}

          {/* Status Display */}
          <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            {getStatusIcon()}
            <span className="font-medium text-gray-300">{swapStatus.message}</span>
            {swapStatus.progress !== undefined && (
              <Progress value={swapStatus.progress} className="flex-1" />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleGetQuote}
              disabled={!amount || parseFloat(amount) <= 0 || swapStatus.type === "fetching-quote"}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {swapStatus.type === "fetching-quote" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting Quote...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Get Quote
                </>
              )}
            </Button>

            <Button
              onClick={handleSwap}
              disabled={!swapQuote || !isWalletConnected || swapStatus.type === "swapping"}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {swapStatus.type === "swapping" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Swapping...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Swap
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 