"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Copy, Star, Eye } from "lucide-react"
import { useNotification } from "@/contexts/NotificationContext"

interface CopyTradeGalleryProps {
  onCopyStrategy?: (strategyId: string) => Promise<any>
  className?: string
}

interface Strategy {
  id: string
  name: string
  creator: string
  creatorAddress: string
  performance: string
  performancePercent: number
  followers: number
  winRate: string
  totalTrades: number
  description: string
  tags: string[]
  isFollowing: boolean
  riskLevel: "low" | "medium" | "high"
}

export default function CopyTradeGallery({ onCopyStrategy, className = "" }: CopyTradeGalleryProps) {
  const [strategies] = useState<Strategy[]>([
    {
      id: "1",
      name: "DCA ETH Strategy",
      creator: "CryptoMaster",
      creatorAddress: "0x1234...5678",
      performance: "+24.5%",
      performancePercent: 24.5,
      followers: 156,
      winRate: "78%",
      totalTrades: 45,
      description: "Dollar-cost averaging into ETH with smart timing based on RSI indicators",
      tags: ["DCA", "ETH", "Long-term"],
      isFollowing: false,
      riskLevel: "low",
    },
    {
      id: "2",
      name: "Yield Farming USDC",
      creator: "DeFiWhale",
      creatorAddress: "0x8765...4321",
      performance: "+18.2%",
      performancePercent: 18.2,
      followers: 89,
      winRate: "65%",
      totalTrades: 23,
      description: "Automated yield farming across multiple protocols with risk management",
      tags: ["Yield", "USDC", "Farming"],
      isFollowing: true,
      riskLevel: "medium",
    },
    {
      id: "3",
      name: "Cross-Chain Arbitrage",
      creator: "ArbitrageBot",
      creatorAddress: "0xabcd...efgh",
      performance: "+31.7%",
      performancePercent: 31.7,
      followers: 203,
      winRate: "82%",
      totalTrades: 67,
      description: "Automated arbitrage opportunities across Ethereum, Aptos, and Sui networks",
      tags: ["Arbitrage", "Cross-chain", "Automated"],
      isFollowing: false,
      riskLevel: "high",
    },
    {
      id: "4",
      name: "Momentum Trading",
      creator: "TrendFollower",
      creatorAddress: "0x9876...1234",
      performance: "+12.8%",
      performancePercent: 12.8,
      followers: 134,
      winRate: "71%",
      totalTrades: 89,
      description: "Momentum-based trading strategy using technical indicators and volume analysis",
      tags: ["Momentum", "Technical", "Short-term"],
      isFollowing: false,
      riskLevel: "medium",
    },
  ])

  const [filter, setFilter] = useState<"all" | "following">("all")
  const { addNotification } = useNotification()

  const handleCopyStrategy = useCallback(
    async (strategyId: string) => {
      try {
        if (onCopyStrategy) {
          await onCopyStrategy(strategyId)
        } else {
          // TODO: Default copy strategy logic
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }

        const strategy = strategies.find((s) => s.id === strategyId)
        addNotification({
          type: "success",
          message: `Successfully copied "${strategy?.name}" strategy`,
          duration: 4000,
        })
      } catch (error) {
        addNotification({
          type: "error",
          message: "Failed to copy strategy",
          duration: 4000,
        })
      }
    },
    [onCopyStrategy, strategies, addNotification],
  )

  const filteredStrategies = strategies.filter(
    (strategy) => filter === "all" || (filter === "following" && strategy.isFollowing),
  )

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "border-green-400/50 text-green-400"
      case "medium":
        return "border-yellow-400/50 text-yellow-400"
      case "high":
        return "border-red-400/50 text-red-400"
      default:
        return "border-gray-400/50 text-gray-400"
    }
  }

  return (
    <Card className={`glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10 animate-slide-up ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span>Strategy Marketplace</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500/30 bg-transparent"}
            >
              All
            </Button>
            <Button
              variant={filter === "following" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("following")}
              className={filter === "following" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500/30 bg-transparent"}
            >
              Following
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className="p-6 bg-gray-800/30 rounded-lg border border-blue-500/20 hover:border-blue-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 animate-fade-in"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-500 text-white text-sm">
                      {strategy.creator.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white">{strategy.name}</h3>
                    <p className="text-sm text-gray-400">by {strategy.creator}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 ${strategy.isFollowing ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"}`}
                >
                  <Star className={`h-4 w-4 ${strategy.isFollowing ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div
                    className={`text-lg font-bold ${strategy.performancePercent >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {strategy.performance}
                  </div>
                  <div className="text-xs text-gray-400">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{strategy.winRate}</div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{strategy.followers}</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{strategy.description}</p>

              {/* Tags and Risk */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-wrap gap-1">
                  {strategy.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-400/30 text-blue-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Badge variant="outline" className={`text-xs ${getRiskColor(strategy.riskLevel)}`}>
                  {strategy.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleCopyStrategy(strategy.id)}
                  className="flex-1 neon-button bg-blue-600 hover:bg-blue-700 border border-blue-400/50"
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-blue-500/30 bg-transparent hover:bg-blue-500/20"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
                <span className="text-xs text-gray-400">{strategy.totalTrades} trades</span>
                <span className="text-xs text-gray-400">{strategy.creatorAddress}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredStrategies.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {filter === "following" ? "No Followed Strategies" : "No Strategies Found"}
            </h3>
            <p className="text-gray-400">
              {filter === "following"
                ? "Start following strategies to see them here"
                : "Check back later for new trading strategies"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
