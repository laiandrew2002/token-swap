import { Token } from "@/types"

/**
 * Calculate token amount from USD value
 * Formula: Token Amount = USD / Token Price
 */
export function calculateTokenAmount(
  usdAmount: number,
  tokenPrice: number
): number {
  if (tokenPrice <= 0 || usdAmount <= 0) {
    return 0
  }

  return usdAmount / tokenPrice
}

/**
 * Calculate both source and target token amounts from USD
 */
export function calculateSwapAmounts(
  usdAmount: number,
  sourcePrice: number,
  targetPrice: number
): {
  sourceAmount: number
  targetAmount: number
} {
  return {
    sourceAmount: calculateTokenAmount(usdAmount, sourcePrice),
    targetAmount: calculateTokenAmount(usdAmount, targetPrice),
  }
}

/**
 * Validate USD input
 */
export function validateUSDInput(value: string): {
  isValid: boolean
  error?: string
} {
  if (!value || value.trim() === "") {
    return { isValid: false, error: "Please enter an amount" }
  }

  const numValue = parseFloat(value)
  if (isNaN(numValue)) {
    return { isValid: false, error: "Invalid number" }
  }

  if (numValue < 0) {
    return { isValid: false, error: "Amount must be positive" }
  }

  if (numValue > 1000000000) {
    return { isValid: false, error: "Amount too large" }
  }

  return { isValid: true }
}

