// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
/**
 * @title RewardSystem
 * @dev Gamified reward system for SwapScrolls
 * Handles points, achievements, and reputation tracking
 */
contract RewardSystem is Ownable, Pausable, ReentrancyGuard {
    // Structs
    struct Achievement {
        uint256 id;
        string name;
        string description;
        uint256 pointsReward;
        uint256 reputationReward;
        bool isActive;
        uint256 requiredSwaps;
        uint256 requiredVolume;
        uint256 requiredChains;
    }
    
    struct UserRewards {
        uint256 totalPoints;
        uint256 totalReputation;
        uint256 level;
        uint256 achievementsUnlocked;
        uint256 lastRewardTime;
        mapping(uint256 => bool) unlockedAchievements;
        mapping(string => uint256) activityStats;
    }
    
    struct RewardTier {
        uint256 tierId;
        string name;
        uint256 minPoints;
        uint256 minReputation;
        uint256 bonusMultiplier;
        bool isActive;
    }
    
    // State variables
    mapping(address => UserRewards) public userRewards;
    mapping(uint256 => Achievement) public achievements;
    mapping(uint256 => RewardTier) public rewardTiers;
    
    uint256 private _achievementIdCounter;
    uint256 private _tierIdCounter;
    
    // Reward tokens
    IERC20 public rewardToken;
    
    // Constants
    uint256 public constant BASE_POINTS_PER_SWAP = 10;
    uint256 public constant BASE_REPUTATION_PER_SWAP = 1;
    uint256 public constant CROSS_CHAIN_BONUS = 25;
    uint256 public constant VOLUME_BONUS_THRESHOLD = 1000 ether;
    uint256 public constant LEVEL_UP_THRESHOLD = 100;
    
    // Events
    event AchievementUnlocked(address indexed user, uint256 achievementId, string achievementName);
    event PointsEarned(address indexed user, uint256 points, string reason);
    event ReputationEarned(address indexed user, uint256 reputation, string reason);
    event LevelUp(address indexed user, uint256 newLevel);
    event TierUpgraded(address indexed user, uint256 newTier);
    event RewardClaimed(address indexed user, uint256 amount);
    
    // Modifiers
    modifier onlyValidAchievement(uint256 achievementId) {
        require(achievements[achievementId].id != 0, "Invalid achievement");
        _;
    }
    
    modifier onlyValidTier(uint256 tierId) {
        require(rewardTiers[tierId].tierId != 0, "Invalid tier");
        _;
    }
    
    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
        _achievementIdCounter = 1;
        _tierIdCounter = 1;
        _initializeAchievements();
        _initializeRewardTiers();
    }
    
    /**
     * @dev Award points and reputation for a swap
     * @param user User address
     * @param swapAmount Swap amount
     * @param isCrossChain Whether it's a cross-chain swap
     * @param chainCount Number of chains involved
     */
    function awardSwapRewards(
        address user,
        uint256 swapAmount,
        bool isCrossChain,
        uint256 chainCount
    ) external whenNotPaused {
        UserRewards storage rewards = userRewards[user];
        
        // Base points for swap
        uint256 basePoints = BASE_POINTS_PER_SWAP;
        uint256 baseReputation = BASE_REPUTATION_PER_SWAP;
        
        // Volume bonus
        if (swapAmount >= VOLUME_BONUS_THRESHOLD) {
            basePoints *= 2;
            baseReputation *= 2;
        }
        
        // Cross-chain bonus
        if (isCrossChain) {
            basePoints += CROSS_CHAIN_BONUS;
            baseReputation += 5;
        }
        
        // Multi-chain bonus
        if (chainCount > 1) {
            basePoints += (chainCount - 1) * 10;
            baseReputation += (chainCount - 1) * 2;
        }
        
        // Update user stats
        rewards.totalPoints += basePoints;
        rewards.totalReputation += baseReputation;
        rewards.activityStats["swaps"]++;
        rewards.activityStats["volume"] += swapAmount;
        rewards.lastRewardTime = block.timestamp;
        
        // Check for level up
        _checkLevelUp(user);
        
        // Check for achievements
        _checkAchievements(user);
        
        emit PointsEarned(user, basePoints, "swap_executed");
        emit ReputationEarned(user, baseReputation, "swap_executed");
    }
    
    /**
     * @dev Award bonus points for special activities
     * @param user User address
     * @param points Points to award
     * @param reason Reason for the bonus
     */
    function awardBonusPoints(
        address user,
        uint256 points,
        string memory reason
    ) external whenNotPaused {
        UserRewards storage rewards = userRewards[user];
        rewards.totalPoints += points;
        rewards.lastRewardTime = block.timestamp;
        
        _checkLevelUp(user);
        
        emit PointsEarned(user, points, reason);
    }
    
    /**
     * @dev Award reputation for activities
     * @param user User address
     * @param reputation Reputation to award
     * @param reason Reason for the reputation
     */
    function awardReputation(
        address user,
        uint256 reputation,
        string memory reason
    ) external whenNotPaused {
        UserRewards storage rewards = userRewards[user];
        rewards.totalReputation += reputation;
        rewards.lastRewardTime = block.timestamp;
        
        emit ReputationEarned(user, reputation, reason);
    }
    
    /**
     * @dev Claim rewards based on points and tier
     * @param amount Amount to claim
     */
    function claimRewards(uint256 amount) external nonReentrant whenNotPaused {
        UserRewards storage rewards = userRewards[msg.sender];
        require(amount > 0, "Invalid amount");
        require(amount <= rewards.totalPoints, "Insufficient points");
        
        // Calculate reward amount based on tier
        uint256 rewardAmount = _calculateRewardAmount(msg.sender, amount);
        
        // Transfer reward tokens
        require(rewardToken.transfer(msg.sender, rewardAmount), "Reward transfer failed");
        
        // Deduct points
        rewards.totalPoints -= amount;
        
        emit RewardClaimed(msg.sender, rewardAmount);
    }
    
    /**
     * @dev Unlock an achievement for a user
     * @param user User address
     * @param achievementId Achievement ID
     */
    function unlockAchievement(address user, uint256 achievementId) 
        external 
        onlyValidAchievement(achievementId) 
        whenNotPaused 
    {
        UserRewards storage rewards = userRewards[user];
        Achievement storage achievement = achievements[achievementId];
        
        require(!rewards.unlockedAchievements[achievementId], "Achievement already unlocked");
        require(achievement.isActive, "Achievement not active");
        
        // Check if user meets requirements
        require(
            rewards.activityStats["swaps"] >= achievement.requiredSwaps &&
            rewards.activityStats["volume"] >= achievement.requiredVolume &&
            rewards.activityStats["chains"] >= achievement.requiredChains,
            "Requirements not met"
        );
        
        // Award points and reputation
        rewards.totalPoints += achievement.pointsReward;
        rewards.totalReputation += achievement.reputationReward;
        rewards.unlockedAchievements[achievementId] = true;
        rewards.achievementsUnlocked++;
        
        emit AchievementUnlocked(user, achievementId, achievement.name);
        emit PointsEarned(user, achievement.pointsReward, "achievement_unlocked");
        emit ReputationEarned(user, achievement.reputationReward, "achievement_unlocked");
    }
    
    /**
     * @dev Get user rewards data
     * @param user User address
     */
    function getUserRewards(address user) external view returns (
        uint256 totalPoints,
        uint256 totalReputation,
        uint256 level,
        uint256 achievementsUnlocked,
        uint256 lastRewardTime
    ) {
        UserRewards storage rewards = userRewards[user];
        return (
            rewards.totalPoints,
            rewards.totalReputation,
            rewards.level,
            rewards.achievementsUnlocked,
            rewards.lastRewardTime
        );
    }
    
    /**
     * @dev Get user activity stats
     * @param user User address
     * @param activity Activity name
     */
    function getUserActivityStat(address user, string memory activity) external view returns (uint256) {
        return userRewards[user].activityStats[activity];
    }
    
    /**
     * @dev Check if user has unlocked achievement
     * @param user User address
     * @param achievementId Achievement ID
     */
    function hasUnlockedAchievement(address user, uint256 achievementId) external view returns (bool) {
        return userRewards[user].unlockedAchievements[achievementId];
    }
    
    /**
     * @dev Get achievement data
     * @param achievementId Achievement ID
     */
    function getAchievement(uint256 achievementId) 
        external 
        view 
        onlyValidAchievement(achievementId) 
        returns (Achievement memory) 
    {
        return achievements[achievementId];
    }
    
    /**
     * @dev Get reward tier data
     * @param tierId Tier ID
     */
    function getRewardTier(uint256 tierId) 
        external 
        view 
        onlyValidTier(tierId) 
        returns (RewardTier memory) 
    {
        return rewardTiers[tierId];
    }
    
    /**
     * @dev Calculate reward amount based on user's tier
     * @param user User address
     * @param points Points to convert
     */
    function _calculateRewardAmount(address user, uint256 points) internal view returns (uint256) {
        UserRewards storage rewards = userRewards[user];
        uint256 userTier = _getUserTier(user);
        
        if (userTier > 0) {
            RewardTier storage tier = rewardTiers[userTier];
            return points * tier.bonusMultiplier / 100;
        }
        
        return points; // Base 1:1 conversion
    }
    
    /**
     * @dev Get user's current tier
     * @param user User address
     */
    function _getUserTier(address user) internal view returns (uint256) {
        UserRewards storage rewards = userRewards[user];
        
        for (uint256 i = 1; i <= _tierIdCounter.current(); i++) {
            RewardTier storage tier = rewardTiers[i];
            if (tier.isActive && 
                rewards.totalPoints >= tier.minPoints && 
                rewards.totalReputation >= tier.minReputation) {
                return i;
            }
        }
        
        return 0; // No tier
    }
    
    /**
     * @dev Check if user should level up
     * @param user User address
     */
    function _checkLevelUp(address user) internal {
        UserRewards storage rewards = userRewards[user];
        uint256 newLevel = rewards.totalPoints / LEVEL_UP_THRESHOLD + 1;
        
        if (newLevel > rewards.level) {
            rewards.level = newLevel;
            emit LevelUp(user, newLevel);
        }
    }
    
    /**
     * @dev Check for achievements
     * @param user User address
     */
    function _checkAchievements(address user) internal {
        UserRewards storage rewards = userRewards[user];
        
        for (uint256 i = 1; i <= _achievementIdCounter.current(); i++) {
            Achievement storage achievement = achievements[i];
            
            if (achievement.isActive && 
                !rewards.unlockedAchievements[i] &&
                rewards.activityStats["swaps"] >= achievement.requiredSwaps &&
                rewards.activityStats["volume"] >= achievement.requiredVolume &&
                rewards.activityStats["chains"] >= achievement.requiredChains) {
                
                // Auto-unlock achievement
                rewards.unlockedAchievements[i] = true;
                rewards.achievementsUnlocked++;
                rewards.totalPoints += achievement.pointsReward;
                rewards.totalReputation += achievement.reputationReward;
                
                emit AchievementUnlocked(user, i, achievement.name);
                emit PointsEarned(user, achievement.pointsReward, "achievement_unlocked");
                emit ReputationEarned(user, achievement.reputationReward, "achievement_unlocked");
            }
        }
    }
    
    /**
     * @dev Initialize default achievements
     */
    function _initializeAchievements() internal {
        _addAchievement("First Swap", "Complete your first swap", 50, 10, 1, 0, 1);
        _addAchievement("Volume Trader", "Trade over 1000 ETH in volume", 200, 25, 0, 1000 ether, 1);
        _addAchievement("Cross-Chain Explorer", "Swap across 3 different chains", 300, 50, 0, 0, 3);
        _addAchievement("Swap Master", "Complete 100 swaps", 500, 100, 100, 0, 1);
        _addAchievement("Legendary Trader", "Trade over 10000 ETH in volume", 1000, 200, 0, 10000 ether, 1);
    }
    
    /**
     * @dev Initialize reward tiers
     */
    function _initializeRewardTiers() internal {
        _addRewardTier("Bronze", 0, 0, 100, true);
        _addRewardTier("Silver", 1000, 50, 125, true);
        _addRewardTier("Gold", 5000, 100, 150, true);
        _addRewardTier("Platinum", 10000, 200, 200, true);
        _addRewardTier("Diamond", 25000, 500, 300, true);
    }
    
    /**
     * @dev Add new achievement
     */
    function _addAchievement(
        string memory name,
        string memory description,
        uint256 pointsReward,
        uint256 reputationReward,
        uint256 requiredSwaps,
        uint256 requiredVolume,
        uint256 requiredChains
    ) internal {
        uint256 achievementId = _achievementIdCounter;
        _achievementIdCounter++;
        
        achievements[achievementId] = Achievement({
            id: achievementId,
            name: name,
            description: description,
            pointsReward: pointsReward,
            reputationReward: reputationReward,
            isActive: true,
            requiredSwaps: requiredSwaps,
            requiredVolume: requiredVolume,
            requiredChains: requiredChains
        });
    }
    
    /**
     * @dev Add new reward tier
     */
    function _addRewardTier(
        string memory name,
        uint256 minPoints,
        uint256 minReputation,
        uint256 bonusMultiplier,
        bool isActive
    ) internal {
        uint256 tierId = _tierIdCounter.current() + 1;
        _tierIdCounter.increment();
        
        rewardTiers[tierId] = RewardTier({
            tierId: tierId,
            name: name,
            minPoints: minPoints,
            minReputation: minReputation,
            bonusMultiplier: bonusMultiplier,
            isActive: isActive
        });
    }
    
    /**
     * @dev Add new achievement (admin only)
     */
    function addAchievement(
        string memory name,
        string memory description,
        uint256 pointsReward,
        uint256 reputationReward,
        uint256 requiredSwaps,
        uint256 requiredVolume,
        uint256 requiredChains
    ) external onlyOwner {
        _addAchievement(name, description, pointsReward, reputationReward, requiredSwaps, requiredVolume, requiredChains);
    }
    
    /**
     * @dev Add new reward tier (admin only)
     */
    function addRewardTier(
        string memory name,
        uint256 minPoints,
        uint256 minReputation,
        uint256 bonusMultiplier,
        bool isActive
    ) external onlyOwner {
        _addRewardTier(name, minPoints, minReputation, bonusMultiplier, isActive);
    }
    
    /**
     * @dev Pause reward system (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause reward system
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Update reward token
     * @param newRewardToken New reward token address
     */
    function updateRewardToken(address newRewardToken) external onlyOwner {
        require(newRewardToken != address(0), "Invalid token address");
        rewardToken = IERC20(newRewardToken);
    }
} 