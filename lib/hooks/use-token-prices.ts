import { useQuery } from "@tanstack/react-query";
import { getTokenPrice, type GetPriceParams } from "@/lib/api/prices";
import { Token } from "@/types";

export interface UseTokenPricesParams {
  sourceToken: Token | null;
  targetToken: Token | null;
}

export interface TokenPrices {
  sourcePrice: number | null;
  targetPrice: number | null;
  rate: number | null;
  sourceError: string | null;
  targetError: string | null;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Fetch prices for both source and target tokens in parallel
 */
export function useTokenPrices({
  sourceToken,
  targetToken,
}: UseTokenPricesParams): TokenPrices {
  const sourceQuery = useQuery({
    queryKey: ["tokenPrice", sourceToken?.chainId, sourceToken?.address],
    queryFn: () => {
      if (!sourceToken?.address) {
        throw new Error("Source token address required");
      }
      return getTokenPrice({
        chainId: sourceToken.chainId,
        assetTokenAddress: sourceToken.address,
      });
    },
    enabled: !!sourceToken?.address,
    staleTime: 30 * 1000, // 30 seconds (prices change frequently)
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  });

  const targetQuery = useQuery({
    queryKey: ["tokenPrice", targetToken?.chainId, targetToken?.address],
    queryFn: () => {
      if (!targetToken?.address) {
        throw new Error("Target token address required");
      }
      return getTokenPrice({
        chainId: targetToken.chainId,
        assetTokenAddress: targetToken.address,
      });
    },
    enabled: !!targetToken?.address,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
  let rate: number | null = null;
  if (sourceQuery.data?.price && targetQuery.data?.price) {
    rate = sourceQuery.data?.price / targetQuery.data?.price;
  }

  return {
    sourcePrice: sourceQuery.data?.price ?? null,
    targetPrice: targetQuery.data?.price ?? null,
    rate,
    sourceError: sourceQuery.data?.error ?? null,
    targetError: targetQuery.data?.error ?? null,
    isLoading: sourceQuery.isLoading || targetQuery.isLoading,
    isError: sourceQuery.isError || targetQuery.isError,
  };
}
