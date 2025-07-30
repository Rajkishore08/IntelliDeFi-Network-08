"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Bot, Zap, AlertCircle, CheckCircle, Loader2, Sparkles, HelpCircle, 
  Brain, Cpu, Database, Shield, TrendingUp, Wallet, Network, 
  BarChart3, Settings, Play, Pause, StopCircle, RefreshCw,
  ArrowRight, ChevronDown, ChevronUp, Activity, Target, Globe,
  Lock, Unlock, Eye, EyeOff, Smartphone, Monitor, Server
} from "lucide-react"
import { useNotification } from "@/contexts/NotificationContext"

/**
 * AI Process Types
 */
type AIProcessType = 
  | "intent_analysis"
  | "risk_assessment" 
  | "market_analysis"
  | "wallet_validation"
  | "gas_optimization"
  | "route_calculation"
  | "execution_planning"
  | "security_check"
  | "performance_prediction"
  | "network_analysis"
  | "liquidity_check"
  | "price_impact_analysis"

/**
 * AI Process Status
 */
type ProcessStatus = "pending" | "running" | "completed" | "failed" | "warning"

/**
 * AI Process Interface
 */
interface AIProcess {
  id: AIProcessType
  name: string
  description: string
  status: ProcessStatus
  progress: number
  result?: any
  error?: string
  duration?: number
  icon: React.ReactNode
  category: "analysis" | "security" | "execution" | "optimization"
}

/**
 * Enhanced Agent Response
 */
interface EnhancedAgentResponse {
  intent: string
  action: string
  parameters: Record<string, any>
  confidence: number
  executionPlan?: string[]
  type?: string
  processes: AIProcess[]
  recommendations: string[]
  riskLevel: "low" | "medium" | "high"
  estimatedGas?: string
  estimatedTime?: string
  successProbability?: number
  marketConditions?: any
  securityScore?: number
}

/**
 * Agent status types
 */
type AgentStatus = "idle" | "understanding" | "processing" | "ready" | "executing" | "error" | "success"

/**
 * Advanced AI Dashboard Component
 */
export default function AdvancedAIDashboard() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<AgentStatus>("idle")
  const [response, setResponse] = useState<EnhancedAgentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showProcesses, setShowProcesses] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const { addNotification } = useNotification()

  /**
   * Create comprehensive AI processes
   */
  const createAIProcesses = useCallback((query: string): AIProcess[] => {
    return [
      {
        id: "intent_analysis",
        name: "Intent Analysis",
        description: "Analyzing user intent and extracting key parameters",
        status: "pending",
        progress: 0,
        icon: <Brain className="h-4 w-4" />,
        category: "analysis"
      },
      {
        id: "risk_assessment",
        name: "Risk Assessment",
        description: "Evaluating transaction risks and market conditions",
        status: "pending",
        progress: 0,
        icon: <Shield className="h-4 w-4" />,
        category: "security"
      },
      {
        id: "market_analysis",
        name: "Market Analysis",
        description: "Analyzing current market conditions and liquidity",
        status: "pending",
        progress: 0,
        icon: <TrendingUp className="h-4 w-4" />,
        category: "analysis"
      },
      {
        id: "wallet_validation",
        name: "Wallet Validation",
        description: "Checking wallet connectivity and balance",
        status: "pending",
        progress: 0,
        icon: <Wallet className="h-4 w-4" />,
        category: "security"
      },
      {
        id: "gas_optimization",
        name: "Gas Optimization",
        description: "Optimizing gas fees and transaction timing",
        status: "pending",
        progress: 0,
        icon: <Zap className="h-4 w-4" />,
        category: "optimization"
      },
      {
        id: "route_calculation",
        name: "Route Calculation",
        description: "Finding optimal swap routes across DEXs",
        status: "pending",
        progress: 0,
        icon: <Network className="h-4 w-4" />,
        category: "optimization"
      },
      {
        id: "execution_planning",
        name: "Execution Planning",
        description: "Creating detailed execution strategy",
        status: "pending",
        progress: 0,
        icon: <Target className="h-4 w-4" />,
        category: "execution"
      },
      {
        id: "security_check",
        name: "Security Check",
        description: "Validating contract security and permissions",
        status: "pending",
        progress: 0,
        icon: <Lock className="h-4 w-4" />,
        category: "security"
      },
      {
        id: "performance_prediction",
        name: "Performance Prediction",
        description: "Predicting transaction success probability",
        status: "pending",
        progress: 0,
        icon: <BarChart3 className="h-4 w-4" />,
        category: "analysis"
      },
      {
        id: "network_analysis",
        name: "Network Analysis",
        description: "Analyzing network congestion and fees",
        status: "pending",
        progress: 0,
        icon: <Globe className="h-4 w-4" />,
        category: "analysis"
      },
      {
        id: "liquidity_check",
        name: "Liquidity Check",
        description: "Checking available liquidity across pools",
        status: "pending",
        progress: 0,
        icon: <Database className="h-4 w-4" />,
        category: "analysis"
      },
      {
        id: "price_impact_analysis",
        name: "Price Impact Analysis",
        description: "Calculating price impact and slippage",
        status: "pending",
        progress: 0,
        icon: <Activity className="h-4 w-4" />,
        category: "analysis"
      }
    ]
  }

  /**
   * Simulate AI process execution with realistic timing
   */
  const simulateProcessExecution = useCallback(async (processes: AIProcess[]): Promise<AIProcess[]> => {
    const updatedProcesses = [...processes]
    
    for (let i = 0; i < updatedProcesses.length; i++) {
      const process = updatedProcesses[i]
      
      // Update status to running
      process.status = "running"
      process.progress = 0
      
      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += Math.random() * 20 + 10) {
        process.progress = Math.min(progress, 100)
        setResponse(prev => prev ? { ...prev, processes: [...updatedProcesses] } : null)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100))
      }
      
      // Simulate results based on process type
      switch (process.id) {
        case "intent_analysis":
          process.result = {
            detectedIntent: "swap",
            confidence: 0.95,
            extractedParams: { fromToken: "USDC", toToken: "ETH", amount: "100" },
            complexity: "medium"
          }
          break
        case "risk_assessment":
          process.result = {
            riskLevel: "low",
            riskFactors: ["Liquidity available", "Price impact minimal", "Market stable"],
            recommendations: ["Proceed with transaction", "Set slippage to 0.5%"],
            riskScore: 0.15
          }
          break
        case "market_analysis":
          process.result = {
            currentPrice: "$1850.25",
            priceChange: "+2.3%",
            liquidity: "High",
            volume24h: "$2.1B",
            marketTrend: "bullish",
            volatility: "medium"
          }
          break
        case "wallet_validation":
          process.result = {
            connected: true,
            balance: "1,250.50 USDC",
            network: "Ethereum",
            gasBalance: "0.05 ETH",
            address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
          }
          break
        case "gas_optimization":
          process.result = {
            estimatedGas: "0.0023 ETH",
            gasPrice: "25 Gwei",
            totalCost: "$4.50",
            optimization: "Gas optimized for current network conditions",
            savings: "15% vs standard"
          }
          break
        case "route_calculation":
          process.result = {
            bestRoute: "Uniswap V3",
            expectedOutput: "0.054 ETH",
            priceImpact: "0.12%",
            alternativeRoutes: ["1inch", "SushiSwap"],
            routeEfficiency: "98.5%"
          }
          break
        case "execution_planning":
          process.result = {
            steps: ["Approve USDC", "Execute swap", "Confirm transaction"],
            estimatedTime: "30 seconds",
            successRate: "98.5%",
            fallbackPlan: "Use alternative DEX if needed"
          }
          break
        case "security_check":
          process.result = {
            contractVerified: true,
            permissionsValid: true,
            securityScore: "A+",
            warnings: [],
            auditStatus: "Audited by multiple firms"
          }
          break
        case "performance_prediction":
          process.result = {
            successProbability: 0.985,
            expectedSlippage: "0.05%",
            profitPotential: "High",
            riskRewardRatio: "1:3",
            confidenceInterval: "95%"
          }
          break
        case "network_analysis":
          process.result = {
            congestion: "Low",
            averageGasPrice: "22 Gwei",
            blockTime: "12 seconds",
            networkHealth: "Excellent",
            recommendedGas: "25 Gwei"
          }
          break
        case "liquidity_check":
          process.result = {
            totalLiquidity: "$15.2M",
            availableLiquidity: "$8.7M",
            depth: "High",
            spread: "0.02%",
            poolHealth: "Excellent"
          }
          break
        case "price_impact_analysis":
          process.result = {
            priceImpact: "0.12%",
            slippage: "0.05%",
            impactLevel: "Minimal",
            recommendedSlippage: "0.5%",
            maxTradeSize: "$50K"
          }
          break
      }
      
      process.status = "completed"
      process.duration = Math.random() * 2000 + 1000
      
      // Add some randomness for failed processes
      if (Math.random() < 0.05) {
        process.status = "warning"
        process.error = "Minor warning detected"
      }
    }
    
    return updatedProcesses
  }

  /**
   * Enhanced natural language processing function
   */
  const processQuery = useCallback(async (input: string): Promise<EnhancedAgentResponse> => {
    try {
      const processes = createAIProcesses(input)
      
      // Simulate process execution
      const executedProcesses = await simulateProcessExecution(processes)
      
      // Calculate overall metrics
      const completedProcesses = executedProcesses.filter(p => p.status === "completed").length
      const totalProcesses = executedProcesses.length
      const successRate = completedProcesses / totalProcesses
      
      // Determine risk level based on processes
      const riskLevel = successRate > 0.9 ? "low" : successRate > 0.7 ? "medium" : "high"
      
      // Generate recommendations
      const recommendations = [
        "Transaction appears safe to execute",
        "Consider setting a slippage tolerance of 0.5%",
        "Gas fees are currently optimal",
        "Market conditions are favorable",
        "Security checks passed successfully"
      ]
      
      return {
        intent: "swap",
        action: `Execute ${input}`,
        parameters: { fromToken: "USDC", toToken: "ETH", amount: "100" },
        confidence: 0.95,
        executionPlan: ["Validate wallet", "Check balance", "Approve tokens", "Execute swap", "Confirm transaction"],
        type: "swap",
        processes: executedProcesses,
        recommendations,
        riskLevel,
        estimatedGas: "0.0023 ETH",
        estimatedTime: "30 seconds",
        successProbability: successRate,
        marketConditions: {
          trend: "bullish",
          volatility: "medium",
          liquidity: "high"
        },
        securityScore: 95
      }
    } catch (error) {
      console.error('Error processing query:', error)
      return {
        intent: "General Query",
        action: `Process request: ${input}`,
        parameters: {},
        confidence: 0.75,
        executionPlan: ["Analyze request", "Provide guidance"],
        processes: [],
        recommendations: ["Please try rephrasing your request"],
        riskLevel: "medium",
        successProbability: 0.5
      }
    }
  }, [createAIProcesses, simulateProcessExecution])

  /**
   * Handle query submission and parsing
   */
  const handleSubmit = useCallback(async () => {
    if (!query.trim()) return

    setStatus("understanding")
    setError(null)
    setIsRetrying(false)
    setShowProcesses(true)

    try {
      const agentResponse = await processQuery(query)

      setResponse(agentResponse)
      setStatus("ready")

      addNotification({
        type: "success",
        message: `Analysis completed with ${Math.round(agentResponse.confidence * 100)}% confidence`,
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
  }, [query, processQuery, addNotification])

  /**
   * Handle command execution
   */
  const handleExecute = useCallback(async () => {
    if (!response) return

    setStatus("executing")

    try {
      // Simulate execution
      await new Promise(resolve => setTimeout(resolve, 3000))

      setStatus("success")

      // Auto-reset after success
      setTimeout(() => {
        setQuery("")
        setResponse(null)
        setStatus("idle")
        setShowProcesses(false)
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
  }, [response, query, addNotification])

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
      case "processing":
        return <Cpu {...iconProps} className="h-5 w-5 animate-pulse text-purple-400" />
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
      case "processing":
        return "Running AI analysis..."
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

  /**
   * Get process status color
   */
  const getProcessStatusColor = (status: ProcessStatus) => {
    switch (status) {
      case "running":
        return "text-blue-400"
      case "completed":
        return "text-green-400"
      case "failed":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
      default:
        return "text-gray-400"
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
    <motion.section className="space-y-8" initial="hidden" animate="visible" variants={cardVariants}>
      {/* Header */}
      <motion.div
        className="text-center space-y-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold neon-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Advanced AI DeFi Agent
        </h1>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          Multi-layered AI analysis with real-time market intelligence, risk assessment, and intelligent execution planning.
        </p>
      </motion.div>

      {/* Main Card */}
      <Card className="glass-panel border-blue-500/30 shadow-2xl shadow-blue-500/10 max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-400" />
            <span>Advanced AI-Powered Command Interface</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Input
                placeholder="e.g., Swap 100 USDC for ETH on Ethereum at best rate"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                className="bg-gray-800/50 border-blue-500/30 focus:border-blue-400 text-white placeholder-gray-400 h-12 text-lg pr-12"
                disabled={status === "understanding" || status === "processing" || status === "executing"}
                aria-label="Natural language command input"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {query.length}/500
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSubmit}
                disabled={!query.trim() || status === "understanding" || status === "processing" || status === "executing"}
                className="neon-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border border-blue-400/50 shadow-lg shadow-blue-500/20 px-8 h-12"
              >
                {status === "understanding" || status === "processing" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                {status === "understanding" ? "Analyzing..." : status === "processing" ? "Processing..." : "Analyze"}
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
              animate={{ rotate: status === "understanding" || status === "processing" || status === "executing" ? 360 : 0 }}
              transition={{
                duration: 2,
                repeat: status === "understanding" || status === "processing" || status === "executing" ? Number.POSITIVE_INFINITY : 0,
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
                className="space-y-6"
              >
                {/* Tabs for different views */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
                    <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="processes" className="text-sm">AI Processes</TabsTrigger>
                    <TabsTrigger value="analysis" className="text-sm">Analysis</TabsTrigger>
                    <TabsTrigger value="execution" className="text-sm">Execution</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Confidence Score */}
                      <Card className="bg-blue-500/10 border-blue-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="h-5 w-5 text-blue-400" />
                            <span className="font-semibold text-blue-300">Confidence</span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {Math.round(response.confidence * 100)}%
                          </div>
                        </CardContent>
                      </Card>

                      {/* Risk Level */}
                      <Card className={`bg-${response.riskLevel === 'low' ? 'green' : response.riskLevel === 'medium' ? 'yellow' : 'red'}-500/10 border-${response.riskLevel === 'low' ? 'green' : response.riskLevel === 'medium' ? 'yellow' : 'red'}-500/30`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Shield className="h-5 w-5 text-gray-400" />
                            <span className="font-semibold text-gray-300">Risk Level</span>
                          </div>
                          <Badge variant={response.riskLevel === 'low' ? 'default' : response.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
                            {response.riskLevel.toUpperCase()}
                          </Badge>
                        </CardContent>
                      </Card>

                      {/* Success Probability */}
                      <Card className="bg-green-500/10 border-green-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                            <span className="font-semibold text-green-300">Success Rate</span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {Math.round((response.successProbability || 0) * 100)}%
                          </div>
                        </CardContent>
                      </Card>

                      {/* Security Score */}
                      <Card className="bg-purple-500/10 border-purple-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lock className="h-5 w-5 text-purple-400" />
                            <span className="font-semibold text-purple-300">Security</span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {response.securityScore || 95}/100
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Summary */}
                    <Card className="bg-gray-800/30 border-gray-700/50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-300 mb-3">Quick Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Intent:</span>
                            <span className="text-white">{response.intent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Estimated Gas:</span>
                            <span className="text-white">{response.estimatedGas || "Calculating..."}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Estimated Time:</span>
                            <span className="text-white">{response.estimatedTime || "Calculating..."}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* AI Processes Tab */}
                  <TabsContent value="processes" className="space-y-4">
                    <div className="space-y-4">
                      {response.processes.map((process, index) => (
                        <Card key={process.id} className="bg-gray-800/30 border-gray-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg bg-gray-700/50 ${getProcessStatusColor(process.status)}`}>
                                  {process.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white">{process.name}</h4>
                                  <p className="text-sm text-gray-400">{process.description}</p>
                                </div>
                              </div>
                              <Badge variant={process.status === 'completed' ? 'default' : process.status === 'running' ? 'secondary' : 'destructive'}>
                                {process.status}
                              </Badge>
                            </div>
                            
                            {process.status === 'running' && (
                              <Progress value={process.progress} className="mb-3" />
                            )}
                            
                            {process.result && (
                              <div className="mt-3 p-3 bg-gray-700/30 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Results:</h5>
                                <pre className="text-xs text-gray-400 overflow-x-auto">
                                  {JSON.stringify(process.result, null, 2)}
                                </pre>
                              </div>
                            )}
                            
                            {process.error && (
                              <Alert className="mt-3">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{process.error}</AlertDescription>
                              </Alert>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Analysis Tab */}
                  <TabsContent value="analysis" className="space-y-4">
                    <Card className="bg-gray-800/30 border-gray-700/50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-300 mb-3">AI Recommendations</h3>
                        <div className="space-y-2">
                          {response.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 border-gray-700/50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-300 mb-3">Parameters Extracted</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(response.parameters).map(([key, value]) => (
                            <div key={key} className="bg-gray-700/30 p-2 rounded">
                              <div className="text-xs text-gray-400 capitalize">{key}</div>
                              <div className="text-sm font-medium text-white">{String(value)}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Execution Tab */}
                  <TabsContent value="execution" className="space-y-4">
                    <Card className="bg-gray-800/30 border-gray-700/50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-300 mb-3">Execution Plan</h3>
                        <div className="space-y-3">
                          {response.executionPlan?.map((step, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                                {index + 1}
                              </div>
                              <span className="text-sm text-gray-300">{step}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

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
                            <Play className="h-4 w-4 mr-2" />
                            Execute Command
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-3">
              <HelpCircle className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-blue-300">Advanced Commands</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium text-gray-300">Complex Operations:</div>
                <div className="text-gray-400 space-y-1">
                  <div>• "Bridge 500 USDC from Ethereum to Polygon with gas optimization"</div>
                  <div>• "Swap 100 USDC for ETH on Ethereum with 0.5% slippage"</div>
                  <div>• "Analyze my portfolio and suggest rebalancing"</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-300">AI Analysis:</div>
                <div className="text-gray-400 space-y-1">
                  <div>• "Show me the best trading opportunities"</div>
                  <div>• "What's the optimal time to execute this trade?"</div>
                  <div>• "Compare gas fees across different networks"</div>
                </div>
              </div>
            </div>
          </motion.div>

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