"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye, 
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Brain,
  Database,
  Network,
  Coins,
  Wallet,
  Key,
  Clock,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
  Info,
  Settings,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Server
} from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"

interface SecurityRisk {
  id: string
  name: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  impact: string
  recommendation: string
  status: "active" | "resolved" | "monitoring"
  lastUpdated: string
  riskScore: number
}

interface SecurityMetric {
  name: string
  value: number
  maxValue: number
  trend: "up" | "down" | "stable"
  color: string
  icon: React.ReactNode
}

interface PortfolioRisk {
  totalRisk: number
  marketRisk: number
  liquidityRisk: number
  smartContractRisk: number
  counterpartyRisk: number
  regulatoryRisk: number
}

export default function SecurityDashboard() {
  const [securityRisks, setSecurityRisks] = useState<SecurityRisk[]>([])
  const [portfolioRisk, setPortfolioRisk] = useState<PortfolioRisk>({
    totalRisk: 65,
    marketRisk: 45,
    liquidityRisk: 30,
    smartContractRisk: 25,
    counterpartyRisk: 20,
    regulatoryRisk: 15
  })
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState<string>("")

  const { isConnected, address } = useWallet()
  const { addNotification } = useNotification()

  // Mock security risks data
  useEffect(() => {
    const mockRisks: SecurityRisk[] = [
      {
        id: "1",
        name: "High Smart Contract Exposure",
        severity: "high",
        description: "Your portfolio has significant exposure to unaudited smart contracts",
        impact: "Potential loss of funds due to contract vulnerabilities",
        recommendation: "Diversify into audited protocols and reduce exposure to unaudited contracts",
        status: "active",
        lastUpdated: "2 hours ago",
        riskScore: 85
      },
      {
        id: "2",
        name: "Concentration Risk",
        severity: "medium",
        description: "Over 60% of your portfolio is concentrated in DeFi tokens",
        impact: "High volatility and correlation risk",
        recommendation: "Consider diversifying into stablecoins and traditional assets",
        status: "monitoring",
        lastUpdated: "1 day ago",
        riskScore: 65
      },
      {
        id: "3",
        name: "Liquidity Risk",
        severity: "low",
        description: "Some positions may be difficult to exit quickly",
        impact: "Potential slippage and delayed exits",
        recommendation: "Maintain adequate liquidity buffers and use limit orders",
        status: "active",
        lastUpdated: "3 hours ago",
        riskScore: 45
      }
    ]
    setSecurityRisks(mockRisks)
  }, [])

  // Mock security metrics
  useEffect(() => {
    const mockMetrics: SecurityMetric[] = [
      {
        name: "Portfolio Security Score",
        value: 75,
        maxValue: 100,
        trend: "up",
        color: "text-green-400",
        icon: <Shield className="h-5 w-5" />
      },
      {
        name: "Smart Contract Audit Coverage",
        value: 85,
        maxValue: 100,
        trend: "stable",
        color: "text-blue-400",
        icon: <CheckCircle className="h-5 w-5" />
      },
      {
        name: "Liquidity Coverage",
        value: 60,
        maxValue: 100,
        trend: "down",
        color: "text-yellow-400",
        icon: <Coins className="h-5 w-5" />
      },
      {
        name: "Diversification Score",
        value: 70,
        maxValue: 100,
        trend: "up",
        color: "text-purple-400",
        icon: <PieChart className="h-5 w-5" />
      }
    ]
    setSecurityMetrics(mockMetrics)
  }, [])

  const runSecurityScan = async () => {
    if (!isConnected) {
      addNotification({
        type: "error",
        message: "Please connect your wallet to run security scan",
        duration: 3000,
      })
      return
    }

    setIsScanning(true)
    addNotification({
      type: "info",
      message: "Running comprehensive security scan...",
      duration: 2000,
    })

    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 3000))

    setLastScan(new Date().toLocaleString())
    setIsScanning(false)
    addNotification({
      type: "success",
      message: "Security scan completed! New risks detected.",
      duration: 5000,
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "Critical"
    if (score >= 60) return "High"
    if (score >= 40) return "Medium"
    return "Low"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-blue-400" />
          Security Dashboard
          <Lock className="h-6 w-6 text-green-400" />
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Comprehensive DeFi security monitoring, risk assessment, and threat detection
        </p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric) => (
          <Card key={metric.name} className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{metric.name}</span>
                <div className={`flex items-center gap-1 ${metric.color}`}>
                  {metric.icon}
                  {metric.trend === "up" && <TrendingUp className="h-3 w-3" />}
                  {metric.trend === "down" && <TrendingDown className="h-3 w-3" />}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">
                {metric.value}/{metric.maxValue}
              </div>
              <Progress value={(metric.value / metric.maxValue) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              Portfolio Risk Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Risk Score</span>
                <Badge variant="outline" className="border-red-500/50 text-red-300">
                  {portfolioRisk.totalRisk}/100
                </Badge>
              </div>
              <Progress value={portfolioRisk.totalRisk} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Market Risk</span>
                <span className="text-sm text-orange-400">{portfolioRisk.marketRisk}%</span>
              </div>
              <Progress value={portfolioRisk.marketRisk} className="h-2 bg-orange-500/20" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Liquidity Risk</span>
                <span className="text-sm text-yellow-400">{portfolioRisk.liquidityRisk}%</span>
              </div>
              <Progress value={portfolioRisk.liquidityRisk} className="h-2 bg-yellow-500/20" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Smart Contract Risk</span>
                <span className="text-sm text-green-400">{portfolioRisk.smartContractRisk}%</span>
              </div>
              <Progress value={portfolioRisk.smartContractRisk} className="h-2 bg-green-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Security Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runSecurityScan}
              disabled={isScanning}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isScanning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              {isScanning ? "Scanning..." : "Run Security Scan"}
            </Button>

            {lastScan && (
              <div className="text-sm text-gray-400">
                Last scan: {lastScan}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Wallet connection secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Smart contract interactions verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span>2 security recommendations pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Risks */}
      <Card className="glass-panel border-red-500/30 shadow-xl shadow-red-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Active Security Risks ({securityRisks.filter(r => r.status === "active").length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityRisks.map((risk) => (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/30 rounded-lg border border-gray-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(risk.severity)}>
                      {risk.severity.toUpperCase()}
                    </Badge>
                    <div>
                      <div className="font-semibold text-white">{risk.name}</div>
                      <div className="text-sm text-gray-400">
                        Risk Score: {risk.riskScore}/100 ({getRiskLevel(risk.riskScore)})
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{risk.lastUpdated}</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Description:</span>
                    <span className="text-white ml-2">{risk.description}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Impact:</span>
                    <span className="text-red-300 ml-2">{risk.impact}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Recommendation:</span>
                    <span className="text-green-300 ml-2">{risk.recommendation}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-300">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="border-green-500/50 text-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark Resolved
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-400" />
              AI Threat Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Advanced AI algorithms monitor for suspicious patterns and potential threats
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Real-time monitoring active</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Pattern recognition enabled</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Anomaly detection running</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-400" />
              Smart Contract Audit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Continuous monitoring of smart contract interactions and vulnerabilities
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>85% of contracts audited</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span>3 unaudited contracts detected</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Vulnerability scanning active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-green-400" />
              Network Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Multi-chain security monitoring and cross-chain threat detection
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>6 chains monitored</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Cross-chain validation active</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Bridge security verified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Alert */}
      {!isConnected && (
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect your wallet to enable full security monitoring and risk assessment
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 