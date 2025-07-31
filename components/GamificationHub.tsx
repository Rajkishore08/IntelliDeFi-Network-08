"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  Star, 
  Crown, 
  Medal, 
  Award,
  Gift,
  Zap,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Sparkles,
  Gem,
  Diamond,
  Coins,
  Wallet,
  Globe,
  Network,
  Shield,
  Brain,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Gift as GiftIcon,
  Crown as CrownIcon,
  Star as StarIcon,
  Medal as MedalIcon
} from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { useNotification } from "@/contexts/NotificationContext"

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  category: "trading" | "social" | "exploration" | "security" | "innovation"
}

interface LeaderboardEntry {
  rank: number
  address: string
  username: string
  points: number
  level: number
  achievements: number
  totalVolume: number
  avatar?: string
}

interface Reward {
  id: string
  name: string
  description: string
  type: "token" | "nft" | "badge" | "feature"
  value: number
  claimed: boolean
  claimableAt?: string
  icon: React.ReactNode
}

interface UserStats {
  level: number
  experience: number
  experienceToNext: number
  totalPoints: number
  achievements: number
  totalVolume: number
  tradesCompleted: number
  chainsExplored: number
  daysActive: number
  rank: number
}

export default function GamificationHub() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    level: 15,
    experience: 7500,
    experienceToNext: 10000,
    totalPoints: 12500,
    achievements: 23,
    totalVolume: 45000,
    tradesCompleted: 156,
    chainsExplored: 4,
    daysActive: 45,
    rank: 8
  })
  const [activeTab, setActiveTab] = useState("achievements")

  const { isConnected, address } = useWallet()
  const { addNotification } = useNotification()

  // Mock achievements data
  useEffect(() => {
    const mockAchievements: Achievement[] = [
      {
        id: "1",
        name: "First Trade",
        description: "Complete your first swap",
        icon: <Target className="h-6 w-6" />,
        rarity: "common",
        points: 100,
        unlocked: true,
        unlockedAt: "2024-01-15",
        category: "trading"
      },
      {
        id: "2",
        name: "Cross-Chain Pioneer",
        description: "Complete swaps on 3 different chains",
        icon: <Globe className="h-6 w-6" />,
        rarity: "rare",
        points: 500,
        unlocked: true,
        unlockedAt: "2024-02-01",
        category: "exploration"
      },
      {
        id: "3",
        name: "Volume Master",
        description: "Trade $10,000+ in total volume",
        icon: <TrendingUp className="h-6 w-6" />,
        rarity: "epic",
        points: 1000,
        unlocked: true,
        unlockedAt: "2024-02-15",
        category: "trading"
      },
      {
        id: "4",
        name: "Security Expert",
        description: "Complete 10 security scans",
        icon: <Shield className="h-6 w-6" />,
        rarity: "rare",
        points: 750,
        unlocked: false,
        progress: 7,
        maxProgress: 10,
        category: "security"
      },
      {
        id: "5",
        name: "AI Trader",
        description: "Use AI commands for 50 trades",
        icon: <Brain className="h-6 w-6" />,
        rarity: "epic",
        points: 1500,
        unlocked: false,
        progress: 32,
        maxProgress: 50,
        category: "innovation"
      },
      {
        id: "6",
        name: "Legendary Trader",
        description: "Complete 1000 trades with 80%+ win rate",
        icon: <Crown className="h-6 w-6" />,
        rarity: "legendary",
        points: 5000,
        unlocked: false,
        progress: 156,
        maxProgress: 1000,
        category: "trading"
      }
    ]
    setAchievements(mockAchievements)
  }, [])

  // Mock leaderboard data
  useEffect(() => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        address: "0x1234...5678",
        username: "DeFiMaster",
        points: 25000,
        level: 25,
        achievements: 45,
        totalVolume: 150000
      },
      {
        rank: 2,
        address: "0x8765...4321",
        username: "CryptoWhale",
        points: 22000,
        level: 22,
        achievements: 38,
        totalVolume: 120000
      },
      {
        rank: 3,
        address: "0x9876...5432",
        username: "SmartTrader",
        points: 20000,
        level: 20,
        achievements: 35,
        totalVolume: 100000
      },
      {
        rank: 4,
        address: "0x5432...6789",
        username: "ChainHopper",
        points: 18000,
        level: 18,
        achievements: 32,
        totalVolume: 90000
      },
      {
        rank: 5,
        address: "0x6789...1234",
        username: "YieldHunter",
        points: 16000,
        level: 16,
        achievements: 28,
        totalVolume: 80000
      }
    ]
    setLeaderboard(mockLeaderboard)
  }, [])

  // Mock rewards data
  useEffect(() => {
    const mockRewards: Reward[] = [
      {
        id: "1",
        name: "Early Adopter NFT",
        description: "Exclusive NFT for early platform users",
        type: "nft",
        value: 1000,
        claimed: false,
        claimableAt: "2024-03-01",
        icon: <GiftIcon className="h-6 w-6" />
      },
      {
        id: "2",
        name: "Premium Features Access",
        description: "Unlock advanced trading features",
        type: "feature",
        value: 500,
        claimed: false,
        claimableAt: "2024-02-15",
        icon: <CrownIcon className="h-6 w-6" />
      },
      {
        id: "3",
        name: "100 USDC Bonus",
        description: "Token reward for reaching level 20",
        type: "token",
        value: 100,
        claimed: true,
        icon: <Coins className="h-6 w-6" />
      }
    ]
    setRewards(mockRewards)
  }, [])

  const claimReward = async (rewardId: string) => {
    addNotification({
      type: "success",
      message: "Reward claimed successfully!",
      duration: 3000,
    })
    
    setRewards(prev => prev.map(reward => 
      reward.id === rewardId 
        ? { ...reward, claimed: true }
        : reward
    ))
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "epic": return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "rare": return "bg-green-500/20 text-green-300 border-green-500/30"
      case "common": return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trading": return <Target className="h-4 w-4" />
      case "social": return <Users className="h-4 w-4" />
      case "exploration": return <Globe className="h-4 w-4" />
      case "security": return <Shield className="h-4 w-4" />
      case "innovation": return <Brain className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-400" />
          Gamification Hub
          <Sparkles className="h-6 w-6 text-purple-400" />
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Earn achievements, climb leaderboards, and unlock exclusive rewards through DeFi activities
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel border-yellow-500/30 shadow-xl shadow-yellow-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Crown className="h-4 w-4 text-yellow-400" />
              Level {userStats.level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {userStats.experience}/{userStats.experienceToNext} XP
            </div>
            <Progress value={(userStats.experience / userStats.experienceToNext) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-blue-400" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userStats.totalPoints.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-green-400" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userStats.achievements}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              Global Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              #{userStats.rank}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-gray-600 bg-gray-800/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-green-500/20' : 'bg-gray-600/20'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{achievement.name}</div>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{achievement.points} pts</div>
                    {achievement.unlocked && (
                      <div className="text-xs text-green-400">Unlocked</div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                
                {achievement.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress!) * 100} className="h-2" />
                  </div>
                )}

                {achievement.unlockedAt && (
                  <div className="text-xs text-gray-500 mt-2">
                    Unlocked: {achievement.unlockedAt}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="glass-panel border-blue-500/30 shadow-xl shadow-blue-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-400" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index === 0 ? 'border-yellow-500/30 bg-yellow-500/10' :
                      index === 1 ? 'border-gray-400/30 bg-gray-400/10' :
                      index === 2 ? 'border-orange-500/30 bg-orange-500/10' :
                      'border-gray-600 bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Crown className="h-5 w-5 text-yellow-400" />}
                        {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                        {index === 2 && <Award className="h-5 w-5 text-orange-400" />}
                        <span className="text-lg font-bold text-white">#{entry.rank}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{entry.username}</div>
                        <div className="text-sm text-gray-400">{entry.address}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{entry.points.toLocaleString()} pts</div>
                      <div className="text-sm text-gray-400">Level {entry.level}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-all ${
                  reward.claimed
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-blue-500/30 bg-blue-500/10'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      {reward.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{reward.name}</div>
                      <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                        {reward.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{reward.value} pts</div>
                    {reward.claimed && (
                      <div className="text-xs text-green-400">Claimed</div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">{reward.description}</p>
                
                {!reward.claimed && (
                  <Button
                    onClick={() => claimReward(reward.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Claim Reward
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel border-green-500/30 shadow-xl shadow-green-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Trading Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userStats.tradesCompleted}</div>
                    <div className="text-sm text-gray-400">Trades Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">${userStats.totalVolume.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Volume</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-purple-500/30 shadow-xl shadow-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-400" />
                  Exploration Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userStats.chainsExplored}</div>
                    <div className="text-sm text-gray-400">Chains Explored</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userStats.daysActive}</div>
                    <div className="text-sm text-gray-400">Days Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Connection Alert */}
      {!isConnected && (
        <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-yellow-300">Connect your wallet to track achievements and earn rewards</p>
        </div>
      )}
    </div>
  )
} 