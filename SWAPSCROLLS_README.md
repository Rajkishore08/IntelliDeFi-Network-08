# IntelliDeFi Network 🎯

> Cross-chain, NFT-based, gamified DeFi app built on top of 1inch Fusion+ with LayerZero and Sui integration

## 🌟 Overview

IntelliDeFi Network is a revolutionary DeFi application that wraps 1inch cross-chain swaps into dynamic NFTs using LayerZero and Sui. Users can perform gasless swaps, mint tradable "Swap Scrolls", and earn gamified rewards and on-chain reputation.

## ✨ Features

### 🎮 Gamified DeFi Experience
- **Dynamic NFT Scrolls**: Mint unique SwapScroll NFTs with different tiers (Basic, Advanced, Legendary)
- **Achievement System**: Unlock achievements for trading milestones and cross-chain activities
- **Reputation Tracking**: Build on-chain reputation through successful swaps and cross-chain operations
- **Reward Points**: Earn points for every swap and redeem them for rewards

### 🌉 Cross-Chain Functionality
- **LayerZero Integration**: Seamless cross-chain messaging and swap execution
- **Sui Bridge**: Transfer NFTs between Ethereum and Sui blockchain
- **Multi-Chain Support**: Ethereum, Polygon, Arbitrum, Optimism, Base, and Sui
- **Gasless Swaps**: Leverage 1inch Fusion+ for gasless cross-chain swaps

### 🎯 Advanced Trading Features
- **1inch Fusion+ Integration**: Access to the best swap routes across all chains
- **TWAP Strategies**: Time-Weighted Average Price execution
- **Options Strategies**: Synthetic call/put options using limit orders
- **Concentrated Liquidity**: Provide liquidity in specific price ranges
- **Dynamic Stop-Loss**: Adaptive stop-loss based on market volatility

## 🏗️ Architecture

### Smart Contracts

```
contracts/
├── SwapScrollNFT.sol          # Main NFT contract for IntelliDeFi
├── LayerZeroBridge.sol        # Cross-chain bridge using LayerZero
├── SuiBridge.sol             # Sui blockchain integration
├── RewardSystem.sol          # Gamified reward system
└── MockRewardToken.sol       # Mock token for testing
```

### Frontend Components

```
components/
├── SwapScrollsPanel.tsx      # Main SwapScrolls interface
├── CrossChainSwapPanel.tsx   # Cross-chain swap functionality
├── FusionSwapPanel.tsx       # 1inch Fusion+ integration
├── NFTGallery.tsx           # NFT display and management
└── AdvancedLimitOrderProtocol.tsx # Advanced trading strategies
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet
- Hardhat for smart contract development

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd intellidefi-network
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Add your configuration:
```env
# RPC URLs
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
POLYGON_RPC_URL=https://polygon-rpc.com
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
OPTIMISM_RPC_URL=https://mainnet.optimism.io
BASE_RPC_URL=https://mainnet.base.org

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
OPTIMISM_API_KEY=your_optimism_api_key
BASESCAN_API_KEY=your_basescan_api_key

# Private Key (for deployment)
PRIVATE_KEY=your_private_key_here
```

4. **Compile smart contracts**
```bash
npm run compile
```

5. **Deploy contracts**
```bash
# Local deployment
npm run deploy

# Ethereum mainnet deployment
npm run deploy:ethereum

# Polygon deployment
npm run deploy:polygon
```

6. **Start the development server**
```bash
npm run dev
```

## 🎮 How to Use

### 1. Connect Wallet
- Connect your Web3 wallet (MetaMask, WalletConnect, etc.)
- Ensure you have ETH for gas fees and NFT minting

### 2. Mint a SwapScroll
- Navigate to the "Mint Scroll" tab
- Choose your scroll type:
  - **Basic Scroll** (0.01 ETH): Perfect for beginners
  - **Advanced Scroll** (0.05 ETH): Enhanced features
  - **Legendary Scroll** (0.1 ETH): Ultimate power
- Click "Mint SwapScroll" to create your NFT

### 3. Perform Cross-Chain Swaps
- Select your SwapScroll from "My Scrolls"
- Click "Use Scroll" to access the swap interface
- Choose source and destination chains
- Enter swap details (from token, to token, amount)
- Execute the swap using 1inch Fusion+

### 4. Bridge to Sui
- Navigate to "Bridge to Sui" tab
- Select an Ethereum SwapScroll
- Enter your Sui destination address
- Confirm the bridge transaction
- Your NFT will be available on Sui blockchain

### 5. Earn Rewards
- Complete swaps to earn points and reputation
- Unlock achievements for trading milestones
- View your progress in the "Rewards" tab
- Claim reward tokens based on your tier

## 🔧 Development

### Smart Contract Development

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to testnet
npm run deploy:sepolia

# Verify contracts
npm run verify
```

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Testing

```bash
# Run all tests
npm run test

# Run specific test file
npx hardhat test test/SwapScrollNFT.test.ts

# Run with coverage
npx hardhat coverage
```

## 🌉 Cross-Chain Integration

### LayerZero Setup

1. **Configure LayerZero endpoints**
```solidity
// In LayerZeroBridge.sol
constructor(address _lzEndpoint) {
    lzEndpoint = ILayerZeroEndpoint(_lzEndpoint);
}
```

2. **Supported chains**
- Ethereum (Chain ID: 1)
- Polygon (Chain ID: 137)
- Arbitrum (Chain ID: 42161)
- Optimism (Chain ID: 10)
- Base (Chain ID: 8453)

### Sui Integration

1. **Deploy Sui Move contracts**
```move
// sui/contracts/swap_scrolls.move
module swap_scrolls::swap_scrolls {
    // Sui Move contract implementation
}
```

2. **Bridge configuration**
- Configure Sui package ID
- Set up bridge validators
- Enable cross-chain messaging

## 🎯 Advanced Features

### TWAP Strategies
- Time-Weighted Average Price execution
- Configurable duration and intervals
- Price deviation protection

### Options Strategies
- Synthetic call options using limit orders
- Configurable strike prices and expiration
- Premium calculation and management

### Concentrated Liquidity
- Provide liquidity in specific price ranges
- Configurable fee tiers
- Automated rebalancing

### Dynamic Stop-Loss
- Adaptive stop-loss based on volatility
- Trailing stop functionality
- Risk management automation

## 🔒 Security

### Smart Contract Security
- OpenZeppelin contracts for battle-tested security
- ReentrancyGuard for protection against reentrancy attacks
- Pausable functionality for emergency situations
- Multi-sig governance for critical operations

### Cross-Chain Security
- LayerZero security best practices
- Bridge validation and confirmation
- Rate limiting and circuit breakers
- Emergency pause functionality

## 📊 Analytics & Monitoring

### On-Chain Analytics
- Swap volume tracking
- Cross-chain bridge statistics
- User engagement metrics
- Reward distribution analytics

### Performance Monitoring
- Gas usage optimization
- Transaction success rates
- Bridge confirmation times
- User experience metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **1inch Network** for Fusion+ API and cross-chain infrastructure
- **LayerZero** for omnichain messaging protocol
- **Sui Foundation** for blockchain integration
- **OpenZeppelin** for secure smart contract libraries
- **Hardhat** for development framework

## 🚀 Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Smart contract development
- [x] Basic NFT functionality
- [x] Cross-chain bridge setup

### Phase 2: Frontend Development ✅
- [x] React/Next.js application
- [x] Wallet integration
- [x] Basic UI components

### Phase 3: 1inch Integration ✅
- [x] Fusion+ API integration
- [x] Cross-chain swap functionality
- [x] Gasless swap implementation

### Phase 4: Gamification ✅
- [x] Achievement system
- [x] Reward points
- [x] Reputation tracking

### Phase 5: Advanced Features ✅
- [x] TWAP strategies
- [x] Options strategies
- [x] Concentrated liquidity

### Phase 6: Production Ready 🚧
- [ ] Security audits
- [ ] Production deployment
- [ ] Community launch
- [ ] Marketing campaign

## 📞 Support

- **Discord**: [Join our community](https://discord.gg/intellidefi)
- **Twitter**: [@IntelliDeFi](https://twitter.com/intellidefi)
- **Email**: support@intellidefi.com
- **Documentation**: [docs.intellidefi.com](https://docs.intellidefi.com)

---

**Built with ❤️ by the IntelliDeFi Network team**

*Empowering DeFi through gamification and cross-chain innovation* 