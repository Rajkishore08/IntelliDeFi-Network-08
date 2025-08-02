"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { BarChart3, ArrowUpDown, Settings, Wallet, Trophy, Bot, Menu, X, ExternalLink, Brain, Cpu, Shield, Zap, TrendingUp, Image } from "lucide-react"

interface NavSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, description: "Overview & AI Agent" },
  { id: "swap", label: "Swap", icon: ArrowUpDown, description: "Token Exchange & Fusion+" },
  { id: "strategies", label: "Strategies", icon: Settings, description: "Advanced Orders & Copy Trading" },
  { id: "portfolio", label: "Portfolio", icon: Wallet, description: "Holdings & History" },
  { id: "analysis", label: "Trade Analysis", icon: Brain, description: "AI-Powered Performance Analysis" },
  { id: "security", label: "Security", icon: Shield, description: "Risk Management & Security" },
  { id: "gamification", label: "Gamification", icon: Trophy, description: "Achievements & Rewards" },
  { id: "ai-assistant", label: "AI Assistant", icon: Zap, description: "Advanced AI Trading" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, description: "Advanced Analytics" },
  { id: "process-flow", label: "AI Process Flow", icon: Cpu, description: "Real-time AI Process Visualization" },
  { id: "nft", label: "NFT Gallery", icon: Image, description: "IntelliDeFi NFT Collection" },
]

export default function NavSidebar({ activeSection, onSectionChange, sidebarOpen, setSidebarOpen }: NavSidebarProps) {
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="glass-panel border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-400"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-blue-500/30 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-blue-500/30">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center justify-center h-20 w-20 rounded-full border-2 border-blue-400 bg-gray-900 shadow-lg mb-1">
                <img src="/logo_eth_global.png" alt="Logo" className="h-16 w-16 object-contain" />
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-xl font-bold neon-text bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  IntelliDeFi
                </h1>
                <p className="text-xs text-gray-400">Network</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? "neon-border bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20"
                    : "hover:bg-gray-800/50 hover:border-blue-500/30 border border-transparent text-gray-300 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-gray-400 group-hover:text-gray-300">{item.description}</div>
                  )}
                </div>
              </button>
            ))}
          </nav>

          {/* Powered by 1inch */}
          <div className="p-4 border-t border-blue-500/30">
            <div className="flex items-center justify-between text-sm text-gray-400 hover:text-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">1</span>
                </div>
                <span>Powered by 1inch</span>
              </div>
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
