"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  PieChart, 
  TrendingUp, 
  Coins, 
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3
} from "lucide-react"

interface Asset {
  symbol: string
  name: string
  amount: number
  price: number
  value: number
  change24h: number
  changePercent: number
  allocation: number
}

interface PortfolioUpdate {
  timestamp: string
  totalValue: number
  change24h: number
  changePercent: number
  assets: Asset[]
}

export const AssetManagementProcess = React.memo(function AssetManagementProcess() {
  const [portfolio, setPortfolio] = useState<PortfolioUpdate | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)

  const mockAssets: Asset[] = [
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: 2.54,
      price: 2500,
      value: 6350,
      change24h: 125,
      changePercent: 2.0,
      allocation: 51.0
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      amount: 900,
      price: 1.00,
      value: 900,
      change24h: 0,
      changePercent: 0,
      allocation: 7.2
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      amount: 0.15,
      price: 42000,
      value: 6300,
      change24h: 300,
      changePercent: 5.0,
      allocation: 50.6
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      amount: 150,
      price: 1.00,
      value: 150,
      change24h: 0,
      changePercent: 0,
      allocation: 1.2
    }
  ]

  const mockPortfolio: PortfolioUpdate = {
    timestamp: new Date().toISOString(),
    totalValue: 12450,
    change24h: 425,
    changePercent: 3.5,
    assets: mockAssets
  }

  const startPortfolioUpdate = useCallback(async () => {
    setIsUpdating(true)
    setUpdateProgress(0)

    // Simulate portfolio update process
    const steps = [
      { name: "Fetching prices", duration: 1000 },
      { name: "Calculating balances", duration: 800 },
      { name: "Updating allocations", duration: 600 },
      { name: "Computing P&L", duration: 700 },
      { name: "Generating report", duration: 500 }
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration))
      setUpdateProgress(((i + 1) / steps.length) * 100)
    }

    setPortfolio(mockPortfolio)
    setIsUpdating(false)
  }

  const getAssetColor = (symbol: string) => {
    const colors = {
      ETH: "text-blue-400",
      USDC: "text-green-400",
      WBTC: "text-orange-400",
      DAI: "text-yellow-400"
    }
    return colors[symbol as keyof typeof colors] || "text-gray-400"
  }

  const getAssetBgColor = (symbol: string) => {
    const colors = {
      ETH: "bg-blue-500/20",
      USDC: "bg-green-500/20",
      WBTC: "bg-orange-500/20",
      DAI: "bg-yellow-500/20"
    }
    return colors[symbol as keyof typeof colors] || "bg-gray-500/20"
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-6 w-6 text-purple-400" />
            <span>Asset Management Process</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Portfolio Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Portfolio Overview</h3>
              <Badge variant={isUpdating ? "default" : "secondary"}>
                {isUpdating ? "Updating..." : "Live"}
              </Badge>
            </div>

            {/* Update Progress */}
            {isUpdating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Updating Portfolio</span>
                  <span>{Math.round(updateProgress)}%</span>
                </div>
                <Progress value={updateProgress} className="h-2" />
              </motion.div>
            )}

            {/* Portfolio Summary */}
            <AnimatePresence>
              {portfolio && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        ${portfolio.totalValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Total Value</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${portfolio.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {portfolio.change24h >= 0 ? '+' : ''}${portfolio.change24h.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">24h Change</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${portfolio.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {portfolio.changePercent >= 0 ? '+' : ''}{portfolio.changePercent.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">24h %</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Asset List */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-300">Asset Breakdown</h4>
              <div className="space-y-2">
                {portfolio?.assets.map((asset, index) => (
                  <motion.div
                    key={asset.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${getAssetBgColor(asset.symbol)} flex items-center justify-center`}>
                        <span className={`text-sm font-bold ${getAssetColor(asset.symbol)}`}>
                          {asset.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{asset.name}</div>
                        <div className="text-sm text-gray-400">{asset.amount.toFixed(4)} {asset.symbol}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-white">${asset.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">{asset.allocation.toFixed(1)}%</div>
                      <div className={`text-xs ${asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(1)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Asset Allocation Chart */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-300">Allocation Chart</h4>
              <div className="flex items-center space-x-2 h-4 bg-gray-800 rounded-full overflow-hidden">
                {portfolio?.assets.map((asset, index) => (
                  <motion.div
                    key={asset.symbol}
                    initial={{ width: 0 }}
                    animate={{ width: `${asset.allocation}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className={`h-full ${getAssetBgColor(asset.symbol)}`}
                    title={`${asset.symbol}: ${asset.allocation.toFixed(1)}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {portfolio?.assets.map((asset) => (
                  <div key={asset.symbol} className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full ${getAssetBgColor(asset.symbol)}`} />
                    <span className="text-xs text-gray-400">{asset.symbol}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={startPortfolioUpdate}
                disabled={isUpdating}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 rounded-lg font-medium transition-all duration-200"
              >
                {isUpdating ? "Updating Portfolio..." : "Update Portfolio"}
              </button>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          <AnimatePresence>
            {portfolio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <h4 className="font-semibold text-blue-300">Performance</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Best Performer:</span>
                      <span className="text-white">WBTC (+5.0%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Worst Performer:</span>
                      <span className="text-white">USDC (0.0%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volatility:</span>
                      <span className="text-white">Medium</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-green-400" />
                    <h4 className="font-semibold text-green-300">Risk Metrics</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sharpe Ratio:</span>
                      <span className="text-white">1.85</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Drawdown:</span>
                      <span className="text-white">-8.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Beta:</span>
                      <span className="text-white">0.92</span>
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
}) 