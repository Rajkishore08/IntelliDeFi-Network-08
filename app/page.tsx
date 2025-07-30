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
import StrategyBuilder from "@/components/StrategyBuilder"
import CopyTradeGallery from "@/components/CopyTradeGallery"
import NFTGallery from "@/components/NFTGallery"
import NotificationsBar from "@/components/NotificationsBar"
import Footer from "@/components/Footer"
import TradeAnalysisPanel from "@/components/TradeAnalysisPanel"
import PortfolioDashboard from "@/components/PortfolioDashboard"
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
          {/* Main AI Command Interface */}
          <NaturalLanguageAgent />
          
          {/* AI Process Flow Dashboard */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">AI Process Flow</h2>
              <p className="text-gray-400">Real-time visualization of AI-powered transaction processes</p>
            </div>
            <ProcessFlowDashboard />
          </div>
          
          {/* Individual Process Components */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Wallet Check Process</h3>
              <WalletCheckProcess />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Balance Reduction Process</h3>
              <BalanceReductionProcess />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Asset Management Process</h3>
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
          <StrategyBuilder />
          <CopyTradeGallery />
        </div>
      ),
      portfolio: <PortfolioDashboard />,
      analysis: <TradeAnalysisPanel />,
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
