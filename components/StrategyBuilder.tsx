"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Trash2, Target, Clock, Shield, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { useNotification } from "@/contexts/NotificationContext"
import { useWallet } from "@/contexts/WalletContext"

/**
 * Props interface for StrategyBuilder component
 */
interface StrategyBuilderProps {
  /** Callback for placing orders */
  onPlaceOrder?: (orderData: OrderData) => Promise<OrderResult>
  /** Callback for canceling orders */
  onCancelOrder?: (orderId: string) => Promise<void>
  /** Callback for fetching active orders */
  onFetchOrders?: () => Promise<ActiveOrder[]>
  /** Callback for updating order */
  onUpdateOrder?: (orderId: string, updates: Partial<OrderData>) => Promise<void>
  /** Custom className for styling */
  className?: string
  /** Available tokens for orders */
  availableTokens?: Token[]
  /** Maximum number of active orders */
  maxActiveOrders?: number
}

/**
 * Order data structure
 */
interface OrderData {
  type: "limit" | "twap" | "stop-loss" | "options"
  fromToken: string
  toToken: string
  amount: string
  parameters: Record<string, any>
  chain?: string
}

/**
 * Order result structure
 */
interface OrderResult {
  orderId: string
  status: "pending" | "active" | "failed"
  txHash?: string
}

/**
 * Active order structure
 */
interface ActiveOrder {
  id: string
  type: "limit" | "twap" | "stop-loss" | "options"
  fromToken: string
  toToken: string
  amount: string
  status: "active" | "partially_filled" | "completed" | "cancelled" | "expired"
  progress: number
  createdAt: string
  parameters: Record<string, any>
  estimatedCompletion?: string
  filledAmount?: string
}

/**
 * Token structure
 */
interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoUrl?: string
}

/**
 * Strategy status types
 */
type StrategyStatus = "idle" | "placing" | "cancelling" | "updating" | "error"

/**
 * Strategy Builder Component
 *
 * Provides advanced order creation and management functionality including
 * limit orders, TWAP, stop-loss, and options strategies with real-time monitoring.
 *
 * @param props - Component props
 * @returns JSX.Element
 */
export default function StrategyBuilder({
  onPlaceOrder,
  onCancelOrder,
  onFetchOrders,
  onUpdateOrder,
  className = "",
  availableTokens = [],
  maxActiveOrders = 10,
}: StrategyBuilderProps) {
  const [activeTab, setActiveTab] = useState("limit")
  const [status, setStatus] = useState<StrategyStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<ActiveOrder[]>([
    {
      id: "1",
      type: "limit",
      fromToken: "ETH",
      toToken: "USDC",
      amount: "1.0",
      status: "active",
      progress: 0,
      createdAt: "2 hours ago",
      parameters: { targetPrice: "2500", expiry: "24h" },
      estimatedCompletion: "When price reaches $2500",
    },
    {
      id: "2",
      type: "twap",
      fromToken: "USDC",
      toToken: "ETH",
      amount: "5000",
      status: "partially_filled",
      progress: 35,
      createdAt: "1 day ago",
      parameters: { duration: "12h", intervals: "30m" },
      filledAmount: "1750",
      estimatedCompletion: "7 hours remaining",
    },
  ])

  // Form states for different order types
  const [limitOrder, setLimitOrder] = useState({
    fromToken: "ETH",
    toToken: "USDC",
    amount: "",
    targetPrice: "",
    expiry: "24",
    slippage: "0.5",
  })

  const [twapOrder, setTwapOrder] = useState({
    fromToken: "USDC",
    toToken: "ETH",
    amount: "",
    duration: "12",
    intervals: "30",
    priceLimit: "",
  })

  const [stopLossOrder, setStopLossOrder] = useState({
    fromToken: "ETH",
    toToken: "USDC",
    amount: "",
    triggerPrice: "",
    slippage: "1",
    trailingPercent: "",
  })

  const [optionsOrder, setOptionsOrder] = useState({
    underlying: "ETH",
    strikePrice: "",
    expiry: "7",
    optionType: "call",
    premium: "",
  })

  const { addNotification } = useNotification()
  const { isConnected, connect } = useWallet()

  /**
   * Handle order placement
   */
  const handlePlaceOrder = useCallback(
    async (type: string) => {
      if (!isConnected) {
        await connect()
        return
      }

      if (orders.length >= maxActiveOrders) {
        addNotification({
          type: "error",
          message: `Maximum of ${maxActiveOrders} active orders allowed`,
          duration: 4000,
        })
        return
      }

      let orderData: OrderData

      switch (type) {
        case "limit":
          if (!limitOrder.amount || !limitOrder.targetPrice) {
            setError("Please fill in all required fields")
            return
          }
          orderData = {
            type: "limit",
            fromToken: limitOrder.fromToken,
            toToken: limitOrder.toToken,
            amount: limitOrder.amount,
            parameters: {
              targetPrice: limitOrder.targetPrice,
              expiry: limitOrder.expiry + "h",
              slippage: limitOrder.slippage + "%",
            },
          }
          break
        case "twap":
          if (!twapOrder.amount || !twapOrder.duration) {
            setError("Please fill in all required fields")
            return
          }
          orderData = {
            type: "twap",
            fromToken: twapOrder.fromToken,
            toToken: twapOrder.toToken,
            amount: twapOrder.amount,
            parameters: {
              duration: twapOrder.duration + "h",
              intervals: twapOrder.intervals + "m",
              priceLimit: twapOrder.priceLimit || "market",
            },
          }
          break
        case "stop-loss":
          if (!stopLossOrder.amount || !stopLossOrder.triggerPrice) {
            setError("Please fill in all required fields")
            return
          }
          orderData = {
            type: "stop-loss",
            fromToken: stopLossOrder.fromToken,
            toToken: stopLossOrder.toToken,
            amount: stopLossOrder.amount,
            parameters: {
              triggerPrice: stopLossOrder.triggerPrice,
              slippage: stopLossOrder.slippage + "%",
              trailingPercent: stopLossOrder.trailingPercent || "0",
            },
          }
          break
        case "options":
          if (!optionsOrder.strikePrice || !optionsOrder.premium) {
            setError("Please fill in all required fields")
            return
          }
          orderData = {
            type: "options",
            fromToken: optionsOrder.underlying,
            toToken: "USD",
            amount: "1", // Options are typically 1 contract
            parameters: {
              strikePrice: optionsOrder.strikePrice,
              expiry: optionsOrder.expiry + "d",
              optionType: optionsOrder.optionType,
              premium: optionsOrder.premium,
            },
          }
          break
        default:
          return
      }

      setStatus("placing")
      setError(null)

      try {
        let result: OrderResult

        if (onPlaceOrder) {
          result = await onPlaceOrder(orderData)
        } else {
          // Default order placement simulation
          await new Promise((resolve) => setTimeout(resolve, 2000))
          result = {
            orderId: Date.now().toString(),
            status: "active",
            txHash: "0x" + Math.random().toString(16).substr(2, 64),
          }
        }

        // Add to orders list
        const newOrder: ActiveOrder = {
          id: result.orderId,
          ...orderData,
          status: "active",
          progress: 0,
          createdAt: "Just now",
          estimatedCompletion: type === "limit" ? "When conditions are met" : "Processing...",
        }
        setOrders((prev) => [newOrder, ...prev])

        addNotification({
          type: "success",
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} order placed successfully`,
          duration: 4000,
        })

        // Reset form
        resetForm(type)
        setStatus("idle")
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to place order"
        setError(errorMessage)
        setStatus("error")

        addNotification({
          type: "error",
          message: "Failed to place order",
          duration: 4000,
        })
      }
    },
    [
      isConnected,
      connect,
      orders.length,
      maxActiveOrders,
      limitOrder,
      twapOrder,
      stopLossOrder,
      optionsOrder,
      onPlaceOrder,
      addNotification,
    ],
  )

  /**
   * Handle order cancellation
   */
  const handleCancelOrder = useCallback(
    async (orderId: string) => {
      setStatus("cancelling")

      try {
        if (onCancelOrder) {
          await onCancelOrder(orderId)
        } else {
          // Default cancel simulation
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        setOrders((prev) => prev.filter((order) => order.id !== orderId))

        addNotification({
          type: "success",
          message: "Order cancelled successfully",
          duration: 3000,
        })

        setStatus("idle")
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to cancel order"
        setError(errorMessage)
        setStatus("error")

        addNotification({
          type: "error",
          message: "Failed to cancel order",
          duration: 4000,
        })
      }
    },
    [onCancelOrder, addNotification],
  )

  /**
   * Reset form based on type
   */
  const resetForm = useCallback((type: string) => {
    switch (type) {
      case "limit":
        setLimitOrder((prev) => ({ ...prev, amount: "", targetPrice: "" }))
        break
      case "twap":
        setTwapOrder((prev) => ({ ...prev, amount: "" }))
        break
      case "stop-loss":
        setStopLossOrder((prev) => ({ ...prev, amount: "", triggerPrice: "" }))
        break
      case "options":
        setOptionsOrder((prev) => ({ ...prev, strikePrice: "", premium: "" }))
        break
    }
  }, [])

  /**
   * Get status color for orders
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-blue-400/50 text-blue-400"
      case "partially_filled":
        return "border-yellow-400/50 text-yellow-400"
      case "completed":
        return "border-green-400/50 text-green-400"
      case "cancelled":
        return "border-red-400/50 text-red-400"
      case "expired":
        return "border-gray-400/50 text-gray-400"
      default:
        return "border-gray-400/50 text-gray-400"
    }
  }

  /**
   * Get order type icon
   */
  const getOrderIcon = (type: string) => {
    switch (type) {
      case "limit":
        return Target
      case "twap":
        return Clock
      case "stop-loss":
        return Shield
      case "options":
        return TrendingUp
      default:
        return Settings
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  }

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Strategy Builder */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-400" />
                <span>Advanced Order Builder</span>
              </div>
              <Badge variant="outline" className="border-blue-400/50 text-blue-300">
                {orders.length}/{maxActiveOrders} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-blue-500/30">
                {["limit", "twap", "stop-loss", "options"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 capitalize"
                  >
                    {tab.replace("-", " ")}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Limit Order Tab */}
              <TabsContent value="limit">
                <motion.div variants={tabVariants} initial="hidden" animate="visible" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">From Token</label>
                      <Input
                        value={limitOrder.fromToken}
                        onChange={(e) => setLimitOrder((prev) => ({ ...prev, fromToken: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">To Token</label>
                      <Input
                        value={limitOrder.toToken}
                        onChange={(e) => setLimitOrder((prev) => ({ ...prev, toToken: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Amount *</label>
                      <Input
                        placeholder="0.0"
                        value={limitOrder.amount}
                        onChange={(e) => setLimitOrder((prev) => ({ ...prev, amount: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Target Price *</label>
                      <Input
                        placeholder="0.0"
                        value={limitOrder.targetPrice}
                        onChange={(e) => setLimitOrder((prev) => ({ ...prev, targetPrice: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Expiry (hours)</label>
                      <Input
                        value={limitOrder.expiry}
                        onChange={(e) => setLimitOrder((prev) => ({ ...prev, expiry: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Slippage (%)</label>
                      <Input
                        value={limitOrder.slippage}
                        onChange={(e) => setLimitOrder((prev) => ({ ...prev, slippage: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-blue-300">Limit Order Strategy</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Your order will execute when the market price reaches your target price. Set expiry to
                      automatically cancel if not filled within the timeframe.
                    </p>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handlePlaceOrder("limit")}
                      disabled={!limitOrder.amount || !limitOrder.targetPrice || status === "placing"}
                      className="w-full neon-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border border-blue-400/50 shadow-lg shadow-blue-500/20"
                    >
                      {status === "placing" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Place Limit Order
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* TWAP Order Tab */}
              <TabsContent value="twap">
                <motion.div variants={tabVariants} initial="hidden" animate="visible" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">From Token</label>
                      <Input
                        value={twapOrder.fromToken}
                        onChange={(e) => setTwapOrder((prev) => ({ ...prev, fromToken: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">To Token</label>
                      <Input
                        value={twapOrder.toToken}
                        onChange={(e) => setTwapOrder((prev) => ({ ...prev, toToken: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Total Amount *</label>
                      <Input
                        placeholder="0.0"
                        value={twapOrder.amount}
                        onChange={(e) => setTwapOrder((prev) => ({ ...prev, amount: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Duration (hours) *</label>
                      <Input
                        value={twapOrder.duration}
                        onChange={(e) => setTwapOrder((prev) => ({ ...prev, duration: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Intervals (minutes)</label>
                      <Input
                        value={twapOrder.intervals}
                        onChange={(e) => setTwapOrder((prev) => ({ ...prev, intervals: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Price Limit (optional)</label>
                      <Input
                        placeholder="Market price"
                        value={twapOrder.priceLimit}
                        onChange={(e) => setTwapOrder((prev) => ({ ...prev, priceLimit: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-purple-300">TWAP Strategy</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Time-Weighted Average Price execution splits your order into smaller chunks over the specified
                      duration to minimize price impact and achieve better average pricing.
                    </p>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handlePlaceOrder("twap")}
                      disabled={!twapOrder.amount || !twapOrder.duration || status === "placing"}
                      className="w-full neon-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border border-purple-400/50 shadow-lg shadow-purple-500/20"
                    >
                      {status === "placing" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Place TWAP Order
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* Stop-Loss Order Tab */}
              <TabsContent value="stop-loss">
                <motion.div variants={tabVariants} initial="hidden" animate="visible" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">From Token</label>
                      <Input
                        value={stopLossOrder.fromToken}
                        onChange={(e) => setStopLossOrder((prev) => ({ ...prev, fromToken: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">To Token</label>
                      <Input
                        value={stopLossOrder.toToken}
                        onChange={(e) => setStopLossOrder((prev) => ({ ...prev, toToken: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Amount *</label>
                      <Input
                        placeholder="0.0"
                        value={stopLossOrder.amount}
                        onChange={(e) => setStopLossOrder((prev) => ({ ...prev, amount: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Trigger Price *</label>
                      <Input
                        placeholder="0.0"
                        value={stopLossOrder.triggerPrice}
                        onChange={(e) => setStopLossOrder((prev) => ({ ...prev, triggerPrice: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Max Slippage (%)</label>
                      <Input
                        value={stopLossOrder.slippage}
                        onChange={(e) => setStopLossOrder((prev) => ({ ...prev, slippage: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Trailing % (optional)</label>
                      <Input
                        placeholder="0"
                        value={stopLossOrder.trailingPercent}
                        onChange={(e) => setStopLossOrder((prev) => ({ ...prev, trailingPercent: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-red-300">Stop-Loss Protection</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Automatically sell your tokens when the price drops to the trigger level to limit losses. Optional
                      trailing stop adjusts the trigger price as the market moves in your favor.
                    </p>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handlePlaceOrder("stop-loss")}
                      disabled={!stopLossOrder.amount || !stopLossOrder.triggerPrice || status === "placing"}
                      className="w-full neon-button bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 border border-red-400/50 shadow-lg shadow-red-500/20"
                    >
                      {status === "placing" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Place Stop-Loss Order
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* Options Tab */}
              <TabsContent value="options">
                <motion.div variants={tabVariants} initial="hidden" animate="visible" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Underlying Asset</label>
                      <Input
                        value={optionsOrder.underlying}
                        onChange={(e) => setOptionsOrder((prev) => ({ ...prev, underlying: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Option Type</label>
                      <select
                        value={optionsOrder.optionType}
                        onChange={(e) => setOptionsOrder((prev) => ({ ...prev, optionType: e.target.value }))}
                        className="w-full bg-gray-800/50 border border-blue-500/30 rounded-md px-3 py-2 text-white focus:border-blue-400"
                        disabled={status === "placing"}
                      >
                        <option value="call">Call Option</option>
                        <option value="put">Put Option</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Strike Price *</label>
                      <Input
                        placeholder="0.0"
                        value={optionsOrder.strikePrice}
                        onChange={(e) => setOptionsOrder((prev) => ({ ...prev, strikePrice: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Expiry (days)</label>
                      <Input
                        value={optionsOrder.expiry}
                        onChange={(e) => setOptionsOrder((prev) => ({ ...prev, expiry: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-gray-400">Premium *</label>
                      <Input
                        placeholder="0.0"
                        value={optionsOrder.premium}
                        onChange={(e) => setOptionsOrder((prev) => ({ ...prev, premium: e.target.value }))}
                        className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400"
                        disabled={status === "placing"}
                      />
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-300">Options Strategy</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Options provide leveraged exposure with limited risk. Call options profit from price increases,
                      while put options profit from price decreases. Maximum loss is limited to the premium paid.
                    </p>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handlePlaceOrder("options")}
                      disabled={!optionsOrder.strikePrice || !optionsOrder.premium || status === "placing"}
                      className="w-full neon-button bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border border-green-400/50 shadow-lg shadow-green-500/20"
                    >
                      {status === "placing" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Place Options Order
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-300 text-sm">{error}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setError(null)}
                      className="ml-auto text-red-400 hover:text-red-300 h-6 px-2"
                    >
                      Dismiss
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Orders */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
        <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span>Active Orders</span>
              <Badge variant="outline" className="border-blue-400/50 text-blue-300">
                {orders.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {orders.map((order, index) => {
                    const IconComponent = getOrderIcon(order.type)
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-800/30 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white capitalize">
                                {order.type.replace("-", " ")} Order
                              </div>
                              <div className="text-sm text-gray-400">
                                {order.amount} {order.fromToken} → {order.toToken}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>
                              {order.status.replace("_", " ").toUpperCase()}
                            </Badge>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={status === "cancelling"}
                                className="w-8 h-8 hover:bg-red-500/20 hover:text-red-400"
                              >
                                {status === "cancelling" ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </motion.div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {order.progress > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-white">{order.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${order.progress}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              />
                            </div>
                            {order.filledAmount && (
                              <div className="text-xs text-gray-400 mt-1">
                                Filled: {order.filledAmount} {order.fromToken}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Order Parameters */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          {Object.entries(order.parameters).map(([key, value]) => (
                            <div key={key}>
                              <div className="text-gray-400 text-xs capitalize">
                                {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                              </div>
                              <div className="text-white font-medium">{String(value)}</div>
                            </div>
                          ))}
                          <div>
                            <div className="text-gray-400 text-xs">Created</div>
                            <div className="text-white font-medium">{order.createdAt}</div>
                          </div>
                        </div>

                        {/* Estimated Completion */}
                        {order.estimatedCompletion && (
                          <div className="text-xs text-gray-400 border-t border-gray-700/50 pt-2">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {order.estimatedCompletion}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Active Orders</h3>
                <p className="text-gray-400">Create your first advanced order using the builder above</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
