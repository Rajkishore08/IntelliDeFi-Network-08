"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target,
  Brain,
  Activity,
  Calendar,
  PieChart
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts"

interface DashboardMetrics {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnL: number
  averagePnL: number
  largestWin: number
  largestLoss: number
  averageHoldingTime: number
  sharpeRatio: number
  maxDrawdown: number
  profitFactor: number
  totalVolume: number
  averageVolume: number
}

interface TimeframeData {
  daily: any[]
  weekly: any[]
  monthly: any[]
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [timeframeData, setTimeframeData] = useState<TimeframeData | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setMetrics({
        totalTrades: 156,
        winningTrades: 89,
        losingTrades: 67,
        winRate: 57.1,
        totalPnL: 2847.50,
        averagePnL: 18.25,
        largestWin: 450.00,
        largestLoss: -180.00,
        averageHoldingTime: 2.5,
        sharpeRatio: 1.85,
        maxDrawdown: -12.5,
        profitFactor: 1.89,
        totalVolume: 125000,
        averageVolume: 801.28
      })

      setTimeframeData({
        daily: [
          { date: "Mon", pnl: 45, trades: 3 },
          { date: "Tue", pnl: -12, trades: 2 },
          { date: "Wed", pnl: 78, trades: 4 },
          { date: "Thu", pnl: 32, trades: 3 },
          { date: "Fri", pnl: 89, trades: 5 },
          { date: "Sat", pnl: 15, trades: 1 },
          { date: "Sun", pnl: 67, trades: 3 }
        ],
        weekly: [
          { week: "W1", pnl: 234, trades: 12 },
          { week: "W2", pnl: -45, trades: 8 },
          { week: "W3", pnl: 456, trades: 15 },
          { week: "W4", pnl: 123, trades: 10 },
          { week: "W5", pnl: 678, trades: 18 },
          { week: "W6", pnl: 234, trades: 12 }
        ],
        monthly: [
          { month: "Jan", pnl: 450, trades: 12 },
          { month: "Feb", pnl: -120, trades: 15 },
          { month: "Mar", pnl: 680, trades: 18 },
          { month: "Apr", pnl: 320, trades: 14 },
          { month: "May", pnl: 890, trades: 22 },
          { month: "Jun", pnl: 627.5, trades: 19 }
        ]
      })

      setIsLoading(false)
    }, 2000)
  }, [])

  const pieData = [
    { name: "Winning Trades", value: metrics?.winningTrades || 0, color: "#10b981" },
    { name: "Losing Trades", value: metrics?.losingTrades || 0, color: "#ef4444" }
  ]

  const assetData = [
    { asset: "ETH", pnl: 1200, trades: 45 },
    { asset: "BTC", pnl: 850, trades: 32 },
    { asset: "SOL", pnl: 450, trades: 28 },
    { asset: "ADA", pnl: -120, trades: 15 },
    { asset: "DOT", pnl: 367.5, trades: 36 }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 animate-spin" />
              <span>Loading performance dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${metrics?.totalPnL.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.averagePnL.toFixed(2)} avg per trade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.winRate}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.winningTrades} wins / {metrics?.totalTrades} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics?.sharpeRatio.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Risk-adjusted returns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.totalVolume.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ${metrics?.averageVolume.toFixed(2)} avg per trade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <Tabs defaultValue="pnl" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pnl">P&L Trend</TabsTrigger>
          <TabsTrigger value="distribution">Trade Distribution</TabsTrigger>
          <TabsTrigger value="assets">Asset Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>P&L Performance</span>
                <div className="flex space-x-2">
                  <Badge 
                    variant={selectedTimeframe === "daily" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTimeframe("daily")}
                  >
                    Daily
                  </Badge>
                  <Badge 
                    variant={selectedTimeframe === "weekly" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTimeframe("weekly")}
                  >
                    Weekly
                  </Badge>
                  <Badge 
                    variant={selectedTimeframe === "monthly" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTimeframe("monthly")}
                  >
                    Monthly
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeframeData?.[selectedTimeframe as keyof TimeframeData] || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={selectedTimeframe === "daily" ? "date" : selectedTimeframe === "weekly" ? "week" : "month"} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="pnl"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Win/Loss Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trade Volume by Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="asset" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pnl" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetData.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div>
                        <div className="font-medium">{asset.asset}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.trades} trades
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        asset.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${asset.pnl.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((asset.pnl / (metrics?.totalPnL || 1)) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Largest Win</span>
                <span className="font-bold text-green-600">${metrics?.largestWin.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Largest Loss</span>
                <span className="font-bold text-red-600">${metrics?.largestLoss.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Hold Time</span>
                <span className="font-bold">{metrics?.averageHoldingTime} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Profit Factor</span>
                <span className="font-bold text-blue-600">{metrics?.profitFactor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Max Drawdown</span>
                <span className="font-bold text-red-600">{metrics?.maxDrawdown.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="font-semibold text-green-800 dark:text-green-200">
                  Strong Performance
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Your Sharpe ratio of {metrics?.sharpeRatio.toFixed(2)} indicates excellent risk-adjusted returns.
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Improvement Opportunity
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  Consider extending holding periods to improve win rate above 60%.
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="font-semibold text-blue-800 dark:text-blue-200">
                  Volume Analysis
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Average trade volume of ${metrics?.averageVolume.toFixed(2)} shows consistent position sizing.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 