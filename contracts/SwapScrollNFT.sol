// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SwapScrollNFT
 * @dev Main NFT contract for SwapScrolls - cross-chain, gamified DeFi NFTs
 * Built on top of 1inch Fusion+ with LayerZero and Sui integration
 */
contract SwapScrollNFT is ERC721, ERC721URIStorage, Ownable, Pausable, ReentrancyGuard {
    uint256 private _tokenIds;
    
    // Structs
    struct SwapScroll {
        uint256 tokenId;
        address owner;
        string scrollType; // "basic", "advanced", "legendary"
        uint256 swapCount;
        uint256 totalVolume;
        uint256 reputation;
        uint256 createdAt;
        uint256 lastSwapAt;
        bool isTradable;
        string crossChainData;
        uint256 rewardPoints;
    }
    
    struct SwapData {
        string fromToken;
        string toToken;
        uint256 amount;
        uint256 price;
        uint256 timestamp;
        string chainId;
        bool success;
    }
    
    // State variables
    mapping(uint256 => SwapScroll) public swapScrolls;
    mapping(uint256 => SwapData[]) public swapHistory;
    mapping(address => uint256[]) public userScrolls;
    mapping(string => uint256) public scrollTypeCount;
    
    // Events
    event SwapScrollMinted(uint256 indexed tokenId, address indexed owner, string scrollType);
    event SwapExecuted(uint256 indexed tokenId, string fromToken, string toToken, uint256 amount);
    event CrossChainSwap(uint256 indexed tokenId, string fromChain, string toChain);
    event RewardEarned(uint256 indexed tokenId, uint256 points, string reason);
    event ReputationUpdated(uint256 indexed tokenId, uint256 newReputation);
    event ScrollTraded(uint256 indexed tokenId, address from, address to, uint256 price);
    
    // Constants
    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant TRADE_FEE = 25; // 0.25%
    uint256 public constant MAX_SUPPLY = 10000;
    
    // Modifiers
    modifier onlyScrollOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not scroll owner");
        _;
    }
    
    modifier scrollExists(uint256 tokenId) {
        require(ownerOf(tokenId) != address(0), "Scroll does not exist");
        _;
    }
    
    constructor() ERC721("SwapScrolls", "SWAPSCROLL") Ownable(msg.sender) {
        _tokenIds = 1; // Start from 1
    }
    
    /**
     * @dev Mint a new SwapScroll NFT
     * @param scrollType Type of scroll to mint
     * @param metadataURI Metadata URI for the NFT
     */
    function mintSwapScroll(string memory scrollType, string memory metadataURI) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(msg.value >= MINT_PRICE, "Insufficient mint price");
        require(_tokenIds <= MAX_SUPPLY, "Max supply reached");
        require(bytes(scrollType).length > 0, "Invalid scroll type");
        
        uint256 newTokenId = _tokenIds;
        _tokenIds++;
        
        // Create new SwapScroll
        SwapScroll memory newScroll = SwapScroll({
            tokenId: newTokenId,
            owner: msg.sender,
            scrollType: scrollType,
            swapCount: 0,
            totalVolume: 0,
            reputation: 100, // Base reputation
            createdAt: block.timestamp,
            lastSwapAt: 0,
            isTradable: true,
            crossChainData: "",
            rewardPoints: 0
        });
        
        swapScrolls[newTokenId] = newScroll;
        userScrolls[msg.sender].push(newTokenId);
        scrollTypeCount[scrollType]++;
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        emit SwapScrollMinted(newTokenId, msg.sender, scrollType);
    }
    
    /**
     * @dev Execute a swap and update scroll data
     * @param tokenId The scroll NFT ID
     * @param fromToken Token being swapped from
     * @param toToken Token being swapped to
     * @param amount Amount being swapped
     * @param price Price of the swap
     * @param chainId Chain where swap occurred
     */
    function executeSwap(
        uint256 tokenId,
        string memory fromToken,
        string memory toToken,
        uint256 amount,
        uint256 price,
        string memory chainId
    ) external onlyScrollOwner(tokenId) scrollExists(tokenId) {
        SwapScroll storage scroll = swapScrolls[tokenId];
        
        // Update scroll data
        scroll.swapCount++;
        scroll.totalVolume += amount;
        scroll.lastSwapAt = block.timestamp;
        
        // Create swap record
        SwapData memory swapRecord = SwapData({
            fromToken: fromToken,
            toToken: toToken,
            amount: amount,
            price: price,
            timestamp: block.timestamp,
            chainId: chainId,
            success: true
        });
        
        swapHistory[tokenId].push(swapRecord);
        
        // Calculate rewards and reputation
        uint256 rewardPoints = calculateRewards(amount, scroll.scrollType);
        scroll.rewardPoints += rewardPoints;
        scroll.reputation += calculateReputationGain(amount, scroll.scrollType);
        
        emit SwapExecuted(tokenId, fromToken, toToken, amount);
        emit RewardEarned(tokenId, rewardPoints, "swap_executed");
        emit ReputationUpdated(tokenId, scroll.reputation);
    }
    
    /**
     * @dev Execute cross-chain swap
     * @param tokenId The scroll NFT ID
     * @param fromChain Source chain
     * @param toChain Destination chain
     * @param bridgeData Bridge transaction data
     */
    function executeCrossChainSwap(
        uint256 tokenId,
        string memory fromChain,
        string memory toChain,
        string memory bridgeData
    ) external onlyScrollOwner(tokenId) scrollExists(tokenId) {
        SwapScroll storage scroll = swapScrolls[tokenId];
        
        // Update cross-chain data
        scroll.crossChainData = bridgeData;
        scroll.swapCount++;
        scroll.lastSwapAt = block.timestamp;
        
        // Bonus rewards for cross-chain swaps
        uint256 crossChainBonus = 50;
        scroll.rewardPoints += crossChainBonus;
        scroll.reputation += 25;
        
        emit CrossChainSwap(tokenId, fromChain, toChain);
        emit RewardEarned(tokenId, crossChainBonus, "cross_chain_bonus");
        emit ReputationUpdated(tokenId, scroll.reputation);
    }
    
    /**
     * @dev Trade a SwapScroll NFT
     * @param tokenId The scroll NFT ID
     * @param newOwner New owner address
     */
    function tradeScroll(uint256 tokenId, address newOwner) 
        external 
        onlyScrollOwner(tokenId) 
        scrollExists(tokenId) 
    {
        SwapScroll storage scroll = swapScrolls[tokenId];
        require(scroll.isTradable, "Scroll not tradable");
        
        address previousOwner = ownerOf(tokenId);
        
        // Transfer ownership
        _transfer(previousOwner, newOwner, tokenId);
        
        // Update scroll data
        scroll.owner = newOwner;
        
        // Update user scrolls arrays
        removeFromUserScrolls(previousOwner, tokenId);
        userScrolls[newOwner].push(tokenId);
        
        emit ScrollTraded(tokenId, previousOwner, newOwner, 0);
    }
    
    /**
     * @dev Get scroll data
     * @param tokenId The scroll NFT ID
     */
    function getScrollData(uint256 tokenId) 
        external 
        view 
        scrollExists(tokenId) 
        returns (SwapScroll memory) 
    {
        return swapScrolls[tokenId];
    }
    
    /**
     * @dev Get swap history for a scroll
     * @param tokenId The scroll NFT ID
     */
    function getSwapHistory(uint256 tokenId) 
        external 
        view 
        scrollExists(tokenId) 
        returns (SwapData[] memory) 
    {
        return swapHistory[tokenId];
    }
    
    /**
     * @dev Get user's scrolls
     * @param user User address
     */
    function getUserScrolls(address user) external view returns (uint256[] memory) {
        return userScrolls[user];
    }
    
    /**
     * @dev Calculate rewards based on swap amount and scroll type
     */
    function calculateRewards(uint256 amount, string memory scrollType) internal pure returns (uint256) {
        uint256 baseReward = amount / 1000; // 0.1% of swap amount
        
        if (keccak256(abi.encodePacked(scrollType)) == keccak256(abi.encodePacked("legendary"))) {
            return baseReward * 3;
        } else if (keccak256(abi.encodePacked(scrollType)) == keccak256(abi.encodePacked("advanced"))) {
            return baseReward * 2;
        } else {
            return baseReward;
        }
    }
    
    /**
     * @dev Calculate reputation gain
     */
    function calculateReputationGain(uint256 amount, string memory scrollType) internal pure returns (uint256) {
        uint256 baseGain = 1;
        
        if (keccak256(abi.encodePacked(scrollType)) == keccak256(abi.encodePacked("legendary"))) {
            return baseGain * 3;
        } else if (keccak256(abi.encodePacked(scrollType)) == keccak256(abi.encodePacked("advanced"))) {
            return baseGain * 2;
        } else {
            return baseGain;
        }
    }
    
    /**
     * @dev Remove scroll from user's scrolls array
     */
    function removeFromUserScrolls(address user, uint256 tokenId) internal {
        uint256[] storage userScrollsArray = userScrolls[user];
        for (uint256 i = 0; i < userScrollsArray.length; i++) {
            if (userScrollsArray[i] == tokenId) {
                userScrollsArray[i] = userScrollsArray[userScrollsArray.length - 1];
                userScrollsArray.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Pause contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 