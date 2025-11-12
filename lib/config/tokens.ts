import { Token, ChainInfo } from "@/types";

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
};

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: "USDC",
    chainId: "1",
    address: "",
    name: "USD Coin",
    decimals: 6,
    icon: "/assets/usdc.svg",
  },
  {
    symbol: "USDT",
    chainId: "137",
    address: "",
    name: "Tether USD",
    decimals: 6,
    icon: "/assets/usdt.svg",
  },
  {
    symbol: "WBTC",
    chainId: "1",
    address: "",
    name: "Wrapped Bitcoin",
    decimals: 8,
    icon: "/assets/btc.svg",
  },
  {
    symbol: "ETH",
    chainId: "8453",
    address: "",
    name: "Ethereum",
    decimals: 18,
    icon: "/assets/eth.svg",
  },
  {
    symbol: "UNI",
    chainId: "1",
    address: "",
    name: "Uniswap",
    decimals: 18,
    icon: "/assets/uni.svg",
  },
  {
    symbol: "LINK",
    chainId: "1",
    address: "",
    name: "Chainlink",
    decimals: 18,
    icon: "/assets/link.svg",
  },
  {
    symbol: "AAVE",
    chainId: "1",
    address: "",
    name: "Aave",
    decimals: 18,
    icon: "/assets/aave.svg",
  },
  {
    symbol: "MATIC",
    chainId: "137",
    address: "",
    name: "Polygon",
    decimals: 18,
    icon: "/assets/matic.svg",
  },
  {
    symbol: "SUSHI",
    chainId: "137",
    address: "",
    name: "SushiSwap",
    decimals: 18,
    icon: "/assets/sushi.svg",
  },
];

// Helper function to get chain info
export function getChainInfo(chainId: string): ChainInfo | undefined {
  return CHAINS[chainId];
}

// Helper function to get token by symbol and chain
export function getToken(symbol: string, chainId: string): Token | undefined {
  return SUPPORTED_TOKENS.find(
    (token) => token.symbol === symbol && token.chainId === chainId
  );
}
