"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster } from "react-hot-toast"
import NavSidebar from "@/components/NavSidebar"
import NaturalLanguageAgent from "@/components/NaturalLanguageAgent"
import SwapPanel from "@/components/SwapPanel"
import CrossChainSwapPanel from "@/components/CrossChainSwapPanel"
import StrategyBuilder from "@/components/StrategyBuilder"
import PortfolioDashboard from "@/components/PortfolioDashboard"
import CopyTradeGallery from "@/components/CopyTradeGallery"
import NFTGallery from "@/components/NFTGallery"
import NotificationsBar from "@/components/NotificationsBar"
import Footer from "@/components/Footer"
import TradeAnalysisPanel from "@/components/TradeAnalysisPanel"
import { ProcessFlowDashboard } from "@/components/ai-process-flow/ProcessFlowDashboard"
import { WalletProvider } from "@/contexts/WalletContext"
import { NotificationProvider } from "@/contexts/NotificationContext"

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
          {/* Hero Section with Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            {/* Logo Showcase */}
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
                className="relative"
              >
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                
                {/* Main logo container */}
                <div className="relative w-32 h-32 bg-gradient-to-br from-gray-900 via-blue-900/50 to-gray-900 rounded-full border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 flex items-center justify-center">
                  {/* Brain icon */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent"
            >
              INTELLIDEFI
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-2xl md:text-3xl font-bold text-gray-300"
            >
              NETWORK
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              The future of decentralized finance powered by artificial intelligence
            </motion.p>

            {/* Stage Lines */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex justify-center space-x-8 pt-8"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-400 font-medium">Cross-Chain</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-purple-400 font-medium">Secure</span>
              </div>
            </motion.div>
          </motion.div>

          {/* AI Agent Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <NaturalLanguageAgent />
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Quick Actions */}
            <div className="glass-panel border-blue-500/30 p-6 rounded-2xl hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-300">Quick Actions</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Use AI commands to execute trades</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Access advanced swap features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>View your portfolio analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Explore trading strategies</span>
                </li>
              </ul>
            </div>

            {/* Platform Features */}
            <div className="glass-panel border-green-500/30 p-6 rounded-2xl hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-300">Platform Features</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Cross-chain bridging</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Limit order trading</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Copy trading strategies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>NFT gallery & rewards</span>
                </li>
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel border-purple-500/30 p-6 rounded-2xl hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-purple-300">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="text-sm text-gray-400">Last Trade</div>
                  <div className="text-white font-medium">Swap 100 USDC → ETH</div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="text-sm text-gray-400">Portfolio Value</div>
                  <div className="text-white font-medium">$12,450.25</div>
                  <div className="text-xs text-green-500">+5.2% today</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="text-sm text-gray-400">Active Strategies</div>
                  <div className="text-white font-medium">3 running</div>
                  <div className="text-xs text-blue-400">2 profitable</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ),
      swap: (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <SwapPanel />
          <CrossChainSwapPanel />
        </div>
      ),
      strategies: (
        <div className="space-y-8">
          <StrategyBuilder />
          <CopyTradeGallery />
        </div>
      ),
      portfolio: <PortfolioDashboard />,
      analysis: (
        <div className="space-y-8">
          <TradeAnalysisPanel />
          <ProcessFlowDashboard />
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
