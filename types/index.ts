export interface Token {
  symbol: string
  chainId: string
  address: string
  name: string
  decimals: number
  icon?: string
}

export interface PriceInfo {
  price: number
  chainId: string
  assetTokenAddress: string
}

export interface TokenInfo {
  symbol: string
  chainId: string
  address: string
  name: string
  decimals: number
}

export interface SwapState {
  sourceToken: Token | null
  targetToken: Token | null
  usdAmount: string
}

export interface ChainInfo {
  id: string
  name: string
  shortName: string
}

