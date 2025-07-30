"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Target, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Shield, 
  Brain,
  Settings,
  BarChart3,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Play,
  Pause,
  Square,
  Plus,
  Minus,
  ArrowUpDown,
  Calendar,
  Timer,
  Layers,
  Network,
  Coins
} from "lucide-react"
import { oneInchAPI } from "@/lib/1inch-api"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"

interface AdvancedOrder {
  id: string
  type: "limit" | "twap" | "stop-loss" | "options" | "concentrated" | "composable"
  fromToken: string
  toToken: string
  amount: string
  price: string
  status: "active" | "pending" | "completed" | "cancelled" | "expired"
  strategy: string
  parameters: Record<string, any>
  createdAt: string
  expiresAt: string
  progress: number
  filledAmount?: string
  remainingAmount?: string
  pnl?: string
}

interface StrategyTemplate {
  id: string
  name: string
  description: string
  type: string
  complexity: "basic" | "intermediate" | "advanced"
  parameters: Record<string, any>
  riskLevel: "low" | "medium" | "high"
  expectedReturn: string
}

const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    id: "twap-basic",
    name: "Basic TWAP",
    description: "Time-Weighted Average Price execution over specified time",
    type: "twap",
    complexity: "basic",
    riskLevel: "low",
    expectedReturn: "2-5%",
    parameters: {
      duration: 3600, // 1 hour
      intervals: 12,
      priceDeviation: 0.02
    }
  },
  {
    id: "options-call",
    name: "Call Option Strategy",
    description: "Synthetic call option using limit orders",
    type: "options",
    complexity: "advanced",
    riskLevel: "high",
    expectedReturn: "10-50%",
    parameters: {
      strikePrice: "",
      expiration: 86400, // 24 hours
      premium: 0.05
    }
  },
  {
    id: "concentrated-liquidity",
    name: "Concentrated Liquidity",
    description: "Provide liquidity in specific price ranges",
    type: "concentrated",
    complexity: "intermediate",
    riskLevel: "medium",
    expectedReturn: "5-15%",
    parameters: {
      minPrice: "",
      maxPrice: "",
      feeTier: 0.003
    }
  },
  {
    id: "stop-loss-dynamic",
    name: "Dynamic Stop-Loss",
    description: "Adaptive stop-loss based on market volatility",
    type: "stop-loss",
    complexity: "intermediate",
    riskLevel: "medium",
    expectedReturn: "3-8%",
    parameters: {
      initialStop: 0.05,
      trailingStop: 0.02,
      volatilityMultiplier: 1.5
    }
  },
  {
    id: "composable-multi",
    name: "Multi-Step Strategy",
    description: "Complex strategy with multiple execution steps",
    type: "composable",
    complexity: "advanced",
    riskLevel: "high",
    expectedReturn: "15-40%",
    parameters: {
      steps: [
        { action: "buy", amount: 0.3, condition: "price < target" },
        { action: "hold", duration: 1800, condition: "time elapsed" },
        { action: "sell", amount: 0.7, condition: "price > target * 1.1" }
      ]
    }
  }
]

export default function AdvancedLimitOrderProtocol() {
  const [orders, setOrders] = useState<AdvancedOrder[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyTemplate | null>(null)
  const [orderForm, setOrderForm] = useState({
    fromToken: "",
    toToken: "",
    amount: "",
    price: "",
    strategy: "",
    parameters: {} as Record<string, any>
  })
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState("strategies")
  const [aiInsights, setAiInsights] = useState<string[]>([])

  const { isConnected, address } = useWallet()
  const { addNotification } = useNotification()

  // Generate AI insights for current market conditions
  useEffect(() => {
    if (orders.length > 0) {
      const insights = [
        "Market volatility suggests TWAP strategies for large orders",
        "Current price action favors call option strategies",
        "Concentrated liquidity opportunities in ETH/USDC pair",
        "Dynamic stop-loss recommended for current market conditions"
      ]
      setAiInsights(insights)
    }
  }, [orders])

  const createAdvancedOrder = useCallback(async () => {
    if (!isConnected || !address || !selectedStrategy) {
      addNotification({
        type: "error",
        message: "Please connect wallet and select a strategy",
        duration: 3000,
      })
      return
    }

    setIsCreating(true)

    try {
      // Simulate onchain order creation
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newOrder: AdvancedOrder = {
        id: `order_${Date.now()}`,
        type: selectedStrategy.type as any,
        fromToken: orderForm.fromToken,
        toToken: orderForm.toToken,
        amount: orderForm.amount,
        price: orderForm.price,
        status: "active",
        strategy: selectedStrategy.name,
        parameters: { ...selectedStrategy.parameters, ...orderForm.parameters },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        filledAmount: "0",
        remainingAmount: orderForm.amount
      }

      setOrders(prev => [newOrder, ...prev])
      setOrderForm({
        fromToken: "",
        toToken: "",
        amount: "",
        price: "",
        strategy: "",
        parameters: {}
      })
      setSelectedStrategy(null)

      addNotification({
        type: "success",
        message: `Advanced ${selectedStrategy.name} order created successfully!`,
        duration: 5000,
      })
    } catch (error) {
      console.error('Error creating advanced order:', error)
      addNotification({
        type: "error",
        message: "Failed to create advanced order",
        duration: 5000,
      })
    } finally {
      setIsCreating(false)
    }
  }, [orderForm, selectedStrategy, isConnected, address, addNotification])

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      // Simulate onchain cancellation
      await new Promise(resolve => setTimeout(resolve, 1000))

      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: "cancelled" as const }
          : order
      ))

      addNotification({
        type: "success",
        message: "Order cancelled successfully",
        duration: 3000,
      })
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to cancel order",
        duration: 3000,
      })
    }
  }, [addNotification])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400"
      case "pending": return "text-yellow-400"
      case "completed": return "text-blue-400"
      case "cancelled": return "text-red-400"
      case "expired": return "text-gray-400"
      default: return "text-gray-400"
    }
  }

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case "twap": return <Timer className="h-4 w-4" />
      case "options": return <TrendingUp className="h-4 w-4" />
      case "concentrated": return <Layers className="h-4 w-4" />
      case "stop-loss": return <Shield className="h-4 w-4" />
      case "composable": return <Settings className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Target className="h-8 w-8 text-blue-400" />
          Advanced Limit Order Protocol
          <Brain className="h-6 w-6 text-purple-400" />
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Extend 1inch Limit Order Protocol with advanced strategies: TWAP, Options, 
          Concentrated Liquidity, and AI-powered composable strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Templates */}
        <div className="lg:col-span-1">
          <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Strategy Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {STRATEGY_TEMPLATES.map((strategy) => (
                <div
                  key={strategy.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedStrategy?.id === strategy.id
                      ? 'border-purple-400 bg-purple-500/10'
                      : 'border-gray-600 hover:border-purple-400/50'
                  }`}
                  onClick={() => setSelectedStrategy(strategy)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStrategyIcon(strategy.type)}
                      <span className="font-semibold text-white">{strategy.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        strategy.riskLevel === 'low' ? 'border-green-400 text-green-300' :
                        strategy.riskLevel === 'medium' ? 'border-yellow-400 text-yellow-300' :
                        'border-red-400 text-red-300'
                      }`}
                    >
                      {strategy.riskLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{strategy.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Expected Return:</span>
                    <span className="text-green-400 font-semibold">{strategy.expectedReturn}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Creation */}
        <div className="lg:col-span-2">
          <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  Create Advanced Order
                </span>
                {selectedStrategy && (
                  <Badge variant="outline" className="border-purple-400/50 text-purple-300">
                    {selectedStrategy.name}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedStrategy ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">From Token</label>
                      <Input
                        value={orderForm.fromToken}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, fromToken: e.target.value }))}
                        placeholder="Token address"
                        className="bg-gray-800/50 border-blue-500/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">To Token</label>
                      <Input
                        value={orderForm.toToken}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, toToken: e.target.value }))}
                        placeholder="Token address"
                        className="bg-gray-800/50 border-blue-500/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Amount</label>
                      <Input
                        value={orderForm.amount}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="0.0"
                        className="bg-gray-800/50 border-blue-500/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Price</label>
                      <Input
                        value={orderForm.price}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.0"
                        className="bg-gray-800/50 border-blue-500/30"
                      />
                    </div>
                  </div>

                  {/* Strategy-specific parameters */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white">Strategy Parameters</h4>
                    {selectedStrategy.type === "twap" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Duration (seconds)</label>
                          <Input
                            value={orderForm.parameters.duration || selectedStrategy.parameters.duration}
                            onChange={(e) => setOrderForm(prev => ({ 
                              ...prev, 
                              parameters: { ...prev.parameters, duration: e.target.value }
                            }))}
                            className="bg-gray-800/50 border-blue-500/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Intervals</label>
                          <Input
                            value={orderForm.parameters.intervals || selectedStrategy.parameters.intervals}
                            onChange={(e) => setOrderForm(prev => ({ 
                              ...prev, 
                              parameters: { ...prev.parameters, intervals: e.target.value }
                            }))}
                            className="bg-gray-800/50 border-blue-500/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Price Deviation</label>
                          <Input
                            value={orderForm.parameters.priceDeviation || selectedStrategy.parameters.priceDeviation}
                            onChange={(e) => setOrderForm(prev => ({ 
                              ...prev, 
                              parameters: { ...prev.parameters, priceDeviation: e.target.value }
                            }))}
                            className="bg-gray-800/50 border-blue-500/30"
                          />
                        </div>
                      </div>
                    )}

                    {selectedStrategy.type === "options" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Strike Price</label>
                          <Input
                            value={orderForm.parameters.strikePrice || ""}
                            onChange={(e) => setOrderForm(prev => ({ 
                              ...prev, 
                              parameters: { ...prev.parameters, strikePrice: e.target.value }
                            }))}
                            placeholder="Strike price"
                            className="bg-gray-800/50 border-blue-500/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Expiration (seconds)</label>
                          <Input
                            value={orderForm.parameters.expiration || selectedStrategy.parameters.expiration}
                            onChange={(e) => setOrderForm(prev => ({ 
                              ...prev, 
                              parameters: { ...prev.parameters, expiration: e.target.value }
                            }))}
                            className="bg-gray-800/50 border-blue-500/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Premium</label>
                          <Input
                            value={orderForm.parameters.premium || selectedStrategy.parameters.premium}
                            onChange={(e) => setOrderForm(prev => ({ 
                              ...prev, 
                              parameters: { ...prev.parameters, premium: e.target.value }
                            }))}
                            className="bg-gray-800/50 border-blue-500/30"
                          />
                        </div>
                      </div>
                    )}

                    {selectedStrategy.type === "concentrated" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Min Price</label>
                          <Input
                            value={orderForm.parameters.minPrice || ""}
                            onChange={(e) => setOrderForm(prev => ({ 
                              ...prev, 
                              parameters: { ...prev.parameters, minPrice: e.target.value }
                            }))}
                            placeholder="Minimum price"
                            className="bg-gray-800/50 border-blue-500/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Max Price</label>
                          <Input
                            value={orderForm.parameters.maxPrice || ""}
                            onChange={(e) => setOrderForm(prev => ({ 
                              ...prev, 
                              parameters: { ...prev.parameters, maxPrice: e.target.value }
                            }))}
                            placeholder="Maximum price"
                            className="bg-gray-800/50 border-blue-500/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Fee Tier</label>
                          <Input
                            value={orderForm.parameters.feeTier || selectedStrategy.parameters.feeTier}
                            onChange={(e) => setOrderForm(prev => ({ 
                              ...prev, 
                              parameters: { ...prev.parameters, feeTier: e.target.value }
                            }))}
                            className="bg-gray-800/50 border-blue-500/30"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={createAdvancedOrder}
                    disabled={isCreating || !orderForm.fromToken || !orderForm.toToken || !orderForm.amount || !orderForm.price}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isCreating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Target className="h-4 w-4 mr-2" />
                    )}
                    Create {selectedStrategy.name} Order
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a strategy template to create an advanced order</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Orders */}
      {orders.length > 0 && (
        <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              Active Advanced Orders ({orders.filter(o => o.status === "active").length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-gray-800/30 rounded-lg border border-gray-600 hover:border-green-400/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStrategyIcon(order.type)}
                      <div>
                        <div className="font-semibold text-white">{order.strategy}</div>
                        <div className="text-sm text-gray-400">
                          {order.fromToken} → {order.toToken}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(order.status)} border-current`}
                      >
                        {order.status}
                      </Badge>
                      {order.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelOrder(order.id)}
                          className="border-red-400/50 text-red-300 hover:border-red-400"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <div className="text-white">{order.amount}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Price:</span>
                      <div className="text-white">{order.price}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Filled:</span>
                      <div className="text-white">{order.filledAmount || "0"}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Progress:</span>
                      <div className="text-white">{order.progress}%</div>
                    </div>
                  </div>

                  {order.progress > 0 && (
                    <Progress value={order.progress} className="mt-3 h-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              AI Strategy Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Alert */}
      {!isConnected && (
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to use Advanced Limit Order Protocol
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 