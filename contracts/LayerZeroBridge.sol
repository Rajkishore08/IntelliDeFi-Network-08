// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title LayerZeroBridge
 * @dev Cross-chain bridge contract using LayerZero for SwapScrolls
 * Enables seamless cross-chain swap execution and NFT transfers
 */
// LayerZero interfaces (simplified for demo)
interface ILayerZeroEndpoint {
    function send(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable;
}

contract LayerZeroBridge is Ownable, Pausable, ReentrancyGuard {
    using Strings for uint256;
    
    // Structs
    struct CrossChainSwap {
        uint256 swapId;
        address user;
        string fromToken;
        string toToken;
        uint256 amount;
        uint256 price;
        string fromChain;
        string toChain;
        uint256 timestamp;
        bool executed;
        bool confirmed;
    }
    
    struct BridgeMessage {
        uint256 messageId;
        bytes payload;
        uint16 sourceChainId;
        uint16 destinationChainId;
        uint256 timestamp;
        bool processed;
    }
    
    // State variables
    ILayerZeroEndpoint public lzEndpoint;
    mapping(uint256 => CrossChainSwap) public crossChainSwaps;
    mapping(uint256 => BridgeMessage) public bridgeMessages;
    mapping(uint16 => bool) public supportedChains;
    mapping(string => uint16) public chainNameToId;
    
    uint256 private _swapIdCounter;
    uint256 private _messageIdCounter;
    
    // Events
    event CrossChainSwapInitiated(
        uint256 indexed swapId,
        address indexed user,
        string fromToken,
        string toToken,
        string fromChain,
        string toChain
    );
    
    event CrossChainSwapExecuted(
        uint256 indexed swapId,
        string fromChain,
        string toChain,
        uint256 amount
    );
    
    event BridgeMessageReceived(
        uint256 indexed messageId,
        uint16 sourceChainId,
        uint16 destinationChainId
    );
    
    event ChainSupported(uint16 chainId, string chainName);
    event ChainRemoved(uint16 chainId);
    
    // Modifiers
    modifier onlySupportedChain(uint16 chainId) {
        require(supportedChains[chainId], "Chain not supported");
        _;
    }
    
    modifier onlyValidSwap(uint256 swapId) {
        require(crossChainSwaps[swapId].swapId != 0, "Invalid swap ID");
        _;
    }
    
    constructor(address _lzEndpoint) {
        lzEndpoint = ILayerZeroEndpoint(_lzEndpoint);
        _swapIdCounter = 1;
        _messageIdCounter = 1;
        
        // Initialize supported chains
        _addSupportedChain(1, "ethereum");
        _addSupportedChain(137, "polygon");
        _addSupportedChain(42161, "arbitrum");
        _addSupportedChain(10, "optimism");
        _addSupportedChain(8453, "base");
    }
    
    /**
     * @dev Initiate a cross-chain swap
     * @param fromToken Token to swap from
     * @param toToken Token to swap to
     * @param amount Amount to swap
     * @param price Price for the swap
     * @param fromChain Source chain
     * @param toChain Destination chain
     */
    function initiateCrossChainSwap(
        string memory fromToken,
        string memory toToken,
        uint256 amount,
        uint256 price,
        string memory fromChain,
        string memory toChain
    ) external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Bridge fee required");
        require(bytes(fromToken).length > 0, "Invalid from token");
        require(bytes(toToken).length > 0, "Invalid to token");
        require(amount > 0, "Invalid amount");
        
        uint256 swapId = _swapIdCounter++;
        
        CrossChainSwap memory newSwap = CrossChainSwap({
            swapId: swapId,
            user: msg.sender,
            fromToken: fromToken,
            toToken: toToken,
            amount: amount,
            price: price,
            fromChain: fromChain,
            toChain: toChain,
            timestamp: block.timestamp,
            executed: false,
            confirmed: false
        });
        
        crossChainSwaps[swapId] = newSwap;
        
        // Send cross-chain message via LayerZero
        _sendCrossChainMessage(swapId, fromChain, toChain);
        
        emit CrossChainSwapInitiated(swapId, msg.sender, fromToken, toToken, fromChain, toChain);
    }
    
    /**
     * @dev Execute a cross-chain swap on destination chain
     * @param swapId The swap ID to execute
     */
    function executeCrossChainSwap(uint256 swapId) 
        external 
        onlyValidSwap(swapId) 
        whenNotPaused 
    {
        CrossChainSwap storage swap = crossChainSwaps[swapId];
        require(!swap.executed, "Swap already executed");
        require(swap.confirmed, "Swap not confirmed");
        
        swap.executed = true;
        
        // Here you would integrate with 1inch Fusion+ API
        // to execute the actual swap on the destination chain
        
        emit CrossChainSwapExecuted(swapId, swap.fromChain, swap.toChain, swap.amount);
    }
    
    /**
     * @dev Confirm a cross-chain swap (called by LayerZero)
     * @param swapId The swap ID to confirm
     */
    function confirmCrossChainSwap(uint256 swapId) 
        external 
        onlyValidSwap(swapId) 
    {
        CrossChainSwap storage swap = crossChainSwaps[swapId];
        require(!swap.confirmed, "Swap already confirmed");
        
        swap.confirmed = true;
    }
    
    /**
     * @dev Process incoming bridge message from LayerZero
     * @param sourceChainId Source chain ID
     * @param payload Message payload
     */
    function _processIncomingMessage(uint16 sourceChainId, bytes memory payload) 
        internal 
        onlySupportedChain(sourceChainId) 
    {
        uint256 messageId = _messageIdCounter++;
        
        BridgeMessage memory message = BridgeMessage({
            messageId: messageId,
            payload: payload,
            sourceChainId: sourceChainId,
            destinationChainId: 0, // Will be set based on payload
            timestamp: block.timestamp,
            processed: false
        });
        
        bridgeMessages[messageId] = message;
        
        // Process the message payload
        _processMessagePayload(messageId, payload);
        
        emit BridgeMessageReceived(messageId, sourceChainId, 0);
    }
    
    /**
     * @dev Process message payload and extract swap data
     * @param messageId Message ID
     * @param payload Message payload
     */
    function _processMessagePayload(uint256 messageId, bytes memory payload) internal {
        // Decode payload to extract swap information
        // This is a simplified version - in production you'd use proper encoding
        
        BridgeMessage storage message = bridgeMessages[messageId];
        message.processed = true;
        
        // Extract swap ID from payload and confirm the swap
        // For demo purposes, we'll assume the payload contains the swap ID
        uint256 swapId = _extractSwapIdFromPayload(payload);
        if (swapId > 0) {
            confirmCrossChainSwap(swapId);
        }
    }
    
    /**
     * @dev Send cross-chain message via LayerZero
     * @param swapId Swap ID
     * @param fromChain Source chain
     * @param toChain Destination chain
     */
    function _sendCrossChainMessage(
        uint256 swapId,
        string memory fromChain,
        string memory toChain
    ) internal {
        uint16 destinationChainId = chainNameToId[toChain];
        require(destinationChainId != 0, "Invalid destination chain");
        
        // Prepare payload
        bytes memory payload = abi.encode(swapId, fromChain, toChain);
        
        // Send via LayerZero
        lzEndpoint.send{value: msg.value}(
            destinationChainId,
            abi.encodePacked(address(this)), // destination address
            payload,
            payable(msg.sender), // refund address
            address(0), // zro payment address
            "" // adapter params
        );
    }
    
    /**
     * @dev Extract swap ID from payload (simplified)
     * @param payload Message payload
     */
    function _extractSwapIdFromPayload(bytes memory payload) internal pure returns (uint256) {
        // Simplified extraction - in production you'd use proper decoding
        if (payload.length >= 32) {
            uint256 swapId;
            assembly {
                swapId := mload(add(payload, 32))
            }
            return swapId;
        }
        return 0;
    }
    
    /**
     * @dev Add supported chain
     * @param chainId Chain ID
     * @param chainName Chain name
     */
    function addSupportedChain(uint16 chainId, string memory chainName) external onlyOwner {
        _addSupportedChain(chainId, chainName);
    }
    
    /**
     * @dev Remove supported chain
     * @param chainId Chain ID to remove
     */
    function removeSupportedChain(uint16 chainId) external onlyOwner {
        require(supportedChains[chainId], "Chain not supported");
        supportedChains[chainId] = false;
        emit ChainRemoved(chainId);
    }
    
    /**
     * @dev Internal function to add supported chain
     */
    function _addSupportedChain(uint16 chainId, string memory chainName) internal {
        supportedChains[chainId] = true;
        chainNameToId[chainName] = chainId;
        emit ChainSupported(chainId, chainName);
    }
    
    /**
     * @dev Get cross-chain swap data
     * @param swapId Swap ID
     */
    function getCrossChainSwap(uint256 swapId) 
        external 
        view 
        onlyValidSwap(swapId) 
        returns (CrossChainSwap memory) 
    {
        return crossChainSwaps[swapId];
    }
    
    /**
     * @dev Get bridge message data
     * @param messageId Message ID
     */
    function getBridgeMessage(uint256 messageId) external view returns (BridgeMessage memory) {
        return bridgeMessages[messageId];
    }
    
    /**
     * @dev Check if chain is supported
     * @param chainId Chain ID
     */
    function isChainSupported(uint16 chainId) external view returns (bool) {
        return supportedChains[chainId];
    }
    
    /**
     * @dev Get chain ID by name
     * @param chainName Chain name
     */
    function getChainIdByName(string memory chainName) external view returns (uint16) {
        return chainNameToId[chainName];
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
    
    /**
     * @dev Update LayerZero endpoint
     * @param newEndpoint New endpoint address
     */
    function updateLayerZeroEndpoint(address newEndpoint) external onlyOwner {
        require(newEndpoint != address(0), "Invalid endpoint");
        lzEndpoint = ILayerZeroEndpoint(newEndpoint);
    }
    
    /**
     * @dev Withdraw bridge fees
     */
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // LayerZero callback function
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal {
        _processIncomingMessage(_srcChainId, _payload);
    }
} 