import { getAssetErc20ByChainAndSymbol } from "@funkit/api-base"
import { TokenInfo } from "@/types"

const API_KEY = process.env.NEXT_PUBLIC_FUNKIT_API_KEY || ""

export interface GetTokenInfoParams {
  chainId: string
  symbol: string
}

export interface GetTokenInfoResult {
  token: TokenInfo | null
  error: string | null
}

/**
 * Fetch token information by chain ID and symbol
 * Wrapper around @funkit/api-base getAssetErc20ByChainAndSymbol
 */
export async function getTokenInfo({
  chainId,
  symbol,
}: GetTokenInfoParams): Promise<GetTokenInfoResult> {
  try {
    if (!API_KEY) {
      return {
        token: null,
        error: "API key not configured. Please set NEXT_PUBLIC_FUNKIT_API_KEY",
      }
    }

    const result = await getAssetErc20ByChainAndSymbol({
      chainId,
      symbol,
      apiKey: API_KEY,
    })

    if (!result) {
      return {
        token: null,
        error: `Token ${symbol} not found on chain ${chainId}`,
      }
    }

    // Map the API response to our TokenInfo type
    const token: TokenInfo = {
      symbol: result.symbol || symbol,
      chainId: result.chain || chainId,
      address: result.address || "",
      name: result.name || symbol,
      decimals: result.decimals || 18,
    }

    return { token, error: null }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred"
    return {
      token: null,
      error: `Failed to fetch token info: ${errorMessage}`,
    }
  }
}

/**
 * Fetch multiple token infos in parallel
 */
export async function getMultipleTokenInfos(
  params: GetTokenInfoParams[]
): Promise<GetTokenInfoResult[]> {
  const promises = params.map((param) => getTokenInfo(param))
  return Promise.all(promises)
}

