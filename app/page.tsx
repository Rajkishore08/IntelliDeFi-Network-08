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
        <div className="space-y-8">
          <NaturalLanguageAgent />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <div className="glass-panel border-blue-500/30 p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4 text-blue-300">Welcome to IntelliDeFi Network</h2>
                <p className="text-gray-300 mb-4">
                  Your AI-powered DeFi platform for seamless trading, cross-chain operations, and advanced portfolio management.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h3 className="font-semibold text-blue-300 mb-2">Quick Actions</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Use AI commands to execute trades</li>
                      <li>• Access advanced swap features</li>
                      <li>• View your portfolio analytics</li>
                      <li>• Explore trading strategies</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h3 className="font-semibold text-green-300 mb-2">Platform Features</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Cross-chain bridging</li>
                      <li>• Limit order trading</li>
                      <li>• Copy trading strategies</li>
                      <li>• NFT gallery & rewards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-1">
              <div className="glass-panel border-purple-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-400">Last Trade</div>
                    <div className="text-white font-medium">Swap 100 USDC → ETH</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-400">Portfolio Value</div>
                    <div className="text-white font-medium">$12,450.25</div>
                    <div className="text-xs text-green-500">+5.2% today</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-400">Active Strategies</div>
                    <div className="text-white font-medium">3 running</div>
                    <div className="text-xs text-blue-400">2 profitable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
