"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster } from "react-hot-toast"
import NavSidebar from "@/components/NavSidebar"
import NaturalLanguageAgent from "@/components/NaturalLanguageAgent"
import { ProcessFlowDashboard } from "@/components/ai-process-flow/ProcessFlowDashboard"
import { WalletCheckProcess } from "@/components/ai-process-flow/WalletCheckProcess"
import { BalanceReductionProcess } from "@/components/ai-process-flow/BalanceReductionProcess"
import { AssetManagementProcess } from "@/components/ai-process-flow/AssetManagementProcess"
import ConnectWallet from "@/components/ConnectWallet"
import CrossChainSwapPanel from "@/components/CrossChainSwapPanel"
import EnhancedSwapPanel from "@/components/EnhancedSwapPanel"
import FusionPlusPanel from "@/components/FusionPlusPanel"
import AdvancedLimitOrderProtocol from "@/components/AdvancedLimitOrderProtocol"
import StrategyBuilder from "@/components/StrategyBuilder"
import CopyTradeGallery from "@/components/CopyTradeGallery"
import NFTGallery from "@/components/NFTGallery"
import NotificationsBar from "@/components/NotificationsBar"
import Footer from "@/components/Footer"
import TradeAnalysisPanel from "@/components/TradeAnalysisPanel"
import PortfolioDashboard from "@/components/PortfolioDashboard"
import SecurityDashboard from "@/components/SecurityDashboard"
import GamificationHub from "@/components/GamificationHub"
import AITradingAssistant from "@/components/AITradingAssistant"
import AnalyticsDashboard from "@/components/AnalyticsDashboard"
import { WalletProvider } from "@/contexts/WalletContext"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { BarChart3, ArrowUpDown, Settings, Wallet, Trophy, Bot, Brain, Shield, Zap, TrendingUp, Cpu, Sparkles, Globe, Lock, Target, Users, Rocket, ExternalLink, Link } from "lucide-react"


const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
}

const pageTransition = {
  type: "tween" as const,
  ease: "anticipate" as const,
  duration: 0.5,
}

const features = [
  {
    icon: BarChart3,
    title: "Dashboard",
    description: "Overview & AI Agent",
    color: "from-blue-500 to-cyan-500",
    delay: 0.1
  },
  {
    icon: ArrowUpDown,
    title: "Swap",
    description: "Token Exchange & Fusion+",
    color: "from-green-500 to-emerald-500",
    delay: 0.2
  },
  {
    icon: Settings,
    title: "Strategies",
    description: "Advanced Orders & Copy Trading",
    color: "from-purple-500 to-pink-500",
    delay: 0.3
  },
  {
    icon: Wallet,
    title: "Portfolio",
    description: "Holdings & History",
    color: "from-orange-500 to-red-500",
    delay: 0.4
  },
  {
    icon: Brain,
    title: "Trade Analysis",
    description: "AI-Powered Performance Analysis",
    color: "from-indigo-500 to-purple-500",
    delay: 0.5
  },
  {
    icon: Shield,
    title: "Security",
    description: "Risk Management & Security",
    color: "from-red-500 to-pink-500",
    delay: 0.6
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Achievements & Rewards",
    color: "from-yellow-500 to-orange-500",
    delay: 0.7
  },
  {
    icon: Zap,
    title: "AI Assistant",
    description: "Advanced AI Trading",
    color: "from-cyan-500 to-blue-500",
    delay: 0.8
  },
  {
    icon: TrendingUp,
    title: "Analytics",
    description: "Advanced Analytics",
    color: "from-emerald-500 to-teal-500",
    delay: 0.9
  }
]

const integrations = [
  {
    name: "1inch Network",
    description: "Advanced DEX Aggregation & Fusion+ Protocol",
    features: [
      "Cross-chain token swaps",
      "Best route optimization",
      "Fusion+ gasless transactions",
      "Limit Order Protocol",
      "MEV protection"
    ],
    color: "from-orange-500 to-red-500",
    icon: "1",
    delay: 0.1
  },
  {
    name: "Etherlinks",
    description: "Cross-chain Infrastructure & Bridge Solutions",
    features: [
      "Multi-chain connectivity",
      "Secure bridge protocols",
      "LayerZero integration",
      "Sui blockchain support",
      "Real-time transaction monitoring"
    ],
    color: "from-blue-500 to-purple-500",
    icon: Link,
    delay: 0.2
  }
]

const integrationUsage = [
  {
    section: "Swap Interface",
    description: "1inch Fusion+ integration for seamless cross-chain swaps",
    features: ["Real-time quotes", "Best price routing", "Gasless transactions"]
  },
  {
    section: "Advanced Trading",
    description: "1inch Limit Order Protocol with AI-powered strategies",
    features: ["TWAP execution", "Options strategies", "Concentrated liquidity"]
  },
  {
    section: "Cross-Chain Bridge",
    description: "Etherlinks infrastructure for secure asset bridging",
    features: ["LayerZero messaging", "Sui integration", "Multi-chain support"]
  },
  {
    section: "Portfolio Management",
    description: "Etherlinks data feeds for real-time portfolio tracking",
    features: ["Multi-chain balances", "Transaction history", "Performance analytics"]
  },
  {
    section: "Security & Monitoring",
    description: "Etherlinks security protocols with 1inch validation",
    features: ["Risk assessment", "MEV protection", "Transaction monitoring"]
  },
  {
    section: "AI Trading Assistant",
    description: "AI-powered trading using 1inch routes and Etherlinks data",
    features: ["Intelligent routing", "Market analysis", "Automated execution"]
  }
]

export default function IntelliDeFiApp() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section)
    setSidebarOpen(false) // Close mobile sidebar when navigating
  }, [])

  const renderActiveSection = () => {
    const sectionComponents = {
      dashboard: (
        <div className="space-y-12">
          {/* Enhanced Hero Section */}
          <div className="text-center space-y-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Logo and Brand */}
              <div className="flex justify-center items-center space-x-4 mb-8">
                <div className="flex items-center justify-center h-24 w-24 rounded-full border-4 border-gradient-to-r from-blue-400 to-purple-500 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
                  <img src="/logo_eth_global.png" alt="IntelliDeFi Logo" className="h-20 w-20 object-contain" />
                </div>
                <div className="text-left">
                  <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    IntelliDeFi
                  </h1>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Network</h2>
                </div>
              </div>
              
              <p className="text-2xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed font-light">
                The Next Generation
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold"> AI-Powered Cross-Chain DeFi Platform</span>
              </p>
              <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Seamlessly swap, bridge, and trade across multiple blockchains with intelligent automation, 
                advanced security, and gamified rewards.
              </p>
            </motion.div>
            
            {/* Key Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">6+</div>
                <div className="text-gray-400">Blockchains</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">AI</div>
                <div className="text-gray-400">Powered Trading</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">1000+</div>
                <div className="text-gray-400">Tokens</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
                <div className="text-gray-400">Security</div>
              </div>
            </motion.div>
          </div>

          {/* Key Integrations Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Powered By Industry Leaders</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Built on the most advanced DeFi infrastructure with 1inch Network and Etherlinks
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: integration.delay }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                       style={{ background: `linear-gradient(45deg, var(--tw-gradient-stops))` }}
                       data-gradient={integration.color}></div>
                  <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group-hover:scale-105">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${integration.color} mb-6`}>
                      {typeof integration.icon === 'string' ? (
                        <span className="text-2xl font-bold text-white">{integration.icon}</span>
                      ) : (
                        <integration.icon className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">{integration.name}</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">{integration.description}</p>
                    <div className="space-y-2">
                      {integration.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Integration Usage Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Integration Usage</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See how 1inch Network and Etherlinks power every aspect of IntelliDeFi Network
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrationUsage.map((usage, index) => (
                <motion.div
                  key={usage.section}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                    <h3 className="text-lg font-semibold text-white mb-3">{usage.section}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{usage.description}</p>
                    <div className="space-y-2">
                      {usage.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-gray-300 text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Platform Features</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Discover the comprehensive suite of tools and features that make IntelliDeFi Network 
                the most advanced cross-chain DeFi platform
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                       style={{ background: `linear-gradient(45deg, var(--tw-gradient-stops))` }}
                       data-gradient={feature.color}></div>
                  <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group-hover:scale-105">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Command Interface */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">AI Trading Assistant</h2>
              <p className="text-gray-400">Interact with our advanced AI to execute trades and manage your portfolio</p>
            </motion.div>
            <NaturalLanguageAgent />
          </div>
          
          {/* AI Process Flow Dashboard */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Real-Time Process Flow</h2>
              <p className="text-gray-400">Live visualization of AI-powered transaction processes and security checks</p>
            </motion.div>
            <ProcessFlowDashboard />
          </div>


          
          {/* Individual Process Components */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Wallet Security Check</h3>
              <WalletCheckProcess />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Balance Management</h3>
              <BalanceReductionProcess />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Asset Optimization</h3>
              <AssetManagementProcess />
            </div>
          </div>
        </div>
      ),
      swap: (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Advanced Trading Suite</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Complete 1inch integration with Enhanced Swap, Fusion+ Cross-Chain, and Limit Order Protocol
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Enhanced Swap</h2>
              <p className="text-gray-400">Complete cross-chain swapping with real-time quotes and MetaMask integration</p>
              <EnhancedSwapPanel />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Fusion+ Cross-Chain</h2>
              <p className="text-gray-400">Advanced cross-chain swaps with hashlock and timelock security</p>
              <FusionPlusPanel />
            </div>
          </div>
        </div>
      ),
      strategies: (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Advanced Trading Strategies</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Extend 1inch Limit Order Protocol with AI-powered strategies, TWAP, options, and composable orders
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Advanced Limit Order Protocol</h2>
              <p className="text-gray-400">Extend 1inch Limit Order Protocol with TWAP, options, concentrated liquidity, and AI strategies</p>
              <AdvancedLimitOrderProtocol />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Strategy Builder</h2>
              <p className="text-gray-400">Create advanced trading strategies with limit orders, TWAP, stop-loss, and options</p>
              <StrategyBuilder />
            </div>
          </div>
          
          <CopyTradeGallery />
        </div>
      ),
      portfolio: <PortfolioDashboard />,
      analysis: <TradeAnalysisPanel />,
      security: <SecurityDashboard />,
      gamification: <GamificationHub />,
      "ai-assistant": <AITradingAssistant />,
      analytics: <AnalyticsDashboard />,
      "process-flow": (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">AI Process Flow</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real-time visualization of AI-powered transaction processes with detailed step-by-step analysis
            </p>
          </div>
          <ProcessFlowDashboard />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WalletCheckProcess />
            <BalanceReductionProcess />
            <AssetManagementProcess />
          </div>
        </div>
      ),
      nft: <NFTGallery />,
    }

    return sectionComponents[activeSection as keyof typeof sectionComponents] || sectionComponents.dashboard
  }

  return (
    <WalletProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 text-white font-poppins">
          <NavSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <div className="lg:ml-64 min-h-screen">
            <NotificationsBar />

            {/* Top Right Connect Wallet Button */}
            <div className="fixed top-4 right-4 z-40">
              <ConnectWallet />
            </div>

            <main className="p-4 md:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  {renderActiveSection()}
                </motion.div>
              </AnimatePresence>
            </main>

            <Footer />
          </div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          <Toaster
            position="top-right"
            toastOptions={{
              className: "glass-panel border-blue-500/30 text-white",
              style: {
                background: "rgba(17, 24, 39, 0.8)",
                backdropFilter: "blur(12px)",
              },
            }}
          />
        </div>
      </NotificationProvider>
    </WalletProvider>
  )
}
