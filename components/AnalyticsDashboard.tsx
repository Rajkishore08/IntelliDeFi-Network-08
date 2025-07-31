"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  LineChart, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  DollarSign,
  Coins,
  Wallet,
  Globe,
  Network,
  Clock,
  Calendar,
  RefreshCw,
  Download,
  Share,
  Eye,
  EyeOff,
  Filter,
  Search,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  Star,
  Heart,
  Zap,
  Brain,
  Shield,
  Users,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"

interface AnalyticsMetric {
  name: string
  value: number
  change: number
  changeType: "increase" | "decrease" | "stable"
  icon: React.ReactNode
  color: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
  }[]
}

interface PerformanceData {
  totalPnl: number
  winRate: number
  totalTrades: number
  averageTrade: number
  bestTrade: number
  worstTrade: number
  sharpeRatio: number
  maxDrawdown: number
}

interface AssetAllocation {
  asset: string
  percentage: number
  value: number
  change24h: number
  color: string
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    totalPnl: 12500,
    winRate: 68.5,
    totalTrades: 156,
    averageTrade: 80.1,
    bestTrade: 1250,
    worstTrade: -450,
    sharpeRatio: 1.85,
    maxDrawdown: 12.5
  })
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation[]>([])
  const [timeframe, setTimeframe] = useState("30d")
  const [isLoading, setIsLoading] = useState(false)

  const { isConnected, address } = useWallet()
  const { addNotification } = useNotification()

  // Mock analytics metrics
  useEffect(() => {
    const mockMetrics: AnalyticsMetric[] = [
      {
        name: "Total P&L",
        value: 12500,
        change: 15.2,
        changeType: "increase",
        icon: <DollarSign className="h-5 w-5" />,
        color: "text-green-400"
      },
      {
        name: "Win Rate",
        value: 68.5,
        change: 2.1,
        changeType: "increase",
        icon: <Target className="h-5 w-5" />,
        color: "text-blue-400"
      },
      {
        name: "Total Volume",
        value: 45000,
        change: -5.3,
        changeType: "decrease",
        icon: <Coins className="h-5 w-5" />,
        color: "text-yellow-400"
      },
      {
        name: "Active Strategies",
        value: 8,
        change: 0,
        changeType: "stable",
        icon: <Activity className="h-5 w-5" />,
        color: "text-purple-400"
      }
    ]
    setMetrics(mockMetrics)
  }, [])

  // Mock asset allocation
  useEffect(() => {
    const mockAllocation: AssetAllocation[] = [
      {
        asset: "ETH",
        percentage: 35,
        value: 17500,
        change24h: 2.5,
        color: "#6366f1"
      },
      {
        asset: "USDC",
        percentage: 25,
        value: 12500,
        change24h: 0,
        color: "#3b82f6"
      },
      {
        asset: "MATIC",
        percentage: 20,
        value: 10000,
        change24h: 5.8,
        color: "#8b5cf6"
      },
      {
        asset: "BTC",
        percentage: 15,
        value: 7500,
        change24h: -1.2,
        color: "#f59e0b"
      },
      {
        asset: "Others",
        percentage: 5,
        value: 2500,
        change24h: 1.5,
        color: "#10b981"
      }
    ]
    setAssetAllocation(mockAllocation)
  }, [])

  const refreshAnalytics = async () => {
    setIsLoading(true)
    addNotification({
      type: "info",
      message: "Refreshing analytics data...",
      duration: 2000,
    })

    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsLoading(false)
    addNotification({
      type: "success",
      message: "Analytics data updated successfully!",
      duration: 3000,
    })
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "increase": return <ArrowUp className="h-4 w-4 text-green-400" />
      case "decrease": return <ArrowDown className="h-4 w-4 text-red-400" />
      case "stable": return <Minus className="h-4 w-4 text-gray-400" />
      default: return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "increase": return "text-green-400"
      case "decrease": return "text-red-400"
      case "stable": return "text-gray-400"
      default: return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-400" />
          Analytics Dashboard
          <TrendingUp className="h-6 w-6 text-green-400" />
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Comprehensive trading analytics, performance metrics, and portfolio insights
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(period)}
              className={timeframe === period ? "bg-blue-600" : ""}
            >
              {period}
            </Button>
          ))}
        </div>
        
        <Button
          onClick={refreshAnalytics}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.name} className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{metric.name}</span>
                <div className={metric.color}>
                  {metric.icon}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">
                {metric.name.includes("Rate") || metric.name.includes("Rate") 
                  ? `${metric.value}%`
                  : metric.name.includes("Volume") || metric.name.includes("P&L")
                  ? `$${metric.value.toLocaleString()}`
                  : metric.value.toLocaleString()
                }
              </div>
              <div className="flex items-center gap-2 text-sm">
                {getChangeIcon(metric.changeType)}
                <span className={getChangeColor(metric.changeType)}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-gray-400">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="allocation" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Allocation
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-400" />
                  P&L Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart Component</p>
                    <p className="text-sm">P&L over time visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Trading Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Trades</span>
                    <span className="text-white font-semibold">{performanceData.totalTrades}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Win Rate</span>
                    <span className="text-green-400 font-semibold">{performanceData.winRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Avg Trade</span>
                    <span className="text-white font-semibold">${performanceData.averageTrade}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Sharpe Ratio</span>
                    <span className="text-blue-400 font-semibold">{performanceData.sharpeRatio}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Total P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  ${performanceData.totalPnl.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Best Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  +${performanceData.bestTrade.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-red-500/30 shadow-xl shadow-red-500/10">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Worst Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">
                  ${performanceData.worstTrade.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-yellow-500/30 shadow-xl shadow-yellow-500/10">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Max Drawdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">
                  {performanceData.maxDrawdown}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-white">{performanceData.winRate}%</span>
                  </div>
                  <Progress value={performanceData.winRate} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sharpe Ratio</span>
                    <span className="text-white">{performanceData.sharpeRatio}</span>
                  </div>
                  <Progress value={(performanceData.sharpeRatio / 3) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Drawdown</span>
                    <span className="text-white">{performanceData.maxDrawdown}%</span>
                  </div>
                  <Progress value={performanceData.maxDrawdown} className="h-2 bg-red-500/20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-400" />
                  Asset Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assetAllocation.map((asset) => (
                    <div key={asset.asset} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <div className="font-semibold text-white">{asset.asset}</div>
                          <div className="text-sm text-gray-400">
                            ${asset.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{asset.percentage}%</div>
                        <div className={`text-sm ${
                          asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-400" />
                  Portfolio Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">$50,000</div>
                    <div className="text-sm text-gray-400">Total Portfolio Value</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">+$2,500</div>
                      <div className="text-sm text-gray-400">24h Change</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">5 Assets</div>
                      <div className="text-sm text-gray-400">Diversified</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">Strong Performance</span>
                  </div>
                  <p className="text-sm text-white">
                    Your portfolio is outperforming the market by 15.2% this month.
                  </p>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400">Diversification Alert</span>
                  </div>
                  <p className="text-sm text-white">
                    Consider adding more stablecoins to reduce volatility.
                  </p>
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-400">Risk Warning</span>
                  </div>
                  <p className="text-sm text-white">
                    High concentration in DeFi tokens detected. Consider rebalancing.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-orange-500/30 shadow-xl shadow-orange-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-400" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Increase ETH Position</span>
                    <Badge className="border-green-500/50 text-green-300">High Priority</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Add USDC Buffer</span>
                    <Badge className="border-yellow-500/50 text-yellow-300">Medium Priority</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Consider MATIC</span>
                    <Badge className="border-blue-500/50 text-blue-300">Low Priority</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Connection Alert */}
      {!isConnected && (
        <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-yellow-300">Connect your wallet to view personalized analytics</p>
        </div>
      )}
    </div>
  )
} 