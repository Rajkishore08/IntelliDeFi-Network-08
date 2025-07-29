import React, { useState } from "react"
import { useFusionSwap, FusionSwapParams, FusionSwapQuote, FusionSwapResult } from "../hooks/useFusionSwap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowUpDown, AlertTriangle } from "lucide-react"

interface ChainOption {
  id: number
  name: string
  symbol: string
  logoUrl?: string
}

interface TokenOption {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

interface FusionSwapPanelProps {
  chains: ChainOption[]
  tokensByChain: Record<number, TokenOption[]>
  defaultFromChainId?: number
  defaultToChainId?: number
  defaultFromToken?: string
  defaultToToken?: string
  defaultToAddress?: string
}

export const FusionSwapPanel: React.FC<FusionSwapPanelProps> = ({
  chains,
  tokensByChain,
  defaultFromChainId = 1,
  defaultToChainId = 137,
  defaultFromToken = "",
  defaultToToken = "",
  defaultToAddress = "",
}) => {
  const [fromChainId, setFromChainId] = useState(defaultFromChainId)
  const [toChainId, setToChainId] = useState(defaultToChainId)
  const [fromToken, setFromToken] = useState(defaultFromToken)
  const [toToken, setToToken] = useState(defaultToToken)
  const [amount, setAmount] = useState("")
  const [fromAddress, setFromAddress] = useState("")
  const [toAddress, setToAddress] = useState(defaultToAddress)
  const [hashlock, setHashlock] = useState("")
  const [timelock, setTimelock] = useState<number | undefined>(undefined)

  const { loading, error, quote, result, fetchQuote, submitSwap } = useFusionSwap()

  // Bidirectional swap logic
  const handleSwapDirection = () => {
    setFromChainId(toChainId)
    setToChainId(fromChainId)
    setFromToken(toToken)
    setToToken(fromToken)
  }

  const handleGetQuote = async () => {
    if (!fromChainId || !toChainId || !fromToken || !toToken || !amount || !fromAddress || !toAddress) return
    const params: FusionSwapParams = {
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      fromAddress,
      toAddress,
      hashlock: hashlock || undefined,
      timelock: timelock || undefined,
    }
    await fetchQuote(params)
  }

  const handleSwap = async () => {
    if (!fromChainId || !toChainId || !fromToken || !toToken || !amount || !fromAddress || !toAddress) return
    const params: FusionSwapParams = {
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      fromAddress,
      toAddress,
      hashlock: hashlock || undefined,
      timelock: timelock || undefined,
    }
    await submitSwap(params)
  }

  return (
    <Card className="glass-panel border-pink-500/30 shadow-xl shadow-pink-500/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowUpDown className="h-5 w-5 text-pink-400" />
          <span>1inch Fusion+ Cross-Chain Swap</span>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-pink-400" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chain and Token Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">From Chain</label>
            <select
              value={fromChainId}
              onChange={e => setFromChainId(Number(e.target.value))}
              className="bg-gray-800/30 border-pink-500/30 px-2 h-12 rounded text-white"
              disabled={loading}
            >
              {chains.map(chain => (
                <option key={chain.id} value={chain.id}>{chain.name}</option>
              ))}
            </select>
            <label className="text-sm text-gray-400">From Token</label>
            <select
              value={fromToken}
              onChange={e => setFromToken(e.target.value)}
              className="bg-gray-800/30 border-pink-500/30 px-2 h-12 rounded text-white"
              disabled={loading}
            >
              {(tokensByChain[fromChainId] || []).map(token => (
                <option key={token.address} value={token.address}>{token.symbol}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">To Chain</label>
            <select
              value={toChainId}
              onChange={e => setToChainId(Number(e.target.value))}
              className="bg-gray-800/30 border-pink-500/30 px-2 h-12 rounded text-white"
              disabled={loading}
            >
              {chains.map(chain => (
                <option key={chain.id} value={chain.id}>{chain.name}</option>
              ))}
            </select>
            <label className="text-sm text-gray-400">To Token</label>
            <select
              value={toToken}
              onChange={e => setToToken(e.target.value)}
              className="bg-gray-800/30 border-pink-500/30 px-2 h-12 rounded text-white"
              disabled={loading}
            >
              {(tokensByChain[toChainId] || []).map(token => (
                <option key={token.address} value={token.address}>{token.symbol}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Amount and Address Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Amount</label>
            <Input
              placeholder="0.0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="bg-gray-800/50 border-pink-500/30 focus:border-pink-400 h-12 text-lg"
              disabled={loading}
            />
            <label className="text-sm text-gray-400">From Address</label>
            <Input
              placeholder="0x..."
              value={fromAddress}
              onChange={e => setFromAddress(e.target.value)}
              className="bg-gray-800/50 border-pink-500/30 focus:border-pink-400 h-12 text-lg"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">To Address</label>
            <Input
              placeholder="0x..."
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
              className="bg-gray-800/50 border-pink-500/30 focus:border-pink-400 h-12 text-lg"
              disabled={loading}
            />
            <label className="text-sm text-gray-400">Hashlock (optional)</label>
            <Input
              placeholder="hashlock (hex)"
              value={hashlock}
              onChange={e => setHashlock(e.target.value)}
              className="bg-gray-800/50 border-pink-500/30 focus:border-pink-400 h-12 text-lg"
              disabled={loading}
            />
            <label className="text-sm text-gray-400">Timelock (seconds, optional)</label>
            <Input
              placeholder="timelock"
              type="number"
              value={timelock === undefined ? "" : timelock}
              onChange={e => setTimelock(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-gray-800/50 border-pink-500/30 focus:border-pink-400 h-12 text-lg"
              disabled={loading}
            />
          </div>
        </div>
        {/* Bidirectional Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapDirection}
            disabled={loading}
            className="rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/50 w-10 h-10"
            aria-label="Swap direction"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        {/* Loader and Error */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}
        {/* Quote Display */}
        {quote && (
          <div className="bg-pink-500/10 border border-pink-400/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-pink-300">{quote.provider}</span>
              <span className="text-xs text-gray-400">Estimated: {quote.estimatedTime}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Fee: </span>
                <span className="text-white">{quote.fee}</span>
              </div>
              <div>
                <span className="text-gray-400">Exchange Rate: </span>
                <span className="text-white">{quote.exchangeRate}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Min: {quote.minimumAmount}</span>
              <span>Max: {quote.maximumAmount}</span>
            </div>
            {quote.hashlock && (
              <div className="text-xs text-gray-400">Hashlock: {quote.hashlock}</div>
            )}
            {quote.timelock && (
              <div className="text-xs text-gray-400">Timelock: {quote.timelock} sec</div>
            )}
          </div>
        )}
        {/* Result Display */}
        {result && (
          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 space-y-2">
            <div className="text-green-300 text-sm">Swap submitted!</div>
            <div className="text-xs text-white">Tx Hash: {result.txHash}</div>
            <div className="text-xs text-white">Status: {result.status}</div>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleGetQuote}
            disabled={loading}
            className="w-1/2 neon-button bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 border border-pink-400/50 shadow-lg shadow-pink-500/20 h-12"
          >
            Get Quote
          </Button>
          <Button
            onClick={handleSwap}
            disabled={loading || !quote}
            className="w-1/2 neon-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border border-pink-400/50 shadow-lg shadow-pink-500/20 h-12"
          >
            Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Example usage:
// <FusionSwapPanel
//   chains={[
//     { id: 1, name: "Ethereum", symbol: "ETH" },
//     { id: 137, name: "Polygon", symbol: "MATIC" },
//     { id: 56, name: "Binance Smart Chain", symbol: "BNB" },
//   ]}
//   tokensByChain={{
//     1: [ { address: "0x...", symbol: "USDC", name: "USD Coin", decimals: 6 } ],
//     137: [ { address: "0x...", symbol: "USDC", name: "USD Coin", decimals: 6 } ],
//     56: [ { address: "0x...", symbol: "USDT", name: "Tether", decimals: 6 } ],
//   }}
//   defaultFromChainId={1}
//   defaultToChainId={137}
//   defaultFromToken={"0x..."}
//   defaultToToken={"0x..."}
//   defaultToAddress={"0x..."}
// />
