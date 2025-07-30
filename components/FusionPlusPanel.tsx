"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowRight, 
  ArrowUpDown, 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Wallet,
  Network,
  Coins
} from "lucide-react"
import { oneInchAPI, type FusionQuoteRequest, type FusionQuoteResponse } from "@/lib/1inch-api"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"

interface ChainInfo {
  id: number
  name: string
  symbol: string
  icon: string
  rpcUrl: string
  explorerUrl: string
}

const SUPPORTED_CHAINS: ChainInfo[] = [
  { id: 1, name: "Ethereum", symbol: "ETH", icon: "🔷", rpcUrl: "https://eth.llamarpc.com", explorerUrl: "https://etherscan.io" },
  { id: 137, name: "Polygon", symbol: "MATIC", icon: "🟣", rpcUrl: "https://polygon.llamarpc.com", explorerUrl: "https://polygonscan.com" },
  { id: 56, name: "BSC", symbol: "BNB", icon: "🟡", rpcUrl: "https://bsc.llamarpc.com", explorerUrl: "https://bscscan.com" },
  { id: 42161, name: "Arbitrum", symbol: "ARB", icon: "🔵", rpcUrl: "https://arbitrum.llamarpc.com", explorerUrl: "https://arbiscan.io" },
  { id: 10, name: "Optimism", symbol: "OP", icon: "🔴", rpcUrl: "https://optimism.llamarpc.com", explorerUrl: "https://optimistic.etherscan.io" },
  { id: 43114, name: "Avalanche", symbol: "AVAX", icon: "🔺", rpcUrl: "https://avalanche.llamarpc.com", explorerUrl: "https://snowtrace.io" },
]

const POPULAR_TOKENS = {
  1: [
    { symbol: "USDC", address: "0xA0b86a33E6441b8C4C8B0C4C8B0C4C8B0C4C8B0C", decimals: 6 },
    { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
    { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
    { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
  ],
  137: [
    { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6 },
    { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
    { symbol: "WMATIC", address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", decimals: 18 },
    { symbol: "DAI", address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", decimals: 18 },
  ],
}

interface SwapState {
  fromChain: number
  toChain: number
  fromToken: string
  toToken: string
  amount: string
  quote?: FusionQuoteResponse
  isGettingQuote: boolean
  isExecuting: boolean
  executionStep: number
  executionSteps: string[]
}

export default function FusionPlusPanel() {
  const [swapState, setSwapState] = useState<SwapState>({
    fromChain: 1,
    toChain: 137,
    fromToken: "",
    toToken: "",
    amount: "",
    isGettingQuote: false,
    isExecuting: false,
    executionStep: 0,
    executionSteps: [
      "Initializing Fusion+ quote",
      "Validating cross-chain parameters",
      "Creating hashlock commitment",
      "Setting up timelock contracts",
      "Executing source chain transaction",
      "Waiting for cross-chain confirmation",
      "Executing destination chain transaction",
      "Completing swap and releasing funds"
    ]
  })

  const { isConnected, address } = useWallet()
  const { addNotification } = useNotification()

  const getQuote = useCallback(async () => {
    if (!isConnected || !address || !swapState.fromToken || !swapState.toToken || !swapState.amount) {
      addNotification({
        type: "error",
        message: "Please connect wallet and fill all fields",
        duration: 3000,
      })
      return
    }

    setSwapState(prev => ({ ...prev, isGettingQuote: true }))

    try {
      const quoteRequest: FusionQuoteRequest = {
        fromTokenAddress: swapState.fromToken,
        toTokenAddress: swapState.toToken,
        amount: swapState.amount,
        fromAddress: address,
        chainId: swapState.fromChain,
        allowPartialFill: true,
        enableEstimate: true,
      }

      // Use mock data for development
      const quote = process.env.NEXT_PUBLIC_MOCK_DATA === 'true' 
        ? oneInchAPI.getMockQuote(quoteRequest) as FusionQuoteResponse
        : await oneInchAPI.getFusionQuote(quoteRequest)

      setSwapState(prev => ({ 
        ...prev, 
        quote, 
        isGettingQuote: false 
      }))

      addNotification({
        type: "success",
        message: "Fusion+ quote received successfully",
        duration: 3000,
      })
    } catch (error) {
      console.error('Error getting Fusion+ quote:', error)
      setSwapState(prev => ({ ...prev, isGettingQuote: false }))
      addNotification({
        type: "error",
        message: "Failed to get Fusion+ quote",
        duration: 5000,
      })
    }
  }, [swapState, isConnected, address, addNotification])

  const executeSwap = useCallback(async () => {
    if (!swapState.quote) return

    setSwapState(prev => ({ 
      ...prev, 
      isExecuting: true, 
      executionStep: 0 
    }))

    try {
      // Simulate cross-chain execution steps
      for (let i = 0; i < swapState.executionSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSwapState(prev => ({ 
          ...prev, 
          executionStep: i + 1 
        }))
      }

      addNotification({
        type: "success",
        message: "Fusion+ cross-chain swap completed successfully!",
        duration: 5000,
      })

      // Reset state
      setSwapState(prev => ({
        ...prev,
        isExecuting: false,
        executionStep: 0,
        quote: undefined,
        amount: ""
      }))
    } catch (error) {
      console.error('Error executing Fusion+ swap:', error)
      setSwapState(prev => ({ 
        ...prev, 
        isExecuting: false 
      }))
      addNotification({
        type: "error",
        message: "Failed to execute Fusion+ swap",
        duration: 5000,
      })
    }
  }, [swapState.quote, swapState.executionSteps, addNotification])

  const swapChains = useCallback(() => {
    setSwapState(prev => ({
      ...prev,
      fromChain: prev.toChain,
      toChain: prev.fromChain,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      quote: undefined
    }))
  }, [])

  const getChainInfo = (chainId: number) => {
    return SUPPORTED_CHAINS.find(chain => chain.id === chainId)
  }

  const getPopularTokens = (chainId: number) => {
    return POPULAR_TOKENS[chainId as keyof typeof POPULAR_TOKENS] || []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-yellow-400" />
          Fusion+ Cross-Chain Swap
          <Shield className="h-6 w-6 text-green-400" />
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience the future of cross-chain DeFi with 1inch Fusion+ protocol. 
          Swap tokens across different blockchains with enhanced security and efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Swap Configuration */}
        <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-400" />
                Cross-Chain Configuration
              </span>
              <Badge variant="outline" className="border-green-400/50 text-green-300">
                Fusion+ Enabled
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From Chain */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">From Chain</label>
              <Select
                value={swapState.fromChain.toString()}
                onValueChange={(value) => setSwapState(prev => ({ 
                  ...prev, 
                  fromChain: parseInt(value),
                  fromToken: "",
                  quote: undefined
                }))}
              >
                <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{chain.icon}</span>
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Chain */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">To Chain</label>
              <Select
                value={swapState.toChain.toString()}
                onValueChange={(value) => setSwapState(prev => ({ 
                  ...prev, 
                  toChain: parseInt(value),
                  toToken: "",
                  quote: undefined
                }))}
              >
                <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{chain.icon}</span>
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Chains Button */}
            <Button
              onClick={swapChains}
              variant="outline"
              className="w-full border-blue-400/30 hover:border-blue-400"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Swap Chains
            </Button>

            {/* From Token */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">From Token</label>
              <Input
                value={swapState.fromToken}
                onChange={(e) => setSwapState(prev => ({ 
                  ...prev, 
                  fromToken: e.target.value,
                  quote: undefined
                }))}
                placeholder="Token address or select popular token"
                className="bg-gray-800/50 border-blue-500/30"
              />
              <div className="flex flex-wrap gap-2">
                {getPopularTokens(swapState.fromChain).map((token) => (
                  <Button
                    key={token.address}
                    size="sm"
                    variant="outline"
                    onClick={() => setSwapState(prev => ({ 
                      ...prev, 
                      fromToken: token.address,
                      quote: undefined
                    }))}
                    className="text-xs border-blue-400/30"
                  >
                    {token.symbol}
                  </Button>
                ))}
              </div>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">To Token</label>
              <Input
                value={swapState.toToken}
                onChange={(e) => setSwapState(prev => ({ 
                  ...prev, 
                  toToken: e.target.value,
                  quote: undefined
                }))}
                placeholder="Token address or select popular token"
                className="bg-gray-800/50 border-blue-500/30"
              />
              <div className="flex flex-wrap gap-2">
                {getPopularTokens(swapState.toChain).map((token) => (
                  <Button
                    key={token.address}
                    size="sm"
                    variant="outline"
                    onClick={() => setSwapState(prev => ({ 
                      ...prev, 
                      toToken: token.address,
                      quote: undefined
                    }))}
                    className="text-xs border-blue-400/30"
                  >
                    {token.symbol}
                  </Button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount</label>
              <Input
                value={swapState.amount}
                onChange={(e) => setSwapState(prev => ({ 
                  ...prev, 
                  amount: e.target.value,
                  quote: undefined
                }))}
                placeholder="0.0"
                className="bg-gray-800/50 border-blue-500/30"
              />
            </div>

            {/* Get Quote Button */}
            <Button
              onClick={getQuote}
              disabled={!isConnected || swapState.isGettingQuote}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {swapState.isGettingQuote ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Get Fusion+ Quote
            </Button>
          </CardContent>
        </Card>

        {/* Quote and Execution */}
        <div className="space-y-6">
          {/* Quote Display */}
          {swapState.quote && (
            <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Fusion+ Quote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">You Pay</div>
                    <div className="text-lg font-semibold text-white">
                      {swapState.quote.fromTokenAmount} {swapState.quote.fromToken.symbol}
                    </div>
                    <div className="text-sm text-gray-400">
                      {getChainInfo(swapState.fromChain)?.name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">You Receive</div>
                    <div className="text-lg font-semibold text-green-400">
                      {swapState.quote.toTokenAmount} {swapState.quote.toToken.symbol}
                    </div>
                    <div className="text-sm text-gray-400">
                      {getChainInfo(swapState.toChain)?.name}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Gas</span>
                    <span className="text-white">{swapState.quote.estimatedGas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gas Cost</span>
                    <span className="text-white">${swapState.quote.estimatedGasCost}</span>
                  </div>
                </div>

                <Button
                  onClick={executeSwap}
                  disabled={swapState.isExecuting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {swapState.isExecuting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Execute Fusion+ Swap
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Execution Progress */}
          {swapState.isExecuting && (
            <Card className="glass-panel border-yellow-500/30 shadow-xl shadow-yellow-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  Cross-Chain Execution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress 
                  value={(swapState.executionStep / swapState.executionSteps.length) * 100} 
                  className="h-2"
                />
                <div className="space-y-2">
                  {swapState.executionSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        index < swapState.executionStep 
                          ? 'text-green-400' 
                          : index === swapState.executionStep 
                          ? 'text-yellow-400' 
                          : 'text-gray-400'
                      }`}
                    >
                      {index < swapState.executionStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : index === swapState.executionStep ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-gray-400" />
                      )}
                      {step}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features Info */}
          <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Fusion+ Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Hashlock & Timelock Security</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Bidirectional Cross-Chain Swaps</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Partial Fill Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>MEV Protection</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connection Alert */}
      {!isConnected && (
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to use Fusion+ cross-chain swaps
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 