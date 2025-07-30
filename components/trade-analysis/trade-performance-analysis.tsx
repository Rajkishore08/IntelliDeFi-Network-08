"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Brain
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface PerformanceMetrics {
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
}

interface AIInsight {
  type: "positive" | "negative" | "neutral"
  category: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
}

export function TradePerformanceAnalysis() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate AI analysis
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
        profitFactor: 1.89
      })

      setInsights([
        {
          type: "positive",
          category: "Risk Management",
          title: "Excellent Stop-Loss Discipline",
          description: "Your average loss is well-controlled at $180, showing good risk management practices.",
          impact: "high"
        },
        {
          type: "negative",
          category: "Timing",
          title: "Frequent Overtrading",
          description: "Average holding time of 2.5 days suggests potential overtrading. Consider longer-term positions.",
          impact: "medium"
        },
        {
          type: "positive",
          category: "Profitability",
          title: "Strong Profit Factor",
          description: "Profit factor of 1.89 indicates good risk-adjusted returns.",
          impact: "high"
        },
        {
          type: "neutral",
          category: "Diversification",
          title: "Limited Asset Diversity",
          description: "Consider diversifying across more trading pairs to reduce concentration risk.",
          impact: "low"
        }
      ])

      setIsLoading(false)
    }, 2000)
  }, [])

  const chartData = [
    { month: "Jan", pnl: 450, trades: 12 },
    { month: "Feb", pnl: -120, trades: 15 },
    { month: "Mar", pnl: 680, trades: 18 },
    { month: "Apr", pnl: 320, trades: 14 },
    { month: "May", pnl: 890, trades: 22 },
    { month: "Jun", pnl: 627.5, trades: 19 }
  ]

  const tradeTypeData = [
    { type: "Buy", count: 89, pnl: 2100 },
    { type: "Sell", count: 67, pnl: 747.5 }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 animate-spin" />
              <span>AI is analyzing your trading performance...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
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
            <Progress value={metrics?.winRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.winningTrades} wins / {metrics?.totalTrades} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics?.maxDrawdown.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Peak to trough decline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Trading Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === "positive"
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                    : insight.type === "negative"
                    ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                    : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {insight.type === "positive" ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : insight.type === "negative" ? (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                      <Badge
                        variant={
                          insight.impact === "high"
                            ? "default"
                            : insight.impact === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="pnl" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pnl">P&L Trend</TabsTrigger>
          <TabsTrigger value="trades">Trade Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly P&L Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trade Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tradeTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${metrics?.largestWin.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Largest Win</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                ${metrics?.largestLoss.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Largest Loss</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {metrics?.averageHoldingTime} days
              </div>
              <div className="text-sm text-muted-foreground">Avg Hold Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics?.profitFactor.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Profit Factor</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 