"use client"

import { useState, useCallback, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, TrendingDown, AlertTriangle, Coins, ExternalLink, RefreshCw } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"

interface PortfolioDashboardProps {
  onRefresh?: () => Promise<any>
  className?: string
}

interface TokenHolding {
  symbol: string
  name: string
  amount: string
  value: string
  change24h: string
  changePercent: number
  price: string
}

interface Transaction {
  id: string
  type: "swap" | "bridge" | "limit"
  fromToken: string
  toToken: string
  amount: string
  status: "completed" | "pending" | "failed"
  timestamp: string
  txHash?: string
}

interface RiskAlert {
  id: string
  type: "liquidation" | "depeg" | "arbitrage"
  severity: "low" | "medium" | "high"
  message: string
  action?: string
}

export default function PortfolioDashboard({ onRefresh, className = "" }: PortfolioDashboardProps) {
  const [holdings, setHoldings] = useState<TokenHolding[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([])
  const [totalValue, setTotalValue] = useState("0")
  const [dailyChange, setDailyChange] = useState("0")
  const [dailyChangePercent, setDailyChangePercent] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { isConnected, address, connect } = useWallet()
  const { addNotification } = useNotification()

  // Fetch real ETH and ERC-20 balances for the connected wallet
  const fetchPortfolioData = useCallback(async () => {
    if (!isConnected || !address) return
    setIsLoading(true)
    try {
      // Use MetaMask provider injected in window
      const provider = new ethers.BrowserProvider(window.ethereum)
      // ETH balance
      const ethBalance = await provider.getBalance(address)
      const ethPrice = 2000 // TODO: fetch real price from API
      const ethAmount = ethers.formatEther(ethBalance)
      const ethValue = `$${(parseFloat(ethAmount) * ethPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      // Example: ERC-20 tokens (USDC, WBTC)
      const tokens = [
        {
          symbol: "USDC",
          name: "USD Coin",
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          decimals: 6,
          price: 1,
        },
        {
          symbol: "WBTC",
          name: "Wrapped Bitcoin",
          address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          decimals: 8,
          price: 45000,
        },
      ]
      const erc20Abi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"]
      const holdings: TokenHolding[] = [
        {
          symbol: "ETH",
          name: "Ethereum",
          amount: ethAmount,
          value: ethValue,
          change24h: "$0.00", // TODO: fetch real change
          changePercent: 0,
          price: `$${ethPrice}`,
        },
      ]
      for (const token of tokens) {
        const contract = new ethers.Contract(token.address, erc20Abi, provider)
        const bal = await contract.balanceOf(address)
        const amount = ethers.formatUnits(bal, token.decimals)
        holdings.push({
          symbol: token.symbol,
          name: token.name,
          amount,
          value: `$${(parseFloat(amount) * token.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          change24h: "$0.00", // TODO: fetch real change
          changePercent: 0,
          price: `$${token.price}`,
        })
      }
      setHoldings(holdings)
      setTotalValue(`$${holdings.reduce((sum, h) => sum + parseFloat(h.value.replace(/[$,]/g, "")), 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`)
      setDailyChange("$0.00")
      setDailyChangePercent(0)
      setTransactions([])
      setRiskAlerts([])
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to fetch portfolio data",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, address, addNotification])

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      await onRefresh()
    } else {
      await fetchPortfolioData()
    }
  }, [onRefresh, fetchPortfolioData])

  useEffect(() => {
    if (isConnected) {
      fetchPortfolioData()
    }
  }, [isConnected, fetchPortfolioData])

  if (!isConnected) {
    return (
      <Card className={`glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10 animate-slide-up ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Wallet className="h-12 w-12 text-blue-400" />
          <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
          <p className="text-gray-400 text-center">Connect your wallet to view your portfolio and trading history</p>
          <Button
            onClick={connect}
            className="neon-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border border-blue-400/50 shadow-lg shadow-blue-500/20"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  // --- AI Insights logic ---
  const aiInsights = [] as string[];
  if (holdings.length > 0) {
    const eth = holdings.find(h => h.symbol === "ETH")
    const usdc = holdings.find(h => h.symbol === "USDC")
    const wbtc = holdings.find(h => h.symbol === "WBTC")
    if (eth && parseFloat(eth.amount) > 1) {
      aiInsights.push("You have a strong ETH position. Consider staking for yield.")
    }
    if (usdc && parseFloat(usdc.amount) > 1000) {
      aiInsights.push("Large USDC balance detected. Consider deploying stablecoins to earn yield.")
    }
    if (wbtc && parseFloat(wbtc.amount) > 0.1) {
      aiInsights.push("WBTC holding detected. Explore BTC-ETH arbitrage or lending opportunities.")
    }
    if (holdings.length > 2) {
      aiInsights.push("Good diversification across assets. Keep monitoring market trends.")
    }
    if (holdings.every(h => parseFloat(h.amount) < 0.01)) {
      aiInsights.push("Portfolio is very small. Consider increasing your DeFi exposure for higher returns.")
    }
    if (aiInsights.length === 0) {
      aiInsights.push("No major risks or opportunities detected. Portfolio is balanced.")
    }
  }

  return (
    <div className={`space-y-6 animate-slide-up ${className}`}>
      {/* AI Insights Panel */}
      <Card className="glass-panel border-cyan-500/30 shadow-xl shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span role="img" aria-label="AI">🤖</span>
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-cyan-200">
            {aiInsights.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* Portfolio Overview */}
      <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-blue-400" />
              <span>Portfolio Overview</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="hover:bg-blue-500/20"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">{totalValue}</div>
            <div
              className={`flex items-center space-x-2 ${dailyChangePercent >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {dailyChangePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>
                {dailyChange} ({dailyChangePercent > 0 ? "+" : ""}
                {dailyChangePercent.toFixed(2)}%) today
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {holdings.map((holding, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Coins className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{holding.symbol}</div>
                    <div className="text-sm text-gray-400">{holding.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">{holding.value}</div>
                  <div className="text-sm text-gray-400">
                    {holding.amount} {holding.symbol}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{holding.price}</div>
                  <div
                    className={`text-sm font-medium ${holding.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {holding.change24h} ({holding.changePercent > 0 ? "+" : ""}
                    {holding.changePercent}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      {riskAlerts.length > 0 && (
        <Card className="glass-panel border-yellow-500/30 shadow-xl shadow-yellow-500/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span>Risk Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border animate-pulse-glow ${
                  alert.severity === "high"
                    ? "bg-red-500/10 border-red-400/30"
                    : alert.severity === "medium"
                      ? "bg-yellow-500/10 border-yellow-400/30"
                      : "bg-blue-500/10 border-blue-400/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          alert.severity === "high"
                            ? "border-red-400/50 text-red-400"
                            : alert.severity === "medium"
                              ? "border-yellow-400/50 text-yellow-400"
                              : "border-blue-400/50 text-blue-400"
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium capitalize">{alert.type}</span>
                    </div>
                    <p className="text-sm text-gray-300">{alert.message}</p>
                  </div>
                  {alert.action && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                      {alert.action}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span>Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-blue-500/20"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      tx.status === "completed"
                        ? "bg-green-400"
                        : tx.status === "pending"
                          ? "bg-yellow-400 animate-pulse"
                          : "bg-red-400"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-white capitalize">
                      {tx.type}: {tx.amount} {tx.fromToken} → {tx.toToken}
                    </div>
                    <div className="text-sm text-gray-400">{tx.timestamp}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      tx.status === "completed"
                        ? "border-green-400/50 text-green-400"
                        : tx.status === "pending"
                          ? "border-yellow-400/50 text-yellow-400"
                          : "border-red-400/50 text-red-400"
                    }`}
                  >
                    {tx.status}
                  </Badge>
                  {tx.txHash && (
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
