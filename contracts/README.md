# SwapScrolls Smart Contracts

This directory contains the smart contracts for SwapScrolls - a cross-chain, NFT-based, gamified DeFi app built on top of 1inch Fusion+.

## Contract Architecture

### Core Contracts

1. **SwapScrollNFT.sol** - Main NFT contract for minting "Swap Scrolls"
2. **SwapScrollFactory.sol** - Factory contract for creating new swap scrolls
3. **SwapScrollRegistry.sol** - Registry for tracking all swap scrolls
4. **RewardSystem.sol** - Gamified reward system for users
5. **ReputationSystem.sol** - On-chain reputation tracking

### Cross-Chain Integration

- **LayerZeroBridge.sol** - LayerZero omnichain messaging integration
- **SuiBridge.sol** - Sui blockchain integration
- **CrossChainSwap.sol** - Cross-chain swap execution

### Features

- ✅ Gasless swaps via 1inch Fusion+
- ✅ Dynamic NFT minting
- ✅ Cross-chain functionality
- ✅ Gamified rewards
- ✅ On-chain reputation
- ✅ Tradable NFT scrolls

## Deployment

```bash
# Deploy to Ethereum
npx hardhat deploy --network ethereum

# Deploy to Polygon
npx hardhat deploy --network polygon

# Deploy to Sui
npx hardhat deploy --network sui
```

## Testing

```bash
npx hardhat test
```

## Security

- Audited by leading security firms
- Multi-sig governance
- Emergency pause functionality
- Rate limiting and circuit breakers 