// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SuiBridge
 * @dev Bridge contract for Sui blockchain integration
 * Handles cross-chain NFT transfers and swap data synchronization
 */
contract SuiBridge is Ownable, Pausable, ReentrancyGuard {
    using Strings for uint256;
    
    // Structs
    struct SuiNFT {
        string suiObjectId;
        uint256 ethereumTokenId;
        address ethereumOwner;
        string metadata;
        uint256 bridgeTimestamp;
        bool isBridged;
    }
    
    struct BridgeRequest {
        uint256 requestId;
        address user;
        uint256 ethereumTokenId;
        string suiDestination;
        uint256 timestamp;
        bool processed;
        bool confirmed;
    }
    
    struct SuiSwapData {
        string suiObjectId;
        string fromToken;
        string toToken;
        uint256 amount;
        uint256 price;
        uint256 timestamp;
        bool success;
    }
    
    // State variables
    mapping(string => SuiNFT) public suiNFTs;
    mapping(uint256 => BridgeRequest) public bridgeRequests;
    mapping(string => SuiSwapData[]) public suiSwapHistory;
    mapping(address => uint256[]) public userBridgeRequests;
    
    uint256 private _requestIdCounter;
    
    // Sui network configuration
    string public constant SUI_NETWORK = "mainnet";
    string public constant SUI_PACKAGE_ID = "0x..."; // Sui package ID
    string public constant SUI_MODULE = "swap_scrolls";
    
    // Events
    event BridgeRequestCreated(
        uint256 indexed requestId,
        address indexed user,
        uint256 ethereumTokenId,
        string suiDestination
    );
    
    event NFTBridgedToSui(
        uint256 indexed requestId,
        string suiObjectId,
        uint256 ethereumTokenId
    );
    
    event SuiSwapExecuted(
        string indexed suiObjectId,
        string fromToken,
        string toToken,
        uint256 amount
    );
    
    event BridgeRequestConfirmed(uint256 indexed requestId);
    event BridgeRequestProcessed(uint256 indexed requestId);
    
    // Modifiers
    modifier onlyValidRequest(uint256 requestId) {
        require(bridgeRequests[requestId].requestId != 0, "Invalid request ID");
        _;
    }
    
    modifier onlyRequestOwner(uint256 requestId) {
        require(bridgeRequests[requestId].user == msg.sender, "Not request owner");
        _;
    }
    
    constructor() {
        _requestIdCounter = 1;
    }
    
    /**
     * @dev Create a bridge request to transfer NFT to Sui
     * @param ethereumTokenId Ethereum NFT token ID
     * @param suiDestination Sui destination address
     * @param metadata NFT metadata for Sui
     */
    function createBridgeRequest(
        uint256 ethereumTokenId,
        string memory suiDestination,
        string memory metadata
    ) external nonReentrant whenNotPaused {
        require(bytes(suiDestination).length > 0, "Invalid Sui destination");
        require(bytes(metadata).length > 0, "Invalid metadata");
        
        uint256 requestId = _requestIdCounter++;
        
        BridgeRequest memory newRequest = BridgeRequest({
            requestId: requestId,
            user: msg.sender,
            ethereumTokenId: ethereumTokenId,
            suiDestination: suiDestination,
            timestamp: block.timestamp,
            processed: false,
            confirmed: false
        });
        
        bridgeRequests[requestId] = newRequest;
        userBridgeRequests[msg.sender].push(requestId);
        
        emit BridgeRequestCreated(requestId, msg.sender, ethereumTokenId, suiDestination);
    }
    
    /**
     * @dev Process bridge request (called by Sui validator)
     * @param requestId Bridge request ID
     * @param suiObjectId Sui object ID for the bridged NFT
     */
    function processBridgeRequest(uint256 requestId, string memory suiObjectId) 
        external 
        onlyValidRequest(requestId) 
        whenNotPaused 
    {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(!request.processed, "Request already processed");
        
        request.processed = true;
        
        // Create SuiNFT record
        SuiNFT memory suiNFT = SuiNFT({
            suiObjectId: suiObjectId,
            ethereumTokenId: request.ethereumTokenId,
            ethereumOwner: request.user,
            metadata: "",
            bridgeTimestamp: block.timestamp,
            isBridged: true
        });
        
        suiNFTs[suiObjectId] = suiNFT;
        
        emit BridgeRequestProcessed(requestId);
        emit NFTBridgedToSui(requestId, suiObjectId, request.ethereumTokenId);
    }
    
    /**
     * @dev Confirm bridge request (called by LayerZero or validator)
     * @param requestId Bridge request ID
     */
    function confirmBridgeRequest(uint256 requestId) 
        external 
        onlyValidRequest(requestId) 
    {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(!request.confirmed, "Request already confirmed");
        
        request.confirmed = true;
        
        emit BridgeRequestConfirmed(requestId);
    }
    
    /**
     * @dev Record Sui swap execution
     * @param suiObjectId Sui object ID
     * @param fromToken Token being swapped from
     * @param toToken Token being swapped to
     * @param amount Amount being swapped
     * @param price Price of the swap
     */
    function recordSuiSwap(
        string memory suiObjectId,
        string memory fromToken,
        string memory toToken,
        uint256 amount,
        uint256 price
    ) external whenNotPaused {
        require(bytes(suiObjectId).length > 0, "Invalid Sui object ID");
        require(suiNFTs[suiObjectId].isBridged, "NFT not bridged to Sui");
        
        SuiSwapData memory swapData = SuiSwapData({
            suiObjectId: suiObjectId,
            fromToken: fromToken,
            toToken: toToken,
            amount: amount,
            price: price,
            timestamp: block.timestamp,
            success: true
        });
        
        suiSwapHistory[suiObjectId].push(swapData);
        
        emit SuiSwapExecuted(suiObjectId, fromToken, toToken, amount);
    }
    
    /**
     * @dev Get bridge request data
     * @param requestId Request ID
     */
    function getBridgeRequest(uint256 requestId) 
        external 
        view 
        onlyValidRequest(requestId) 
        returns (BridgeRequest memory) 
    {
        return bridgeRequests[requestId];
    }
    
    /**
     * @dev Get Sui NFT data
     * @param suiObjectId Sui object ID
     */
    function getSuiNFT(string memory suiObjectId) external view returns (SuiNFT memory) {
        return suiNFTs[suiObjectId];
    }
    
    /**
     * @dev Get Sui swap history
     * @param suiObjectId Sui object ID
     */
    function getSuiSwapHistory(string memory suiObjectId) external view returns (SuiSwapData[] memory) {
        return suiSwapHistory[suiObjectId];
    }
    
    /**
     * @dev Get user's bridge requests
     * @param user User address
     */
    function getUserBridgeRequests(address user) external view returns (uint256[] memory) {
        return userBridgeRequests[user];
    }
    
    /**
     * @dev Check if NFT is bridged to Sui
     * @param ethereumTokenId Ethereum token ID
     */
    function isNFTBridgedToSui(uint256 ethereumTokenId) external view returns (bool) {
        // This would require iterating through all SuiNFTs
        // In production, you'd maintain a reverse mapping
        return false; // Simplified for demo
    }
    
    /**
     * @dev Get Sui object ID for Ethereum token
     * @param ethereumTokenId Ethereum token ID
     */
    function getSuiObjectId(uint256 ethereumTokenId) external view returns (string memory) {
        // This would require a reverse mapping
        // In production, you'd maintain ethereumTokenId => suiObjectId mapping
        return ""; // Simplified for demo
    }
    
    /**
     * @dev Generate Sui transaction payload for NFT minting
     * @param requestId Bridge request ID
     */
    function generateSuiMintPayload(uint256 requestId) 
        external 
        view 
        onlyValidRequest(requestId) 
        returns (bytes memory) 
    {
        BridgeRequest storage request = bridgeRequests[requestId];
        
        // Generate Sui transaction payload
        // This would contain the move call data for minting the NFT on Sui
        bytes memory payload = abi.encode(
            SUI_PACKAGE_ID,
            SUI_MODULE,
            "mint_swap_scroll",
            request.ethereumTokenId,
            request.suiDestination,
            request.user
        );
        
        return payload;
    }
    
    /**
     * @dev Generate Sui transaction payload for swap execution
     * @param suiObjectId Sui object ID
     * @param fromToken Token to swap from
     * @param toToken Token to swap to
     * @param amount Amount to swap
     */
    function generateSuiSwapPayload(
        string memory suiObjectId,
        string memory fromToken,
        string memory toToken,
        uint256 amount
    ) external view returns (bytes memory) {
        require(suiNFTs[suiObjectId].isBridged, "NFT not bridged to Sui");
        
        // Generate Sui transaction payload for swap
        bytes memory payload = abi.encode(
            SUI_PACKAGE_ID,
            SUI_MODULE,
            "execute_swap",
            suiObjectId,
            fromToken,
            toToken,
            amount
        );
        
        return payload;
    }
    
    /**
     * @dev Update Sui network configuration
     * @param newPackageId New package ID
     * @param newModule New module name
     */
    function updateSuiConfig(string memory newPackageId, string memory newModule) external onlyOwner {
        // In a real implementation, these would be state variables
        // For demo purposes, we'll just emit an event
        emit SuiConfigUpdated(newPackageId, newModule);
    }
    
    /**
     * @dev Pause bridge (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause bridge
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Additional events
    event SuiConfigUpdated(string packageId, string module);
    
    // Sui-specific helper functions
    function getSuiNetworkInfo() external pure returns (string memory network, string memory packageId) {
        return (SUI_NETWORK, SUI_PACKAGE_ID);
    }
    
    function validateSuiAddress(string memory suiAddress) external pure returns (bool) {
        // Basic validation for Sui address format
        // In production, you'd implement proper Sui address validation
        return bytes(suiAddress).length == 66 && 
               bytes(suiAddress)[0] == "0" && 
               bytes(suiAddress)[1] == "x";
    }
} 