import { Token, ChainInfo } from "@/types"

// Chain information
export const CHAINS: Record<string, ChainInfo> = {
  "1": {
    id: "1",
    name: "Ethereum",
    shortName: "ETH",
  },
  "137": {
    id: "137",
    name: "Polygon",
    shortName: "POL",
  },
  "8453": {
    id: "8453",
    name: "Base",
    shortName: "BASE",
  },
}

// Supported tokens configuration
// Note: Token addresses are placeholders - actual addresses should be fetched from API
export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: "USDC",
    chainId: "1",
    address: "", // Will be fetched from API
    name: "USD Coin",
    decimals: 6,
    icon: "/assets/usdc.svg",
  },
  {
    symbol: "USDT",
    chainId: "137",
    address: "", // Will be fetched from API
    name: "Tether USD",
    decimals: 6,
    icon: "/assets/usdt.svg",
  },
  {
    symbol: "ETH",
    chainId: "8453",
    address: "", // Will be fetched from API
    name: "Ethereum",
    decimals: 18,
    icon: "/assets/eth.svg",
  },
  {
    symbol: "WBTC",
    chainId: "1",
    address: "", // Will be fetched from API
    name: "Wrapped Bitcoin",
    decimals: 8,
    icon: "/assets/btc.svg",
  },
  {
    symbol: "MATIC",
    chainId: "137",
    address: "", // Will be fetched from API
    name: "Polygon",
    decimals: 18,
    icon: "/assets/matic.svg",
  },
  {
    symbol: "UNI",
    chainId: "1",
    address: "", // Will be fetched from API
    name: "Uniswap",
    decimals: 18,
    icon: "/assets/uni.svg",
  },
  {
    symbol: "LINK",
    chainId: "1",
    address: "", // Will be fetched from API
    name: "Chainlink",
    decimals: 18,
    icon: "/assets/link.svg",
  },
  {
    symbol: "AAVE",
    chainId: "1",
    address: "", // Will be fetched from API
    name: "Aave",
    decimals: 18,
    icon: "/assets/aave.svg",
  },
]

// Helper function to get chain info
export function getChainInfo(chainId: string): ChainInfo | undefined {
  return CHAINS[chainId]
}

// Helper function to get token by symbol and chain
export function getToken(symbol: string, chainId: string): Token | undefined {
  return SUPPORTED_TOKENS.find(
    (token) => token.symbol === symbol && token.chainId === chainId
  )
}

