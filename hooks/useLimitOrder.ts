import { useCallback } from "react"

export interface LimitOrder {
  id: string
  fromToken: string
  toToken: string
  amount: string
  targetPrice: string
  expiry: string
  slippage: string
  status: "active" | "filled" | "cancelled" | "expired"
  createdAt: string
  txHash?: string
}

export interface PlaceLimitOrderInput {
  fromToken: string
  toToken: string
  amount: string
  targetPrice: string
  expiry: string
  slippage: string
}

export function useLimitOrder(proxyUrl: string = "/api/proxy") {
  // Place a new limit order
  const placeLimitOrder = useCallback(async (order: PlaceLimitOrderInput) => {
    const res = await fetch(`${proxyUrl}/limit-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
    if (!res.ok) throw new Error("Failed to place limit order")
    return res.json()
  }, [proxyUrl])

  // Fetch all open/filled/cancelled orders
  const fetchOrders = useCallback(async () => {
    const res = await fetch(`${proxyUrl}/limit-order`, { method: "GET" })
    if (!res.ok) throw new Error("Failed to fetch orders")
    return res.json() as Promise<LimitOrder[]>
  }, [proxyUrl])

  // Cancel a limit order by ID
  const cancelOrder = useCallback(async (orderId: string) => {
    const res = await fetch(`${proxyUrl}/limit-order/${orderId}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to cancel order")
    return res.json()
  }, [proxyUrl])

  return { placeLimitOrder, fetchOrders, cancelOrder }
}
