"use client"

import { ExternalLink } from "lucide-react"

interface FooterProps {
  className?: string
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`bg-gray-900/50 backdrop-blur-xl border-t border-blue-500/30 p-6 mt-12 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-lg neon-text bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              IntelliDeFi Network
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered, modular cross-chain DeFi trading platform built on 1inch protocols. Experience the future of
              decentralized finance with intelligent automation.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-blue-300">Powered By</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-400 hover:text-blue-300 transition-colors cursor-pointer">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">1</span>
              </div>
              <span>1inch Network</span>
              <ExternalLink className="h-3 w-3" />
            </div>
            <div className="text-xs text-gray-500">
              Leveraging 1inch Aggregation Protocol, Fusion+, and Limit Order Protocol
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-blue-300">Built By</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">
                <strong className="text-white">Raj Kishore S</strong> @ Unite DeFi
              </p>
              <p className="text-xs text-gray-500">ETHGlobal Hackathon 2024</p>
              <div className="flex items-center space-x-2 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                <span>View on GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-500/30 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-xs text-gray-500">© 2024 IntelliDeFi Network. Built for ETHGlobal Hackathon.</div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Documentation</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
