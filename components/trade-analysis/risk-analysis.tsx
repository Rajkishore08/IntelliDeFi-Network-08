"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  Clock,
  Brain,
  Activity,
  BarChart3,
  Gauge
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface RiskMetrics {
  totalRisk: number
  marketRisk: number
  volatilityRisk: number
  concentrationRisk: number
  leverageRisk: number
  maxDrawdown: number
  var95: number // Value at Risk 95%
  sharpeRatio: number
  beta: number
  correlation: number
}

interface RiskAssessment {
  overallRisk: "low" | "medium" | "high" | "extreme"
  riskFactors: string[]
  recommendations: string[]
  riskScore: number
}

export function RiskAnalysis() {
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null)
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate risk analysis
    setTimeout(() => {
      setMetrics({
        totalRisk: 65,
        marketRisk: 45,
        volatilityRisk: 70,
        concentrationRisk: 80,
        leverageRisk: 30,
        maxDrawdown: -12.5,
        var95: -8.2,
        sharpeRatio: 1.85,
        beta: 1.2,
        correlation: 0.75
      })

      setAssessment({
        overallRisk: "medium",
        riskFactors: [
          "High concentration in volatile assets",
          "Above-average correlation with market",
          "Recent drawdown approaching limits"
        ],
        recommendations: [
          "Diversify across 5+ different asset classes",
          "Reduce position sizes by 20%",
          "Implement stricter stop-loss levels",
          "Consider hedging strategies"
        ],
        riskScore: 65
      })

      setIsLoading(false)
    }, 2000)
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "extreme":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRiskLevel = (score: number) => {
    if (score <= 30) return "low"
    if (score <= 60) return "medium"
    if (score <= 80) return "high"
    return "extreme"
  }

  const drawdownData = [
    { day: 1, drawdown: 0 },
    { day: 2, drawdown: -2 },
    { day: 3, drawdown: -1 },
    { day: 4, drawdown: -5 },
    { day: 5, drawdown: -8 },
    { day: 6, drawdown: -12.5 },
    { day: 7, drawdown: -10 },
    { day: 8, drawdown: -7 },
    { day: 9, drawdown: -4 },
    { day: 10, drawdown: -2 }
  ]

  const volatilityData = [
    { month: "Jan", volatility: 15, risk: 45 },
    { month: "Feb", volatility: 18, risk: 50 },
    { month: "Mar", volatility: 22, risk: 60 },
    { month: "Apr", volatility: 20, risk: 55 },
    { month: "May", volatility: 25, risk: 70 },
    { month: "Jun", volatility: 23, risk: 65 }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 animate-spin" />
              <span>Analyzing portfolio risk...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessment?.riskScore}%
            </div>
            <Badge className={`mt-2 ${getRiskColor(assessment?.overallRisk || "")}`}>
              {assessment?.overallRisk?.toUpperCase()}
            </Badge>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value at Risk</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics?.var95.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              95% confidence level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics?.sharpeRatio.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Risk-adjusted returns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Risk Component Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Market Risk</span>
              <span className="text-sm font-bold">{metrics?.marketRisk}%</span>
            </div>
            <Progress value={metrics?.marketRisk} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Volatility Risk</span>
              <span className="text-sm font-bold">{metrics?.volatilityRisk}%</span>
            </div>
            <Progress value={metrics?.volatilityRisk} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Concentration Risk</span>
              <span className="text-sm font-bold">{metrics?.concentrationRisk}%</span>
            </div>
            <Progress value={metrics?.concentrationRisk} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Leverage Risk</span>
              <span className="text-sm font-bold">{metrics?.leverageRisk}%</span>
            </div>
            <Progress value={metrics?.leverageRisk} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* AI Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Risk Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span>Risk Factors</span>
              </h4>
              <ul className="space-y-2">
                {assessment?.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>AI Recommendations</span>
              </h4>
              <ul className="space-y-2">
                {assessment?.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Charts */}
      <Tabs defaultValue="drawdown" className="space-y-4">
        <TabsList>
          <TabsTrigger value="drawdown">Drawdown History</TabsTrigger>
          <TabsTrigger value="volatility">Volatility Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="drawdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Drawdown Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={drawdownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#ef4444"
                    fill="#fef2f2"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volatility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volatility vs Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volatilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="volatility"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Volatility %"
                  />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Risk Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics?.beta.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Beta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {metrics?.correlation.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Correlation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics?.sharpeRatio.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {metrics?.maxDrawdown.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Max DD</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 