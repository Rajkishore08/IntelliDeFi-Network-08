"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  Wallet, 
  TrendingDown, 
  PieChart, 
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react"
import { WalletCheckProcess } from "./WalletCheckProcess"
import { BalanceReductionProcess } from "./BalanceReductionProcess"
import { AssetManagementProcess } from "./AssetManagementProcess"

interface ProcessStep {
  id: string
  title: string
  description: string
  status: "pending" | "processing" | "completed" | "error"
  icon: any
  component: any
}

export function ProcessFlowDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentProcess, setCurrentProcess] = useState<string | null>(null)
  const [processHistory, setProcessHistory] = useState<string[]>([])

  const processSteps: ProcessStep[] = [
    {
      id: "wallet-check",
      title: "Wallet Check",
      description: "Verify wallet connection and permissions",
      status: "pending",
      icon: Wallet,
      component: WalletCheckProcess
    },
    {
      id: "balance-reduction",
      title: "Balance Reduction",
      description: "Process transaction and update balances",
      status: "pending",
      icon: TrendingDown,
      component: BalanceReductionProcess
    },
    {
      id: "asset-management",
      title: "Asset Management",
      description: "Update portfolio and asset allocations",
      status: "pending",
      icon: PieChart,
      component: AssetManagementProcess
    }
  ]

  const startProcess = (processId: string) => {
    setCurrentProcess(processId)
    setProcessHistory(prev => [...prev, processId])
  }

  const getProcessStatus = (processId: string) => {
    if (currentProcess === processId) return "processing"
    if (processHistory.includes(processId)) return "completed"
    return "pending"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 animate-spin text-blue-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500/30 bg-green-500/5"
      case "processing":
        return "border-blue-500/30 bg-blue-500/5"
      case "error":
        return "border-red-500/30 bg-red-500/5"
      default:
        return "border-gray-500/30 bg-gray-500/5"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-2"
        >
          <Brain className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-blue-300">AI Process Flow Dashboard</h1>
        </motion.div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Monitor and control the detailed execution steps of AI-powered DeFi operations.
          Each process shows real-time updates and detailed analytics.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Process Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Process Overview */}
          <Card className="glass-panel border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-400" />
                <span>AI Command Execution Flow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processSteps.map((step, index) => {
                  const status = getProcessStatus(step.id)
                  const Icon = step.icon
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${getStatusColor(status)} transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-6 w-6 text-blue-400" />
                          <div>
                            <h3 className="font-semibold text-white">{step.title}</h3>
                            <p className="text-sm text-gray-400">{step.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(status)}
                          <Badge 
                            variant={
                              status === "completed" ? "default" :
                              status === "processing" ? "secondary" :
                              "outline"
                            }
                          >
                            {status}
                          </Badge>
                          <Button
                            onClick={() => startProcess(step.id)}
                            disabled={status === "processing"}
                            size="sm"
                            variant="outline"
                          >
                            {status === "processing" ? "Running..." : "Start"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Process Flow Diagram */}
              <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
                <h4 className="font-semibold text-gray-300 mb-3">Process Flow</h4>
                <div className="flex items-center justify-center space-x-4">
                  {processSteps.map((step, index) => {
                    const status = getProcessStatus(step.id)
                    return (
                      <div key={step.id} className="flex items-center">
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                          status === "completed" ? "border-green-500 bg-green-500/20" :
                          status === "processing" ? "border-blue-500 bg-blue-500/20" :
                          "border-gray-500 bg-gray-500/20"
                        }`}>
                          {getStatusIcon(status)}
                        </div>
                        {index < processSteps.length - 1 && (
                          <div className="w-8 h-0.5 bg-gray-600 mx-2" />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  {processSteps.map((step) => (
                    <span key={step.id} className="text-center">
                      {step.title}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-panel border-green-500/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {processHistory.length}
                  </div>
                  <div className="text-sm text-gray-400">Processes Completed</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-blue-500/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {currentProcess ? 1 : 0}
                  </div>
                  <div className="text-sm text-gray-400">Currently Running</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-purple-500/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {processSteps.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Processes</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Detailed Process Views */}
          <AnimatePresence mode="wait">
            {currentProcess && (
              <motion.div
                key={currentProcess}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {processSteps.find(step => step.id === currentProcess)?.component()}
              </motion.div>
            )}
          </AnimatePresence>

          {!currentProcess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No Process Running
              </h3>
              <p className="text-gray-400">
                Select a process from the overview to see detailed execution steps.
              </p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 