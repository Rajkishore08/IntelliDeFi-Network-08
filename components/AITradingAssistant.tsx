"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Eye,
  EyeOff,
  MessageSquare,
  Send,
  Bot,
  Cpu,
  Database,
  Network,
  Globe,
  Coins,
  Wallet,
  Key,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Share,
  Copy,
  Download,
  Upload,
  Filter,
  Search,
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"

interface MarketAnalysis {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  sentiment: "bullish" | "bearish" | "neutral"
  confidence: number
  recommendation: string
  riskLevel: "low" | "medium" | "high"
}

interface TradingStrategy {
  id: string
  name: string
  description: string
  type: "scalping" | "swing" | "position" | "arbitrage" | "dca"
  riskLevel: "low" | "medium" | "high"
  expectedReturn: number
  timeHorizon: string
  confidence: number
  status: "active" | "paused" | "completed" | "failed"
  pnl: number
  trades: number
}

interface AIInsight {
  id: string
  type: "market" | "technical" | "fundamental" | "sentiment"
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  confidence: number
  timestamp: string
  actionable: boolean
  action?: string
}

interface AutomatedTrade {
  id: string
  symbol: string
  type: "buy" | "sell"
  amount: number
  price: number
  status: "pending" | "executed" | "failed" | "cancelled"
  timestamp: string
  aiConfidence: number
  reason: string
}

export default function AITradingAssistant() {
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis[]>([])
  const [strategies, setStrategies] = useState<TradingStrategy[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [automatedTrades, setAutomatedTrades] = useState<AutomatedTrade[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAutoTrading, setIsAutoTrading] = useState(false)
  const [userQuery, setUserQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [activeTab, setActiveTab] = useState("analysis")

  const { isConnected, address } = useWallet()
  const { addNotification } = useNotification()

  // Mock market analysis data
  useEffect(() => {
    const mockAnalysis: MarketAnalysis[] = [
      {
        symbol: "ETH/USDC",
        price: 3200.50,
        change24h: 2.5,
        volume24h: 1500000000,
        marketCap: 385000000000,
        sentiment: "bullish",
        confidence: 85,
        recommendation: "Strong buy signal detected. Support at $3150, resistance at $3300.",
        riskLevel: "medium"
      },
      {
        symbol: "BTC/USDC",
        price: 65000.00,
        change24h: -1.2,
        volume24h: 2500000000,
        marketCap: 1250000000000,
        sentiment: "neutral",
        confidence: 65,
        recommendation: "Sideways movement expected. Key levels: $64000 support, $66000 resistance.",
        riskLevel: "low"
      },
      {
        symbol: "MATIC/USDC",
        price: 0.85,
        change24h: 5.8,
        volume24h: 500000000,
        marketCap: 85000000000,
        sentiment: "bullish",
        confidence: 92,
        recommendation: "Breakout confirmed. Target: $0.95, stop loss: $0.80.",
        riskLevel: "high"
      }
    ]
    setMarketAnalysis(mockAnalysis)
  }, [])

  // Mock trading strategies
  useEffect(() => {
    const mockStrategies: TradingStrategy[] = [
      {
        id: "1",
        name: "ETH Momentum Scalping",
        description: "Scalp ETH on momentum signals with tight stops",
        type: "scalping",
        riskLevel: "high",
        expectedReturn: 15,
        timeHorizon: "1-4 hours",
        confidence: 78,
        status: "active",
        pnl: 1250,
        trades: 45
      },
      {
        id: "2",
        name: "BTC DCA Strategy",
        description: "Dollar-cost average into BTC on dips",
        type: "dca",
        riskLevel: "low",
        expectedReturn: 8,
        timeHorizon: "3-6 months",
        confidence: 85,
        status: "active",
        pnl: 3200,
        trades: 12
      },
      {
        id: "3",
        name: "Cross-Chain Arbitrage",
        description: "Exploit price differences across chains",
        type: "arbitrage",
        riskLevel: "medium",
        expectedReturn: 12,
        timeHorizon: "5-15 minutes",
        confidence: 72,
        status: "paused",
        pnl: 850,
        trades: 28
      }
    ]
    setStrategies(mockStrategies)
  }, [])

  // Mock AI insights
  useEffect(() => {
    const mockInsights: AIInsight[] = [
      {
        id: "1",
        type: "technical",
        title: "ETH Breakout Imminent",
        description: "ETH showing strong accumulation pattern with RSI divergence",
        impact: "positive",
        confidence: 88,
        timestamp: "2 hours ago",
        actionable: true,
        action: "Consider long position with stop loss at $3150"
      },
      {
        id: "2",
        type: "sentiment",
        title: "Market Sentiment Shift",
        description: "Social media sentiment turning bullish for DeFi tokens",
        impact: "positive",
        confidence: 75,
        timestamp: "4 hours ago",
        actionable: true,
        action: "Monitor MATIC, UNI, and AAVE for entry opportunities"
      },
      {
        id: "3",
        type: "fundamental",
        title: "Institutional Flow Increase",
        description: "Large wallet movements indicate institutional accumulation",
        impact: "positive",
        confidence: 82,
        timestamp: "6 hours ago",
        actionable: false
      }
    ]
    setInsights(mockInsights)
  }, [])

  const runMarketAnalysis = async () => {
    if (!isConnected) {
      addNotification({
        type: "error",
        message: "Please connect your wallet to run market analysis",
        duration: 3000,
      })
      return
    }

    setIsAnalyzing(true)
    addNotification({
      type: "info",
      message: "AI is analyzing market conditions...",
      duration: 2000,
    })

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000))

    setIsAnalyzing(false)
    addNotification({
      type: "success",
      message: "Market analysis completed! New insights available.",
      duration: 5000,
    })
  }

  const toggleAutoTrading = () => {
    setIsAutoTrading(!isAutoTrading)
    addNotification({
      type: isAutoTrading ? "warning" : "success",
      message: isAutoTrading ? "Auto-trading disabled" : "Auto-trading enabled",
      duration: 3000,
    })
  }

  const askAI = async () => {
    if (!userQuery.trim()) return

    setAiResponse("AI is thinking...")
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setAiResponse(`Based on your query "${userQuery}", here's my analysis:

1. Market Context: Current market conditions show mixed signals
2. Technical Analysis: Key support/resistance levels identified
3. Risk Assessment: Medium risk environment with volatility expected
4. Recommendation: Consider position sizing and stop losses

Would you like me to execute any trades based on this analysis?`)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "text-green-400"
      case "bearish": return "text-red-400"
      case "neutral": return "text-yellow-400"
      default: return "text-gray-400"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "text-green-400"
      case "negative": return "text-red-400"
      case "neutral": return "text-yellow-400"
      default: return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-purple-400" />
          AI Trading Assistant
          <Bot className="h-6 w-6 text-blue-400" />
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Advanced AI-powered market analysis, strategy recommendations, and automated trading
        </p>
      </div>

      {/* AI Chat Interface */}
      <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            Ask AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask about market conditions, trading strategies, or specific tokens..."
              className="flex-1"
            />
            <Button onClick={askAI} disabled={!userQuery.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {aiResponse && (
            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">AI Assistant</span>
              </div>
              <p className="text-gray-300 whitespace-pre-line">{aiResponse}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Market Analysis
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        {/* Market Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Real-Time Market Analysis</h2>
            <Button
              onClick={runMarketAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isAnalyzing ? "Analyzing..." : "Refresh Analysis"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketAnalysis.map((analysis) => (
              <motion.div
                key={analysis.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/30 rounded-lg border border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-white">{analysis.symbol}</div>
                    <div className="text-2xl font-bold text-white">${analysis.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${analysis.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {analysis.change24h >= 0 ? '+' : ''}{analysis.change24h}%
                    </div>
                    <Badge className={getSentimentColor(analysis.sentiment)}>
                      {analysis.sentiment.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume 24h:</span>
                    <span className="text-white">${(analysis.volume24h / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap:</span>
                    <span className="text-white">${(analysis.marketCap / 1000000000).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AI Confidence:</span>
                    <span className="text-white">{analysis.confidence}%</span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-gray-700/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">AI Recommendation:</div>
                  <div className="text-sm text-white">{analysis.recommendation}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Active Strategies</h3>
              <div className="space-y-4">
                {strategies.map((strategy) => (
                  <motion.div
                    key={strategy.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-gray-800/30 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-white">{strategy.name}</div>
                        <div className="text-sm text-gray-400">{strategy.description}</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          strategy.riskLevel === 'low' ? 'border-green-400 text-green-300' :
                          strategy.riskLevel === 'medium' ? 'border-yellow-400 text-yellow-300' :
                          'border-red-400 text-red-300'
                        }`}
                      >
                        {strategy.riskLevel.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-400">Expected Return:</span>
                        <div className="text-white">{strategy.expectedReturn}%</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Confidence:</span>
                        <div className="text-white">{strategy.confidence}%</div>
                      </div>
                      <div>
                        <span className="text-gray-400">P&L:</span>
                        <div className={`${strategy.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${strategy.pnl.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Trades:</span>
                        <div className="text-white">{strategy.trades}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-300">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-300">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Strategy Performance</h3>
              <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">$5,300</div>
                      <div className="text-sm text-gray-400">Total P&L</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">+15.2%</div>
                        <div className="text-sm text-gray-400">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">85</div>
                        <div className="text-sm text-gray-400">Total Trades</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {insights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/30 rounded-lg border border-gray-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.impact === 'positive' ? 'bg-green-500/20' :
                      insight.impact === 'negative' ? 'bg-red-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{insight.title}</div>
                      <div className="text-sm text-gray-400">{insight.type.toUpperCase()} • {insight.timestamp}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${getImpactColor(insight.impact)}`}>
                      {insight.impact.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-400">{insight.confidence}% confidence</div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-3">{insight.description}</p>

                {insight.actionable && insight.action && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="text-sm text-blue-300 font-semibold mb-1">Recommended Action:</div>
                    <div className="text-sm text-white">{insight.action}</div>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="border-green-500/50 text-green-300">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Useful
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-300">
                    <Share className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Automated Trading</h2>
            <Button
              onClick={toggleAutoTrading}
              className={`${
                isAutoTrading 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isAutoTrading ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Disable Auto-Trading
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Enable Auto-Trading
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-400" />
                  Auto-Trading Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isAutoTrading ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-white">
                    {isAutoTrading ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Trades:</span>
                    <span className="text-white">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Success Rate:</span>
                    <span className="text-green-400">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily P&L:</span>
                    <span className="text-green-400">+$450</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Position Size:</span>
                    <span className="text-white">5% of portfolio</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Daily Loss Limit:</span>
                    <span className="text-white">2% of portfolio</span>
                  </div>
                  <Progress value={35} className="h-2 bg-red-500/20" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Stop Loss:</span>
                    <span className="text-white">3% per trade</span>
                  </div>
                  <Progress value={15} className="h-2 bg-yellow-500/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Connection Alert */}
      {!isConnected && (
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect your wallet to access AI trading features and automated trading
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 