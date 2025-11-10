import { getAssetPriceInfo } from "@funkit/api-base"
import { PriceInfo } from "@/types"

const API_KEY = process.env.NEXT_PUBLIC_FUNKIT_API_KEY || ""

export interface GetPriceParams {
  chainId: string
  assetTokenAddress: string
}

export interface GetPriceResult {
  price: number | null
  error: string | null
}

/**
 * Fetch token price by chain ID and token address
 * Wrapper around @funkit/api-base getAssetPriceInfo
 */
export async function getTokenPrice({
  chainId,
  assetTokenAddress,
}: GetPriceParams): Promise<GetPriceResult> {
  try {
    if (!API_KEY) {
      return {
        price: null,
        error: "API key not configured. Please set NEXT_PUBLIC_FUNKIT_API_KEY",
      }
    }

    if (!assetTokenAddress) {
      return {
        price: null,
        error: "Token address is required",
      }
    }

    const result = await getAssetPriceInfo({
      chainId,
      assetTokenAddress,
      apiKey: API_KEY,
    })
    console.log("result", result)

    if (!result) {
      return {
        price: null,
        error: `Price not found for token ${assetTokenAddress} on chain ${chainId}`,
      }
    }

    // Extract price from the result
    // The API might return price in different formats, adjust as needed
    const price =
      typeof result === "object" && "unitPrice" in result
        ? Number(result.unitPrice)
        : typeof result === "number"
          ? result
          : null

    if (price === null || isNaN(price) || price <= 0) {
      return {
        price: null,
        error: "Invalid price data received",
      }
    }

    return { price, error: null }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred"
    return {
      price: null,
      error: `Failed to fetch price: ${errorMessage}`,
    }
  }
}

/**
 * Fetch multiple prices in parallel
 */
export async function getMultiplePrices(
  params: GetPriceParams[]
): Promise<GetPriceResult[]> {
  const promises = params.map((param) => getTokenPrice(param))
  return Promise.all(promises)
}

