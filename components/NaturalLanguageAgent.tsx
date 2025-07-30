"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, Zap, AlertCircle, CheckCircle, Loader2, Sparkles, HelpCircle } from "lucide-react"
import { useNotification } from "@/contexts/NotificationContext"
import { AICommandProcessor, CommandIntent } from "@/lib/ai-command-processor"

/**
 * Props interface for NaturalLanguageAgent component
 */
interface NaturalLanguageAgentProps {
  /** Callback for executing natural language commands */
  onExecute?: (query: string) => Promise<AgentResponse>
  /** Callback for parsing natural language input */
  onParseQuery?: (query: string) => Promise<AgentResponse>
  /** Custom className for styling */
  className?: string
  /** Initial placeholder text */
  placeholder?: string
  /** Maximum query length */
  maxQueryLength?: number
}

/**
 * Agent response structure
 */
interface AgentResponse {
  intent: string
  action: string
  parameters: Record<string, any>
  confidence: number
  executionPlan?: string[]
  type?: string
}

/**
 * Agent status types
 */
type AgentStatus = "idle" | "understanding" | "ready" | "executing" | "error" | "success"

/**
 * Natural Language Agent Component
 *
 * Provides an AI-powered interface for executing DeFi operations using natural language.
 * Features real-time parsing, execution planning, and animated state transitions.
 *
 * @param props - Component props
 * @returns JSX.Element
 */
export default function NaturalLanguageAgent({
  onExecute,
  onParseQuery,
  className = "",
  placeholder = "e.g., Swap 100 USDC for ETH on Ethereum at best rate",
  maxQueryLength = 500,
}: NaturalLanguageAgentProps) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<AgentStatus>("idle")
  const [response, setResponse] = useState<AgentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const { addNotification } = useNotification()

  /**
   * Default natural language processing function
   * TODO: Replace with actual AI agent API integration
   */
  const defaultParseQuery = useCallback(async (input: string): Promise<AgentResponse> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock response based on input patterns
    if (input.toLowerCase().includes("swap")) {
      return {
        intent: "Token Swap",
        action: `Execute swap: ${input}`,
        parameters: {
          fromToken: "USDC",
          toToken: "ETH",
          amount: "100",
          chain: "Ethereum",
          slippage: "0.5%",
        },
        confidence: 0.95,
        executionPlan: ["Analyze swap parameters", "Find best route via 1inch", "Execute swap transaction"],
      }
    } else if (input.toLowerCase().includes("bridge")) {
      return {
        intent: "Cross-Chain Bridge",
        action: `Bridge assets: ${input}`,
        parameters: {
          fromChain: "Ethereum",
          toChain: "Aptos",
          token: "USDC",
          amount: "500",
        },
        confidence: 0.88,
        executionPlan: ["Validate cross-chain parameters", "Initiate bridge transaction", "Monitor bridge completion"],
      }
    } else if (input.toLowerCase().includes("limit")) {
      return {
        intent: "Limit Order",
        action: `Create limit order: ${input}`,
        parameters: {
          type: "limit",
          fromToken: "ETH",
          toToken: "USDC",
          amount: "1",
          targetPrice: "2500",
        },
        confidence: 0.92,
        executionPlan: ["Parse order parameters", "Validate price targets", "Submit limit order"],
      }
    } else {
      return {
        intent: "General Query",
        action: `Process request: ${input}`,
        parameters: {},
        confidence: 0.75,
        executionPlan: ["Analyze request", "Provide guidance"],
      }
    }
  }, [])

  /**
   * Handle query submission and parsing
   */
  const handleSubmit = useCallback(async () => {
    if (!query.trim()) return

    setStatus("understanding")
    setError(null)
    setIsRetrying(false)

    try {
      const parseFunction = onParseQuery || defaultParseQuery
      const agentResponse = await parseFunction(query)

      setResponse(agentResponse)
      setStatus("ready")

      addNotification({
        type: "success",
        message: `Query understood with ${Math.round(agentResponse.confidence * 100)}% confidence`,
        duration: 3000,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process your request"
      setError(errorMessage)
      setStatus("error")

      addNotification({
        type: "error",
        message: "Failed to process natural language query",
        duration: 5000,
      })
    }
  }, [query, onParseQuery, defaultParseQuery, addNotification])

  /**
   * Handle command execution
   */
  const handleExecute = useCallback(async () => {
    if (!response) return

    setStatus("executing")

    try {
      if (onExecute) {
        await onExecute(query)
      } else {
        // Default execution simulation
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }

      setStatus("success")

      // Auto-reset after success
      setTimeout(() => {
        setQuery("")
        setResponse(null)
        setStatus("idle")
      }, 2000)

      addNotification({
        type: "success",
        message: "Command executed successfully!",
        duration: 4000,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Execution failed"
      setError(errorMessage)
      setStatus("error")

      addNotification({
        type: "error",
        message: "Command execution failed",
        duration: 5000,
      })
    }
  }, [response, query, onExecute, addNotification])

  /**
   * Handle retry logic
   */
  const handleRetry = useCallback(async () => {
    setIsRetrying(true)
    await handleSubmit()
    setIsRetrying(false)
  }, [handleSubmit])

  /**
   * Get status icon with animation
   */
  const getStatusIcon = () => {
    const iconProps = { className: "h-5 w-5" }

    switch (status) {
      case "understanding":
        return <Loader2 {...iconProps} className="h-5 w-5 animate-spin text-blue-400" />
      case "ready":
        return <CheckCircle {...iconProps} className="h-5 w-5 text-green-400" />
      case "executing":
        return <Loader2 {...iconProps} className="h-5 w-5 animate-spin text-purple-400" />
      case "success":
        return <Sparkles {...iconProps} className="h-5 w-5 text-green-400" />
      case "error":
        return <AlertCircle {...iconProps} className="h-5 w-5 text-red-400" />
      default:
        return <Bot {...iconProps} className="h-5 w-5 text-blue-400" />
    }
  }

  /**
   * Get status text
   */
  const getStatusText = () => {
    switch (status) {
      case "understanding":
        return "Understanding your request..."
      case "ready":
        return "Ready to execute"
      case "executing":
        return "Executing command..."
      case "success":
        return "Command completed successfully!"
      case "error":
        return "Error occurred"
      default:
        return "AI Agent Ready"
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

  const responseVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  }

  return (
    <motion.section className={`${className}`} initial="hidden" animate="visible" variants={cardVariants}>
      {/* Header */}
      <motion.div
        className="text-center space-y-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold neon-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Natural Language DeFi Agent
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Execute complex DeFi operations using natural language. Just describe what you want to do.
        </p>
      </motion.div>

      {/* Main Card */}
      <Card className="glass-panel border-blue-500/30 shadow-2xl shadow-blue-500/10 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-400" />
            <span>AI-Powered Command Interface</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, maxQueryLength))}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400 text-white placeholder-gray-400 h-12 text-lg pr-12"
                disabled={status === "understanding" || status === "executing"}
                aria-label="Natural language command input"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {query.length}/{maxQueryLength}
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSubmit}
                disabled={!query.trim() || status === "understanding" || status === "executing"}
                className="neon-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border border-blue-400/50 shadow-lg shadow-blue-500/20 px-8 h-12"
              >
                {status === "understanding" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {status === "understanding" ? "Analyzing..." : "Analyze"}
              </Button>
            </motion.div>
          </div>

          {/* Status Display */}
          <motion.div
            className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-blue-500/20"
            animate={{
              borderColor:
                status === "error"
                  ? "rgba(239, 68, 68, 0.5)"
                  : status === "success"
                    ? "rgba(34, 197, 94, 0.5)"
                    : "rgba(59, 130, 246, 0.2)",
            }}
          >
            <motion.div
              animate={{ rotate: status === "understanding" || status === "executing" ? 360 : 0 }}
              transition={{
                duration: 2,
                repeat: status === "understanding" || status === "executing" ? Number.POSITIVE_INFINITY : 0,
              }}
            >
              {getStatusIcon()}
            </motion.div>
            <span className="font-medium text-blue-300">{getStatusText()}</span>

            {error && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="text-red-400 hover:text-red-300"
                >
                  {isRetrying ? <Loader2 className="h-3 w-3 animate-spin" /> : "Retry"}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Response Display */}
          <AnimatePresence>
            {response && (
              <motion.div
                variants={responseVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-300">Parsed Intent: {response.intent}</h3>
                    <span className="text-sm text-gray-400">Confidence: {Math.round(response.confidence * 100)}%</span>
                  </div>
                  <p className="text-gray-300 mb-4">{response.action}</p>

                  {/* Parameters */}
                  {Object.keys(response.parameters).length > 0 && (
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-gray-400">Parameters:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(response.parameters).map(([key, value]) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gray-800/50 p-2 rounded text-sm"
                          >
                            <div className="text-gray-400 text-xs capitalize">{key}</div>
                            <div className="text-white font-medium">{String(value)}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Execution Plan */}
                  {response.executionPlan && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-400">Execution Plan:</h4>
                      <div className="space-y-1">
                        {response.executionPlan.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-2 text-sm text-gray-300"
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                              {index + 1}
                            </div>
                            <span>{step}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Execute Button */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Button
                    onClick={handleExecute}
                    disabled={status === "executing"}
                    className="w-full neon-button bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border border-green-400/50 shadow-lg shadow-green-500/20 h-12"
                  >
                    {status === "executing" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Execute Command
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-500/10 border border-red-400/30 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.section>
  )
}
