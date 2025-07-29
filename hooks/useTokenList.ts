import { useState, useCallback } from 'react';

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
}

export function useTokenList(chainId: number) {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('http://localhost:3000/api/proxy/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chainId }),
      });
      if (!resp.ok) throw new Error('Failed to fetch tokens');
      const data = await resp.json();
      // 1inch returns tokens as an object, convert to array
      const tokenArr = Object.values(data.tokens || {}) as TokenInfo[];
      setTokens(tokenArr);
      setLoading(false);
      return tokenArr;
    } catch (e: any) {
      setError(e.message || 'Error fetching tokens');
      setLoading(false);
      return [];
    }
  }, [chainId]);

  return { tokens, loading, error, fetchTokens };
}
