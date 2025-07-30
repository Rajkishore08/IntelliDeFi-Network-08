"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  Star,
  Crown,
  TrendingDown,
  BarChart3,
  CheckCircle
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface TraderStats {
  rank: number
  name: string
  winRate: number
  totalPnL: number
  avgPnL: number
  sharpeRatio: number
  maxDrawdown: number
  tradeCount: number
  isCurrentUser: boolean
}

interface ComparisonMetrics {
  userRank: number
  totalTraders: number
  percentile: number
  category: "top" | "above-average" | "average" | "below-average"
}

export function TraderComparison() {
  const [topTraders, setTopTraders] = useState<TraderStats[]>([])
  const [comparisonMetrics, setComparisonMetrics] = useState<ComparisonMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading trader comparison data
    setTimeout(() => {
      setTopTraders([
        {
          rank: 1,
          name: "CryptoWhale_42",
          winRate: 78.5,
          totalPnL: 15420.50,
          avgPnL: 98.85,
          sharpeRatio: 2.45,
          maxDrawdown: -8.2,
          tradeCount: 156,
          isCurrentUser: false
        },
        {
          rank: 2,
          name: "DeFi_Master",
          winRate: 72.3,
          totalPnL: 12850.75,
          avgPnL: 89.15,
          sharpeRatio: 2.12,
          maxDrawdown: -10.5,
          tradeCount: 144,
          isCurrentUser: false
        },
        {
          rank: 3,
          name: "You",
          winRate: 57.1,
          totalPnL: 2847.50,
          avgPnL: 18.25,
          sharpeRatio: 1.85,
          maxDrawdown: -12.5,
          tradeCount: 156,
          isCurrentUser: true
        },
        {
          rank: 4,
          name: "SwingTrader_99",
          winRate: 65.8,
          totalPnL: 2150.25,
          avgPnL: 32.15,
          sharpeRatio: 1.78,
          maxDrawdown: -15.2,
          tradeCount: 67,
          isCurrentUser: false
        },
        {
          rank: 5,
          name: "ScalpKing",
          winRate: 82.1,
          totalPnL: 1850.00,
          avgPnL: 12.45,
          sharpeRatio: 1.92,
          maxDrawdown: -6.8,
          tradeCount: 148,
          isCurrentUser: false
        }
      ])

      setComparisonMetrics({
        userRank: 3,
        totalTraders: 1247,
        percentile: 85,
        category: "above-average"
      })

      setIsLoading(false)
    }, 2000)
  }, [])

  const performanceData = [
    { metric: "Win Rate", user: 57.1, top: 78.5, avg: 52.3 },
    { metric: "Sharpe Ratio", user: 1.85, top: 2.45, avg: 1.12 },
    { metric: "Avg P&L", user: 18.25, top: 98.85, avg: 15.75 },
    { metric: "Max Drawdown", user: -12.5, top: -8.2, avg: -18.5 }
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />
      case 3:
        return <Star className="h-5 w-5 text-orange-500" />
      default:
        return <span className="text-sm font-bold">{rank}</span>
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "top":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "above-average":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "average":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "below-average":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 animate-spin" />
              <span>Loading trader comparison data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Ranking Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Your Ranking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                #{comparisonMetrics?.userRank}
              </div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {comparisonMetrics?.percentile}%
              </div>
              <div className="text-sm text-muted-foreground">Percentile</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {comparisonMetrics?.totalTraders}
              </div>
              <div className="text-sm text-muted-foreground">Total Traders</div>
            </div>
            <div className="text-center">
              <Badge className={getCategoryColor(comparisonMetrics?.category || "")}>
                {comparisonMetrics?.category?.replace("-", " ").toUpperCase()}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Category</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Traders Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Top Traders Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTraders.map((trader) => (
              <div
                key={trader.rank}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  trader.isCurrentUser
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(trader.rank)}
                    <div>
                      <div className="font-semibold flex items-center space-x-2">
                        {trader.name}
                        {trader.isCurrentUser && (
                          <Badge variant="outline" className="text-xs">
                            YOU
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {trader.tradeCount} trades
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ${trader.totalPnL.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Total P&L</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {trader.winRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {trader.sharpeRatio.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Sharpe</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {trader.maxDrawdown.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Max DD</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Comparison Charts */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trend Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance vs Top Traders</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="user" fill="#3b82f6" name="You" />
                  <Bar dataKey="top" fill="#f59e0b" name="Top Trader" />
                  <Bar dataKey="avg" fill="#6b7280" name="Average" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { month: "Jan", you: 450, top: 1200, avg: 200 },
                  { month: "Feb", you: -120, top: 800, avg: -50 },
                  { month: "Mar", you: 680, top: 1500, avg: 300 },
                  { month: "Apr", you: 320, top: 1100, avg: 150 },
                  { month: "May", you: 890, top: 1800, avg: 400 },
                  { month: "Jun", you: 627.5, top: 1400, avg: 250 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="you" stroke="#3b82f6" strokeWidth={2} name="You" />
                  <Line type="monotone" dataKey="top" stroke="#f59e0b" strokeWidth={2} name="Top Trader" />
                  <Line type="monotone" dataKey="avg" stroke="#6b7280" strokeWidth={2} name="Average" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Improvement Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>How to Reach Top 10</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Your Strengths</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Good trade frequency and consistency</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Reasonable risk management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Positive Sharpe ratio</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">Areas for Improvement</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                  <span>Increase win rate from 57% to 70%+</span>
                </li>
                <li className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                  <span>Improve average P&L per trade</span>
                </li>
                <li className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span>Reduce maximum drawdown</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 