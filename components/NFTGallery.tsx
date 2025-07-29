"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock, CheckCircle } from "lucide-react"

interface NFTGalleryProps {
  className?: string
}

interface NFTBadge {
  id: string
  name: string
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
  earned: boolean
  earnedDate?: string
  requirement: string
  progress?: number
  maxProgress?: number
  category: "trading" | "social" | "achievement" | "milestone"
}

export default function NFTGallery({ className = "" }: NFTGalleryProps) {
  const [selectedBadge, setSelectedBadge] = useState<NFTBadge | null>(null)

  const badges: NFTBadge[] = [
    {
      id: "1",
      name: "First Swap",
      description: "Completed your first token swap on IntelliDeFi",
      rarity: "common",
      earned: true,
      earnedDate: "2024-01-15",
      requirement: "Complete 1 swap",
      category: "trading",
    },
    {
      id: "2",
      name: "Cross-Chain Master",
      description: "Successfully bridged assets across different blockchains",
      rarity: "rare",
      earned: true,
      earnedDate: "2024-01-20",
      requirement: "Complete 5 cross-chain bridges",
      category: "trading",
    },
    {
      id: "3",
      name: "Strategy Creator",
      description: "Created and deployed your first trading strategy",
      rarity: "epic",
      earned: false,
      requirement: "Create 1 trading strategy",
      progress: 0,
      maxProgress: 1,
      category: "achievement",
    },
    {
      id: "4",
      name: "Volume Trader",
      description: "Traded over $100,000 in total volume",
      rarity: "legendary",
      earned: false,
      requirement: "Trade $100,000 volume",
      progress: 45000,
      maxProgress: 100000,
      category: "milestone",
    },
    {
      id: "5",
      name: "Social Butterfly",
      description: "Followed 10 other traders and copied 3 strategies",
      rarity: "rare",
      earned: true,
      earnedDate: "2024-01-25",
      requirement: "Follow 10 traders, copy 3 strategies",
      category: "social",
    },
    {
      id: "6",
      name: "Diamond Hands",
      description: "Held a position for over 30 days without selling",
      rarity: "epic",
      earned: false,
      requirement: "Hold position for 30+ days",
      progress: 12,
      maxProgress: 30,
      category: "achievement",
    },
    {
      id: "7",
      name: "AI Whisperer",
      description: "Used natural language commands 100 times",
      rarity: "rare",
      earned: false,
      requirement: "Use AI agent 100 times",
      progress: 67,
      maxProgress: 100,
      category: "achievement",
    },
    {
      id: "8",
      name: "DeFi Pioneer",
      description: "One of the first 1000 users on IntelliDeFi Network",
      rarity: "legendary",
      earned: true,
      earnedDate: "2024-01-10",
      requirement: "Be among first 1000 users",
      category: "milestone",
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400/50 text-gray-400 bg-gray-400/10"
      case "rare":
        return "border-blue-400/50 text-blue-400 bg-blue-400/10"
      case "epic":
        return "border-purple-400/50 text-purple-400 bg-purple-400/10"
      case "legendary":
        return "border-yellow-400/50 text-yellow-400 bg-yellow-400/10"
      default:
        return "border-gray-400/50 text-gray-400 bg-gray-400/10"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trading":
        return "💱"
      case "social":
        return "👥"
      case "achievement":
        return "🏆"
      case "milestone":
        return "🎯"
      default:
        return "⭐"
    }
  }

  const earnedBadges = badges.filter((badge) => badge.earned)
  const unearnedBadges = badges.filter((badge) => !badge.earned)

  return (
    <div className={`space-y-6 animate-slide-up ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-panel border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{earnedBadges.length}</div>
            <div className="text-sm text-gray-400">Earned</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{badges.length}</div>
            <div className="text-sm text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {earnedBadges.filter((b) => b.rarity === "legendary").length}
            </div>
            <div className="text-sm text-gray-400">Legendary</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-blue-500/30 shadow-lg shadow-blue-500/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round((earnedBadges.length / badges.length) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Complete</div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Badges */}
      <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-blue-400" />
            <span>Earned Badges</span>
            <Badge variant="outline" className="border-green-400/50 text-green-400">
              {earnedBadges.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 animate-fade-in ${getRarityColor(badge.rarity)} hover:shadow-lg`}
              >
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>

                <div className="text-center space-y-3">
                  <div className="text-3xl">{getCategoryIcon(badge.category)}</div>
                  <div>
                    <h3 className="font-medium text-white text-sm">{badge.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{badge.description}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity.toUpperCase()}
                  </Badge>
                  {badge.earnedDate && <div className="text-xs text-gray-500">Earned {badge.earnedDate}</div>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unearned Badges */}
      <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-gray-400" />
            <span>Locked Badges</span>
            <Badge variant="outline" className="border-gray-400/50 text-gray-400">
              {unearnedBadges.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {unearnedBadges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className="relative p-4 rounded-lg border border-gray-600/30 bg-gray-800/20 cursor-pointer transition-all duration-200 hover:border-gray-500/50 hover:bg-gray-800/30 opacity-75 hover:opacity-90"
              >
                <div className="absolute top-2 right-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>

                <div className="text-center space-y-3">
                  <div className="text-3xl grayscale">{getCategoryIcon(badge.category)}</div>
                  <div>
                    <h3 className="font-medium text-gray-300 text-sm">{badge.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{badge.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-500/50 text-gray-500">
                    {badge.rarity.toUpperCase()}
                  </Badge>

                  {badge.progress !== undefined && badge.maxProgress && (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-400">
                        {badge.progress} / {badge.maxProgress}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glass-panel border-blue-500/30 shadow-2xl shadow-blue-500/20 max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(selectedBadge.category)}</span>
                  <span>{selectedBadge.name}</span>
                </CardTitle>
                <button onClick={() => setSelectedBadge(null)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`${getRarityColor(selectedBadge.rarity)}`}>
                  {selectedBadge.rarity.toUpperCase()}
                </Badge>
                {selectedBadge.earned ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Earned</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Locked</span>
                  </div>
                )}
              </div>

              <p className="text-gray-300">{selectedBadge.description}</p>

              <div className="space-y-2">
                <h4 className="font-medium text-white">Requirement:</h4>
                <p className="text-sm text-gray-400">{selectedBadge.requirement}</p>
              </div>

              {selectedBadge.progress !== undefined && selectedBadge.maxProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      {selectedBadge.progress} / {selectedBadge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 text-center">
                    {Math.round((selectedBadge.progress / selectedBadge.maxProgress) * 100)}% Complete
                  </div>
                </div>
              )}

              {selectedBadge.earnedDate && (
                <div className="text-sm text-gray-400">Earned on {selectedBadge.earnedDate}</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
