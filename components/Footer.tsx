"use client"

import { ExternalLink, Github, Twitter, Discord } from "lucide-react"

interface FooterProps {
  className?: string
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`bg-gray-900/50 backdrop-blur-xl border-t border-blue-500/30 p-6 mt-12 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              SwapScrolls
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The next generation cross-chain DeFi platform with AI-powered trading, secure bridging, and gamified rewards. 
              Seamlessly swap, bridge, and trade across multiple blockchains.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Discord className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-blue-300">Features</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>Cross-Chain Swapping</div>
              <div>AI-Powered Trading</div>
              <div>Gamified Rewards</div>
              <div>Advanced Security</div>
              <div>NFT Integration</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-blue-300">Powered By</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-400 hover:text-blue-300 transition-colors cursor-pointer">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">1</span>
              </div>
              <span>1inch Network</span>
              <ExternalLink className="h-3 w-3" />
            </div>
            <div className="text-xs text-gray-500">
              Leveraging 1inch Aggregation Protocol, Fusion+, and Limit Order Protocol
            </div>
            <div className="text-xs text-gray-500">
              LayerZero for cross-chain bridging
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-blue-300">Built For</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">
                <strong className="text-white">ETHGlobal Hackathon</strong>
              </p>
              <p className="text-xs text-gray-500">Cross-Chain DeFi Challenge</p>
              <div className="flex items-center space-x-2 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                <span>View Documentation</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-500/30 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-xs text-gray-500">© 2024 SwapScrolls. Built for ETHGlobal Hackathon.</div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="hover:text-blue-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-blue-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-blue-400 cursor-pointer">Documentation</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
