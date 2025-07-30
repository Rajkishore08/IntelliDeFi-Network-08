"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Brain,
  Lightbulb,
  ArrowRight,
  Shield
} from "lucide-react"

interface OptimizationTip {
  id: string
  category: "risk-management" | "timing" | "position-sizing" | "diversification" | "psychology"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  action: string
  expectedImpact: string
  difficulty: "easy" | "medium" | "hard"
  completed: boolean
}

export function OptimizationTips() {
  const [tips, setTips] = useState<OptimizationTip[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate AI-generated optimization tips
    setTimeout(() => {
      setTips([
        {
          id: "1",
          category: "risk-management",
          priority: "high",
          title: "Implement Dynamic Stop-Loss Strategy",
          description: "Your current fixed stop-loss approach could be optimized. Consider using trailing stops that adjust based on volatility and market conditions.",
          action: "Set trailing stops at 2x ATR (Average True Range) for volatile pairs, 1.5x ATR for stable pairs",
          expectedImpact: "Reduce average loss by 15-20%",
          difficulty: "medium",
          completed: false
        },
        {
          id: "2",
          category: "position-sizing",
          priority: "high",
          title: "Optimize Position Sizing Based on Volatility",
          description: "Your position sizes don't account for asset volatility. High-volatility assets should have smaller positions.",
          action: "Use Kelly Criterion: Position size = (Win rate × Avg win) / (Loss rate × Avg loss)",
          expectedImpact: "Improve risk-adjusted returns by 25%",
          difficulty: "hard",
          completed: false
        },
        {
          id: "3",
          category: "timing",
          priority: "medium",
          title: "Extend Average Holding Period",
          description: "Your 2.5-day average holding time suggests overtrading. Consider longer-term positions for better trend capture.",
          action: "Aim for minimum 5-day holds on trend-following trades, 2-3 days for scalping",
          expectedImpact: "Increase win rate by 8-12%",
          difficulty: "easy",
          completed: false
        },
        {
          id: "4",
          category: "diversification",
          priority: "medium",
          title: "Diversify Across Market Cap Segments",
          description: "Your portfolio is concentrated in large-cap assets. Consider adding mid and small-cap exposure.",
          action: "Allocate 40% large-cap, 35% mid-cap, 25% small-cap across different sectors",
          expectedImpact: "Reduce portfolio volatility by 15%",
          difficulty: "medium",
          completed: false
        },
        {
          id: "5",
          category: "psychology",
          priority: "low",
          title: "Implement Trading Journal with AI Insights",
          description: "Track emotional states and market conditions for each trade to identify psychological patterns.",
          action: "Log pre-trade emotions, market sentiment, and post-trade reflections daily",
          expectedImpact: "Improve decision-making consistency by 20%",
          difficulty: "easy",
          completed: false
        },
        {
          id: "6",
          category: "risk-management",
          priority: "high",
          title: "Set Maximum Daily Loss Limit",
          description: "Implement a daily loss limit to prevent emotional trading after consecutive losses.",
          action: "Set daily loss limit at 2% of total capital, stop trading if reached",
          expectedImpact: "Prevent catastrophic drawdowns",
          difficulty: "easy",
          completed: false
        }
      ])
      setIsLoading(false)
    }, 1500)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "hard":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "risk-management":
        return <Shield className="h-4 w-4" />
      case "timing":
        return <Clock className="h-4 w-4" />
      case "position-sizing":
        return <DollarSign className="h-4 w-4" />
      case "diversification":
        return <Target className="h-4 w-4" />
      case "psychology":
        return <Brain className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const filteredTips = filter === "all" 
    ? tips 
    : tips.filter(tip => tip.category === filter)

  const completedCount = tips.filter(tip => tip.completed).length
  const totalCount = tips.length

  const handleToggleComplete = (tipId: string) => {
    setTips(tips.map(tip => 
      tip.id === tipId ? { ...tip, completed: !tip.completed } : tip
    ))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 animate-spin" />
              <span>AI is generating optimization tips...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Optimization Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold">
              {completedCount} / {totalCount} completed
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round((completedCount / totalCount) * 100)}% complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({totalCount})
        </Button>
        <Button
          variant={filter === "risk-management" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("risk-management")}
        >
          Risk Management
        </Button>
        <Button
          variant={filter === "timing" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("timing")}
        >
          Timing
        </Button>
        <Button
          variant={filter === "position-sizing" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("position-sizing")}
        >
          Position Sizing
        </Button>
        <Button
          variant={filter === "diversification" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("diversification")}
        >
          Diversification
        </Button>
        <Button
          variant={filter === "psychology" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("psychology")}
        >
          Psychology
        </Button>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTips.map((tip) => (
          <Card key={tip.id} className={`transition-all duration-200 ${
            tip.completed ? 'opacity-75 bg-green-50 dark:bg-green-950' : ''
          }`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(tip.category)}
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(tip.priority)}>
                      {tip.priority} priority
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(tip.difficulty)}>
                      {tip.difficulty}
                    </Badge>
                  </div>
                </div>
                <Checkbox
                  checked={tip.completed}
                  onCheckedChange={() => handleToggleComplete(tip.id)}
                />
              </div>
              <CardTitle className="text-lg">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {tip.description}
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm flex items-center space-x-1">
                    <ArrowRight className="h-4 w-4" />
                    <span>Action Required:</span>
                  </h4>
                  <p className="text-sm mt-1 p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    {tip.action}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Expected Impact:</span>
                  </h4>
                  <p className="text-sm mt-1 text-green-600 dark:text-green-400">
                    {tip.expectedImpact}
                  </p>
                </div>
              </div>

              {tip.completed && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>AI Optimization Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {tips.filter(t => t.priority === "high").length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tips.filter(t => t.difficulty === "easy").length}
              </div>
              <div className="text-sm text-muted-foreground">Easy Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((completedCount / totalCount) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 