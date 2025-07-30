"use client"

/**
 * 1inch API Service for Fusion+ Integration
 * Supports: Swap API, Fusion+ API, Limit Order API, Data APIs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_1INCH_API_URL || 'https://api.1inch.dev'
const API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY

export interface TokenInfo {
  symbol: string
  name: string
  address: string
  decimals: number
  logoURI?: string
  tags?: string[]
}

export interface QuoteRequest {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
  fromAddress: string
  chainId: number
  fee?: number
  gasPrice?: string
  complexityLevel?: number
  connectorTokens?: string[]
  allowPartialFill?: boolean
}

export interface QuoteResponse {
  fromToken: TokenInfo
  toToken: TokenInfo
  toTokenAmount: string
  fromTokenAmount: string
  protocols: any[]
  gas: string
  estimatedGas: string
  gasCost: string
  estimatedGasCost: string
  tx: {
    from: string
    to: string
    data: string
    value: string
    gas: string
    gasPrice: string
  }
}

export interface FusionQuoteRequest {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
  fromAddress: string
  chainId: number
  permit?: string
  enableEstimate?: boolean
  allowPartialFill?: boolean
  source?: string
}

export interface FusionQuoteResponse {
  quoteId: string
  fromToken: TokenInfo
  toToken: TokenInfo
  toTokenAmount: string
  fromTokenAmount: string
  protocols: any[]
  gas: string
  estimatedGas: string
  gasCost: string
  estimatedGasCost: string
  tx: {
    from: string
    to: string
    data: string
    value: string
    gas: string
    gasPrice: string
  }
}

export interface LimitOrderRequest {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
  fromAddress: string
  chainId: number
  price: string
  postOnly?: boolean
  receiver?: string
  permit?: string
  signature?: string
}

export interface LimitOrderResponse {
  orderHash: string
  signature: string
  order: {
    makerAsset: string
    takerAsset: string
    maker: string
    taker: string
    makerAmount: string
    takerAmount: string
    salt: string
    expiration: string
  }
}

class OneInchAPI {
  private baseURL: string
  private apiKey: string

  constructor() {
    this.baseURL = API_BASE_URL
    this.apiKey = API_KEY || ''
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`1inch API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('1inch API request failed:', error)
      throw error
    }
  }

  // Get quote for classic swap
  async getQuote(params: QuoteRequest): Promise<QuoteResponse> {
    const queryParams = new URLSearchParams({
      fromTokenAddress: params.fromTokenAddress,
      toTokenAddress: params.toTokenAddress,
      amount: params.amount,
      fromAddress: params.fromAddress,
      chainId: params.chainId.toString(),
      ...(params.fee && { fee: params.fee.toString() }),
      ...(params.gasPrice && { gasPrice: params.gasPrice }),
      ...(params.complexityLevel && { complexityLevel: params.complexityLevel.toString() }),
      ...(params.connectorTokens && { connectorTokens: params.connectorTokens.join(',') }),
      ...(params.allowPartialFill && { allowPartialFill: params.allowPartialFill.toString() }),
    })

    return this.request<QuoteResponse>(`/swap/v6.0/${params.chainId}/quote?${queryParams}`)
  }

  // Get quote for Fusion+ swap
  async getFusionQuote(params: FusionQuoteRequest): Promise<FusionQuoteResponse> {
    const queryParams = new URLSearchParams({
      fromTokenAddress: params.fromTokenAddress,
      toTokenAddress: params.toTokenAddress,
      amount: params.amount,
      fromAddress: params.fromAddress,
      chainId: params.chainId.toString(),
      ...(params.permit && { permit: params.permit }),
      ...(params.enableEstimate && { enableEstimate: params.enableEstimate.toString() }),
      ...(params.allowPartialFill && { allowPartialFill: params.allowPartialFill.toString() }),
      ...(params.source && { source: params.source }),
    })

    return this.request<FusionQuoteResponse>(`/fusion/quote?${queryParams}`)
  }

  // Get tokens for a specific chain
  async getTokens(chainId: number): Promise<{ tokens: Record<string, TokenInfo> }> {
    return this.request<{ tokens: Record<string, TokenInfo> }>(`/swap/v6.0/${chainId}/tokens`)
  }

  // Get token prices
  async getTokenPrices(chainId: number, tokenAddresses: string[]): Promise<Record<string, number>> {
    const queryParams = new URLSearchParams({
      addresses: tokenAddresses.join(','),
    })

    return this.request<Record<string, number>>(`/swap/v6.0/${chainId}/prices?${queryParams}`)
  }

  // Get wallet balances
  async getWalletBalances(chainId: number, walletAddress: string): Promise<Record<string, string>> {
    return this.request<Record<string, string>>(`/swap/v6.0/${chainId}/balance?address=${walletAddress}`)
  }

  // Get supported chains
  async getSupportedChains(): Promise<{ chains: number[] }> {
    return this.request<{ chains: number[] }>('/swap/v6.0/chains')
  }

  // Create limit order
  async createLimitOrder(params: LimitOrderRequest): Promise<LimitOrderResponse> {
    return this.request<LimitOrderResponse>(`/limit-order/v4.0/${params.chainId}/order`, {
      method: 'POST',
      body: JSON.stringify({
        fromTokenAddress: params.fromTokenAddress,
        toTokenAddress: params.toTokenAddress,
        amount: params.amount,
        fromAddress: params.fromAddress,
        price: params.price,
        ...(params.postOnly && { postOnly: params.postOnly }),
        ...(params.receiver && { receiver: params.receiver }),
        ...(params.permit && { permit: params.permit }),
        ...(params.signature && { signature: params.signature }),
      }),
    })
  }

  // Get limit orders for a wallet
  async getLimitOrders(chainId: number, walletAddress: string): Promise<any[]> {
    return this.request<any[]>(`/limit-order/v4.0/${chainId}/orders?address=${walletAddress}`)
  }

  // Get Fusion+ supported chains
  async getFusionChains(): Promise<{ chains: number[] }> {
    return this.request<{ chains: number[] }>('/fusion/chains')
  }

  // Get Fusion+ quote status
  async getFusionQuoteStatus(quoteId: string): Promise<any> {
    return this.request<any>(`/fusion/quote/${quoteId}`)
  }

  // Mock data for development
  getMockQuote(params: QuoteRequest): QuoteResponse {
    return {
      fromToken: {
        symbol: 'USDC',
        name: 'USD Coin',
        address: params.fromTokenAddress,
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      },
      toToken: {
        symbol: 'ETH',
        name: 'Ethereum',
        address: params.toTokenAddress,
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      },
      toTokenAmount: '0.001',
      fromTokenAmount: params.amount,
      protocols: [],
      gas: '210000',
      estimatedGas: '180000',
      gasCost: '0.002',
      estimatedGasCost: '0.0018',
      tx: {
        from: params.fromAddress,
        to: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
        data: '0x',
        value: '0',
        gas: '210000',
        gasPrice: '20000000000',
      },
    }
  }
}

export const oneInchAPI = new OneInchAPI() 