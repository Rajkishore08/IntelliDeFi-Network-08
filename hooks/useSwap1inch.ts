import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

export interface SwapQuoteParams {
  chainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string; // in wei
}

export interface SwapQuoteResult {
  toTokenAmount: string;
  fromTokenAmount: string;
  estimatedGas: string;
  // ...add more fields as needed from 1inch API response
}

export function useSwapQuote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<SwapQuoteResult | null>(null);

  const fetchQuote = useCallback(async (params: SwapQuoteParams) => {
    setLoading(true);
    setError(null);
    setQuote(null);
    try {
      const resp = await fetch('http://localhost:3000/api/proxy/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chainId: params.chainId, params }),
      });
      if (!resp.ok) throw new Error('Failed to fetch quote');
      const data = await resp.json();
      setQuote(data);
      setLoading(false);
      return data;
    } catch (e: any) {
      setError(e.message || 'Error fetching quote');
      setLoading(false);
      return null;
    }
  }, []);

  return { quote, loading, error, fetchQuote };
}

export interface SwapSubmitParams extends SwapQuoteParams {
  fromAddress: string;
  slippage: number;
}

export function useSwapSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const submitSwap = useCallback(async (params: SwapSubmitParams) => {
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const resp = await fetch('http://localhost:3000/api/proxy/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chainId: params.chainId, params }),
      });
      if (!resp.ok) throw new Error('Failed to fetch swap tx');
      const data = await resp.json();
      if (!data.tx) throw new Error('No tx object returned');
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const txResponse = await signer.sendTransaction({
          ...data.tx,
          value: data.tx.value ? ethers.BigNumber.from(data.tx.value) : undefined,
        });
        setTxHash(txResponse.hash);
        setLoading(false);
        return txResponse.hash;
      } else {
        throw new Error('No wallet found');
      }
    } catch (e: any) {
      setError(e.message || 'Swap failed');
      setLoading(false);
      return null;
    }
  }, []);

  return { txHash, loading, error, submitSwap };
}

// Example usage in a SwapPanel component
// import { useSwapQuote, useSwapSubmit } from './hooks/useSwap1inch';
// const { quote, loading: quoteLoading, error: quoteError, fetchQuote } = useSwapQuote();
// const { txHash, loading: swapLoading, error: swapError, submitSwap } = useSwapSubmit();
//
// Call fetchQuote({ chainId, fromTokenAddress, toTokenAddress, amount }) to get a quote
// Call submitSwap({ chainId, fromTokenAddress, toTokenAddress, amount, fromAddress, slippage }) to submit a swap
