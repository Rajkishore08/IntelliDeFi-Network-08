import { NextRequest, NextResponse } from 'next/server'

// Mock token data - replace with real API calls in production
const mockTokens = [
  {
    address: "0xA0b86a33E6441b8c4C8C0C8C0C8C0C8C0C8C0C8C",
    chainId: 1,
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    name: "Ethereum",
    symbol: "ETH",
    tags: ["native", "defi"]
  },
  {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    chainId: 1,
    decimals: 8,
    logoURI: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    tags: ["wrapped", "defi"]
  },
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    chainId: 1,
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    name: "Tether USD",
    symbol: "USDT",
    tags: ["stablecoin", "defi"]
  },
  {
    address: "0xA0b86a33E6441b8c4C8C0C8C0C8C0C8C0C8C0C8C",
    chainId: 137,
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    name: "Ethereum",
    symbol: "ETH",
    tags: ["native", "defi"]
  },
  {
    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    chainId: 137,
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    name: "Wrapped Matic",
    symbol: "WMATIC",
    tags: ["native", "defi"]
  },
  {
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    chainId: 137,
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    name: "Wrapped Ether",
    symbol: "WETH",
    tags: ["wrapped", "defi"]
  },
  {
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    chainId: 137,
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    name: "USD Coin",
    symbol: "USDC",
    tags: ["stablecoin", "defi"]
  },
  {
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    chainId: 137,
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    name: "Dai Stablecoin",
    symbol: "DAI",
    tags: ["stablecoin", "defi"]
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')
    const query = searchParams.get('query') || ''
    
    // Filter tokens based on chainId and query
    let filteredTokens = mockTokens
    
    if (chainId) {
      filteredTokens = filteredTokens.filter(token => token.chainId === parseInt(chainId))
    }
    
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredTokens = filteredTokens.filter(token => 
        token.name.toLowerCase().includes(lowerQuery) ||
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.address.toLowerCase().includes(lowerQuery)
      )
    }
    
    return NextResponse.json({
      tokens: filteredTokens,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chainId, query } = body
    
    // Filter tokens based on chainId and query
    let filteredTokens = mockTokens
    
    if (chainId) {
      filteredTokens = filteredTokens.filter(token => token.chainId === parseInt(chainId))
    }
    
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredTokens = filteredTokens.filter(token => 
        token.name.toLowerCase().includes(lowerQuery) ||
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.address.toLowerCase().includes(lowerQuery)
      )
    }
    
    return NextResponse.json({
      tokens: filteredTokens,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
} 