"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TradeHistoryUpload } from "@/components/trade-analysis/trade-history-upload"
import { TradePerformanceAnalysis } from "@/components/trade-analysis/trade-performance-analysis"
import { OptimizationTips } from "@/components/trade-analysis/optimization-tips"
import { TraderComparison } from "@/components/trade-analysis/trader-comparison"
import { RealTimeFeedback } from "@/components/trade-analysis/real-time-feedback"
import { RiskAnalysis } from "@/components/trade-analysis/risk-analysis"
import { PerformanceDashboard } from "@/components/trade-analysis/performance-dashboard"
import { Brain, TrendingUp, Target, Users, AlertTriangle, Shield, BarChart3 } from "lucide-react"

export default function TradeAnalysisPanel() {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Trade Analysis</h1>
          <p className="text-muted-foreground">
            Analyze your trading performance with advanced AI insights
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Tips</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Compare</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <TradeHistoryUpload onAnalysisComplete={() => setActiveTab("analysis")} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <TradePerformanceAnalysis />
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <OptimizationTips />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <TraderComparison />
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <RealTimeFeedback />
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <RiskAnalysis />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
