import { useQuery } from "@tanstack/react-query"
import { getTokenInfo, type GetTokenInfoParams } from "@/lib/api/tokens"
import { TokenInfo } from "@/types"

export function useTokenInfo(params: GetTokenInfoParams | null) {
  return useQuery({
    queryKey: ["tokenInfo", params?.chainId, params?.symbol],
    queryFn: () => {
      if (!params) {
        throw new Error("Token parameters required")
      }
      return getTokenInfo(params)
    },
    enabled: !!params && !!params.chainId && !!params.symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

