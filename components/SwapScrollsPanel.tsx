"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  ScrollText, 
  Zap, 
  Trophy, 
  Star,
  Coins,
  Network,
  Layers,
  Target,
  Brain,
  Shield,
  Clock,
  TrendingUp,
  ArrowUpDown,
  Plus,
  Minus,
  RefreshCw,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Crown,
  Gem,
  Sparkles,
  Globe,
  Gift,
  Award,
  Medal,
  Diamond,
  Crown as CrownIcon
} from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"

interface SwapScroll {
  id: string
  tokenId: number
  scrollType: "basic" | "advanced" | "legendary"
  owner: string
  swapCount: number
  totalVolume: number
  reputation: number
  rewardPoints: number
  level: number
  isBridgedToSui: boolean
  suiObjectId?: string
  createdAt: string
  lastSwapAt?: string
  achievements: Achievement[]
  crossChainSwaps: CrossChainSwap[]
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface CrossChainSwap {
  id: string
  fromChain: string
  toChain: string
  fromToken: string
  toToken: string
  amount: number
  price: number
  timestamp: string
  status: "pending" | "confirmed" | "executed" | "failed"
  bridgeFee: number
}

interface BridgeRequest {
  id: string
  ethereumTokenId: number
  suiDestination: string
  status: "pending" | "processing" | "completed" | "failed"
  timestamp: string
  estimatedCompletion: number
}

export default function SwapScrollsPanel() {
  const [swapScrolls, setSwapScrolls] = useState<SwapScroll[]>([])
  const [bridgeRequests, setBridgeRequests] = useState<BridgeRequest[]>([])
  const [selectedScroll, setSelectedScroll] = useState<SwapScroll | null>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [isBridging, setIsBridging] = useState(false)
  const [activeTab, setActiveTab] = useState("scrolls")
  const [mintForm, setMintForm] = useState({
    scrollType: "basic",
    metadata: ""
  })

  const { isConnected, address } = useWallet()
  const { addNotification } = useNotification()

  // Mock data for demonstration
  useEffect(() => {
    if (isConnected && address) {
      const mockScrolls: SwapScroll[] = [
        {
          id: "1",
          tokenId: 1,
          scrollType: "legendary",
          owner: address,
          swapCount: 25,
          totalVolume: 15000,
          reputation: 850,
          rewardPoints: 2500,
          level: 8,
          isBridgedToSui: true,
          suiObjectId: "0x1234567890abcdef",
          createdAt: "2024-01-15T10:30:00Z",
          lastSwapAt: "2024-01-25T14:20:00Z",
          achievements: [
            {
              id: "1",
              name: "First Swap",
              description: "Complete your first swap",
              icon: "🎯",
              unlocked: true,
              unlockedAt: "2024-01-15T11:00:00Z",
              rarity: "common"
            },
            {
              id: "2",
              name: "Cross-Chain Master",
              description: "Swap across 5 different chains",
              icon: "🌉",
              unlocked: true,
              unlockedAt: "2024-01-20T09:15:00Z",
              rarity: "rare"
            },
            {
              id: "3",
              name: "Volume Legend",
              description: "Trade over $50,000 in volume",
              icon: "💎",
              unlocked: true,
              unlockedAt: "2024-01-25T16:45:00Z",
              rarity: "legendary"
            }
          ],
          crossChainSwaps: [
            {
              id: "1",
              fromChain: "Ethereum",
              toChain: "Polygon",
              fromToken: "ETH",
              toToken: "MATIC",
              amount: 2.5,
              price: 1800,
              timestamp: "2024-01-20T10:30:00Z",
              status: "executed",
              bridgeFee: 0.001
            }
          ]
        },
        {
          id: "2",
          tokenId: 2,
          scrollType: "advanced",
          owner: address,
          swapCount: 12,
          totalVolume: 8000,
          reputation: 450,
          rewardPoints: 1200,
          level: 4,
          isBridgedToSui: false,
          createdAt: "2024-01-18T15:45:00Z",
          lastSwapAt: "2024-01-24T12:10:00Z",
          achievements: [
            {
              id: "1",
              name: "First Swap",
              description: "Complete your first swap",
              icon: "🎯",
              unlocked: true,
              unlockedAt: "2024-01-18T16:00:00Z",
              rarity: "common"
            }
          ],
          crossChainSwaps: []
        }
      ]
      setSwapScrolls(mockScrolls)
    }
  }, [isConnected, address])

  const mintSwapScroll = useCallback(async () => {
    if (!isConnected || !address) {
      addNotification({
        type: "error",
        message: "Please connect your wallet to mint a SwapScroll",
        duration: 3000,
      })
      return
    }

    setIsMinting(true)

    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newScroll: SwapScroll = {
        id: Date.now().toString(),
        tokenId: swapScrolls.length + 1,
        scrollType: mintForm.scrollType as any,
        owner: address,
        swapCount: 0,
        totalVolume: 0,
        reputation: 100,
        rewardPoints: 0,
        level: 1,
        isBridgedToSui: false,
        createdAt: new Date().toISOString(),
        achievements: [],
        crossChainSwaps: []
      }

      setSwapScrolls(prev => [newScroll, ...prev])
      setMintForm({ scrollType: "basic", metadata: "" })

      addNotification({
        type: "success",
        message: `SwapScroll ${mintForm.scrollType} NFT minted successfully!`,
        duration: 5000,
      })
    } catch (error) {
      console.error('Error minting SwapScroll:', error)
      addNotification({
        type: "error",
        message: "Failed to mint SwapScroll",
        duration: 5000,
      })
    } finally {
      setIsMinting(false)
    }
  }, [mintForm, swapScrolls.length, isConnected, address, addNotification])

  const bridgeToSui = useCallback(async (tokenId: number) => {
    if (!isConnected || !address) {
      addNotification({
        type: "error",
        message: "Please connect your wallet to bridge to Sui",
        duration: 3000,
      })
      return
    }

    setIsBridging(true)

    try {
      // Simulate bridge request
      await new Promise(resolve => setTimeout(resolve, 3000))

      const newRequest: BridgeRequest = {
        id: Date.now().toString(),
        ethereumTokenId: tokenId,
        suiDestination: "0x" + Math.random().toString(16).substr(2, 64),
        status: "processing",
        timestamp: new Date().toISOString(),
        estimatedCompletion: Date.now() + 5 * 60 * 1000 // 5 minutes
      }

      setBridgeRequests(prev => [newRequest, ...prev])

      // Update scroll to show it's being bridged
      setSwapScrolls(prev => prev.map(scroll => 
        scroll.tokenId === tokenId 
          ? { ...scroll, isBridgedToSui: true, suiObjectId: "0x" + Math.random().toString(16).substr(2, 64) }
          : scroll
      ))

      addNotification({
        type: "success",
        message: "SwapScroll bridged to Sui successfully!",
        duration: 5000,
      })
    } catch (error) {
      console.error('Error bridging to Sui:', error)
      addNotification({
        type: "error",
        message: "Failed to bridge to Sui",
        duration: 5000,
      })
    } finally {
      setIsBridging(false)
    }
  }, [isConnected, address, addNotification])

  const getScrollTypeColor = (type: string) => {
    switch (type) {
      case "legendary": return "text-yellow-400 border-yellow-400"
      case "advanced": return "text-purple-400 border-purple-400"
      case "basic": return "text-blue-400 border-blue-400"
      default: return "text-gray-400 border-gray-400"
    }
  }

  const getScrollTypeIcon = (type: string) => {
    switch (type) {
      case "legendary": return <Crown className="h-4 w-4" />
      case "advanced": return <Gem className="h-4 w-4" />
      case "basic": return <Star className="h-4 w-4" />
      default: return <ScrollText className="h-4 w-4" />
    }
  }

  const getAchievementRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-yellow-400 bg-yellow-400/10"
      case "epic": return "text-purple-400 bg-purple-400/10"
      case "rare": return "text-blue-400 bg-blue-400/10"
      case "common": return "text-gray-400 bg-gray-400/10"
      default: return "text-gray-400 bg-gray-400/10"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <ScrollText className="h-8 w-8 text-purple-400" />
          SwapScrolls
          <Sparkles className="h-6 w-6 text-yellow-400" />
        </h1>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Cross-chain, NFT-based, gamified DeFi app built on top of 1inch Fusion+ with LayerZero and Sui integration.
          Mint tradable "Swap Scrolls", perform gasless swaps, and earn gamified rewards.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scrolls" className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            My Scrolls
          </TabsTrigger>
          <TabsTrigger value="mint" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Mint Scroll
          </TabsTrigger>
          <TabsTrigger value="bridge" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Bridge to Sui
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Rewards
          </TabsTrigger>
        </TabsList>

        {/* My Scrolls Tab */}
        <TabsContent value="scrolls" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {swapScrolls.map((scroll) => (
              <motion.div
                key={scroll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10 hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getScrollTypeIcon(scroll.scrollType)}
                        <span className="capitalize">{scroll.scrollType}</span>
                        <Badge variant="outline" className={getScrollTypeColor(scroll.scrollType)}>
                          #{scroll.tokenId}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <CrownIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-semibold">Lv.{scroll.level}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-2 bg-gray-800/30 rounded-lg">
                        <div className="text-gray-400">Swaps</div>
                        <div className="text-white font-semibold">{scroll.swapCount}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-800/30 rounded-lg">
                        <div className="text-gray-400">Volume</div>
                        <div className="text-white font-semibold">${scroll.totalVolume.toLocaleString()}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-800/30 rounded-lg">
                        <div className="text-gray-400">Reputation</div>
                        <div className="text-white font-semibold">{scroll.reputation}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-800/30 rounded-lg">
                        <div className="text-gray-400">Points</div>
                        <div className="text-white font-semibold">{scroll.rewardPoints}</div>
                      </div>
                    </div>

                    {/* Cross-chain Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Cross-chain:</span>
                      <Badge 
                        variant={scroll.isBridgedToSui ? "default" : "secondary"}
                        className={scroll.isBridgedToSui ? "bg-green-500/20 text-green-400" : ""}
                      >
                        {scroll.isBridgedToSui ? (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Sui
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Network className="h-3 w-3" />
                            Ethereum
                          </div>
                        )}
                      </Badge>
                    </div>

                    {/* Achievements */}
                    {scroll.achievements.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-white">Achievements</div>
                        <div className="flex flex-wrap gap-1">
                          {scroll.achievements.slice(0, 3).map((achievement) => (
                            <Badge
                              key={achievement.id}
                              variant="outline"
                              className={`text-xs ${getAchievementRarityColor(achievement.rarity)}`}
                            >
                              {achievement.icon} {achievement.name}
                            </Badge>
                          ))}
                          {scroll.achievements.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{scroll.achievements.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => setSelectedScroll(scroll)}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Use Scroll
                      </Button>
                      {!scroll.isBridgedToSui && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => bridgeToSui(scroll.tokenId)}
                          disabled={isBridging}
                        >
                          {isBridging ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Mint Scroll Tab */}
        <TabsContent value="mint" className="space-y-6">
          <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-400" />
                Mint New SwapScroll
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: "basic", name: "Basic Scroll", description: "Perfect for beginners", price: "0.01 ETH", icon: <Star className="h-6 w-6" /> },
                  { type: "advanced", name: "Advanced Scroll", description: "Enhanced features", price: "0.05 ETH", icon: <Gem className="h-6 w-6" /> },
                  { type: "legendary", name: "Legendary Scroll", description: "Ultimate power", price: "0.1 ETH", icon: <Crown className="h-6 w-6" /> }
                ].map((option) => (
                  <div
                    key={option.type}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      mintForm.scrollType === option.type
                        ? 'border-blue-400 bg-blue-500/10'
                        : 'border-gray-600 hover:border-blue-400/50'
                    }`}
                    onClick={() => setMintForm(prev => ({ ...prev, scrollType: option.type }))}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span className="font-semibold text-white">{option.name}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{option.description}</p>
                    <div className="text-sm text-blue-400 font-semibold">{option.price}</div>
                  </div>
                ))}
              </div>

              <Button
                onClick={mintSwapScroll}
                disabled={isMinting || !isConnected}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isMinting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Mint {mintForm.scrollType} SwapScroll
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bridge Tab */}
        <TabsContent value="bridge" className="space-y-6">
          <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-green-400" />
                Bridge to Sui
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Available Scrolls</h3>
                  <div className="space-y-2">
                    {swapScrolls.filter(scroll => !scroll.isBridgedToSui).map((scroll) => (
                      <div key={scroll.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getScrollTypeIcon(scroll.scrollType)}
                          <div>
                            <div className="font-semibold text-white">#{scroll.tokenId}</div>
                            <div className="text-sm text-gray-400 capitalize">{scroll.scrollType}</div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => bridgeToSui(scroll.tokenId)}
                          disabled={isBridging}
                        >
                          {isBridging ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                          Bridge
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Bridge Requests</h3>
                  <div className="space-y-2">
                    {bridgeRequests.map((request) => (
                      <div key={request.id} className="p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Token #{request.ethereumTokenId}</span>
                          <Badge 
                            variant="outline" 
                            className={
                              request.status === "completed" ? "border-green-400 text-green-300" :
                              request.status === "processing" ? "border-yellow-400 text-yellow-300" :
                              "border-red-400 text-red-300"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          Destination: {request.suiDestination.slice(0, 10)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Stats */}
            <Card className="glass-panel border-yellow-500/30 shadow-xl shadow-yellow-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Total Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {swapScrolls.reduce((sum, scroll) => sum + scroll.rewardPoints, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {swapScrolls.reduce((sum, scroll) => sum + scroll.reputation, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total Reputation</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {swapScrolls.reduce((sum, scroll) => sum + scroll.totalVolume, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Volume ($)</div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {swapScrolls.flatMap(scroll => scroll.achievements).slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-2 p-2 bg-gray-800/30 rounded">
                      <span className="text-lg">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{achievement.name}</div>
                        <div className="text-xs text-gray-400">{achievement.description}</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getAchievementRarityColor(achievement.rarity)}`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cross-chain Stats */}
            <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Cross-chain Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {swapScrolls.filter(scroll => scroll.isBridgedToSui).length}
                    </div>
                    <div className="text-sm text-gray-400">Bridged to Sui</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {swapScrolls.reduce((sum, scroll) => sum + scroll.crossChainSwaps.length, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Cross-chain Swaps</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Connection Alert */}
      {!isConnected && (
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to use SwapScrolls
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 