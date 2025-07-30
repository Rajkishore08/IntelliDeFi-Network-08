"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  AlertCircle,
  Info
} from "lucide-react"

interface TradeFeedback {
  id: string
  timestamp: Date
  pair: string
  type: "buy" | "sell"
  amount: number
  price: number
  aiAnalysis: {
    risk: "low" | "medium" | "high"
    confidence: number
    recommendation: "proceed" | "caution" | "avoid"
    insights: string[]
    warnings: string[]
  }
}

export function RealTimeFeedback() {
  const [currentTrade, setCurrentTrade] = useState({
    pair: "",
    type: "buy" as "buy" | "sell",
    amount: "",
    price: ""
  })
  const [feedback, setFeedback] = useState<TradeFeedback | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [feedbackHistory, setFeedbackHistory] = useState<TradeFeedback[]>([])

  const analyzeTrade = async () => {
    if (!currentTrade.pair || !currentTrade.amount || !currentTrade.price) {
      return
    }

    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        risk: Math.random() > 0.6 ? "high" : Math.random() > 0.3 ? "medium" : "low" as "low" | "medium" | "high",
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
        recommendation: Math.random() > 0.7 ? "avoid" : Math.random() > 0.4 ? "caution" : "proceed" as "proceed" | "caution" | "avoid",
        insights: [
          "Market showing strong bullish momentum",
          "Volume is above average for this pair",
          "RSI indicates potential overbought conditions"
        ],
        warnings: [
          "High volatility detected - consider smaller position",
          "Recent price action shows resistance at this level"
        ]
      }

      const newFeedback: TradeFeedback = {
        id: Date.now().toString(),
        timestamp: new Date(),
        pair: currentTrade.pair,
        type: currentTrade.type,
        amount: parseFloat(currentTrade.amount),
        price: parseFloat(currentTrade.price),
        aiAnalysis: mockAnalysis
      }

      setFeedback(newFeedback)
      setFeedbackHistory(prev => [newFeedback, ...prev.slice(0, 9)]) // Keep last 10
      setIsAnalyzing(false)
    }, 2000)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "proceed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "caution":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "avoid":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "proceed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "caution":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "avoid":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Trade Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Real-Time Trade Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pair">Trading Pair</Label>
              <Input
                id="pair"
                placeholder="e.g., ETH/USDT"
                value={currentTrade.pair}
                onChange={(e) => setCurrentTrade(prev => ({ ...prev, pair: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Trade Type</Label>
              <Select
                value={currentTrade.type}
                onValueChange={(value: "buy" | "sell") => 
                  setCurrentTrade(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={currentTrade.amount}
                onChange={(e) => setCurrentTrade(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={currentTrade.price}
                onChange={(e) => setCurrentTrade(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={analyzeTrade} 
            disabled={isAnalyzing || !currentTrade.pair || !currentTrade.amount || !currentTrade.price}
            className="w-full"
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 animate-spin" />
                <span>AI Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Get AI Feedback</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current Analysis */}
      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI Analysis Results</span>
              <div className="flex items-center space-x-2">
                <Badge className={getRiskColor(feedback.aiAnalysis.risk)}>
                  {feedback.aiAnalysis.risk.toUpperCase()} RISK
                </Badge>
                <Badge className={getRecommendationColor(feedback.aiAnalysis.recommendation)}>
                  {feedback.aiAnalysis.recommendation.toUpperCase()}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {getRecommendationIcon(feedback.aiAnalysis.recommendation)}
              <div>
                <h4 className="font-semibold">
                  {feedback.pair} - {feedback.type.toUpperCase()}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feedback.amount} @ ${feedback.price} | Confidence: {feedback.aiAnalysis.confidence}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>AI Insights</span>
                </h4>
                <ul className="space-y-2">
                  {feedback.aiAnalysis.insights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>Warnings</span>
                </h4>
                <ul className="space-y-2">
                  {feedback.aiAnalysis.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Analysis Time</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {feedback.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback History */}
      {feedbackHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Analysis History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedbackHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      item.aiAnalysis.recommendation === "proceed" 
                        ? "bg-green-100 dark:bg-green-900" 
                        : item.aiAnalysis.recommendation === "caution"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-red-100 dark:bg-red-900"
                    }`}>
                      {getRecommendationIcon(item.aiAnalysis.recommendation)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {item.pair} - {item.type.toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.amount} @ ${item.price}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {item.aiAnalysis.recommendation.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Confidence Meter */}
      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle>AI Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analysis Confidence</span>
                <span className="text-sm font-bold">{feedback.aiAnalysis.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    feedback.aiAnalysis.confidence >= 80 
                      ? "bg-green-600" 
                      : feedback.aiAnalysis.confidence >= 60 
                      ? "bg-yellow-600" 
                      : "bg-red-600"
                  }`}
                  style={{ width: `${feedback.aiAnalysis.confidence}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Higher confidence indicates more reliable analysis based on current market conditions and historical patterns.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 