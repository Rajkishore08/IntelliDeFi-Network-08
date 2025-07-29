import { useState, useCallback } from "react"

export interface FusionSwapParams {
  fromChainId: number
  toChainId: number
  fromToken: string
  toToken: string
  amount: string
  fromAddress: string
  toAddress: string
  hashlock?: string
  timelock?: number
}

export interface FusionSwapQuote {
  estimatedTime: string
  fee: string
  minimumAmount: string
  maximumAmount: string
  exchangeRate: string
  provider: string
  hashlock?: string
  timelock?: number
}

export interface FusionSwapResult {
  txHash: string
  status: "pending" | "confirmed" | "failed"
  bridgeId?: string
  estimatedCompletion?: number
}

export interface FusionSwapError {
  message: string
}

export function useFusionSwap() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quote, setQuote] = useState<FusionSwapQuote | null>(null)
  const [result, setResult] = useState<FusionSwapResult | null>(null)

  // Fetch quote from Fusion+ API via proxy
  const fetchQuote = useCallback(async (params: FusionSwapParams) => {
    setLoading(true)
    setError(null)
    setQuote(null)
    try {
      const res = await fetch("/api/proxy/fusion/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error("Failed to fetch quote")
      const data = await res.json()
      setQuote(data)
      return data as FusionSwapQuote
    } catch (e: any) {
      setError(e.message || "Unknown error")
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  // Submit swap via Fusion+ API proxy
  const submitSwap = useCallback(async (params: FusionSwapParams) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/proxy/fusion/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error("Failed to submit swap")
      const data = await res.json()
      setResult(data)
      return data as FusionSwapResult
    } catch (e: any) {
      setError(e.message || "Unknown error")
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    quote,
    result,
    fetchQuote,
    submitSwap,
  }
}
