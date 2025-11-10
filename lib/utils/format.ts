/**
 * Format number with commas and appropriate decimal places
 * Inspired by Robinhood's clean number formatting
 */
export function formatNumber(
  value: number | string,
  decimals: number = 2,
  showCommas: boolean = true
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(numValue) || numValue === 0) {
    return "0"
  }

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: showCommas,
  }

  return new Intl.NumberFormat("en-US", options).format(numValue)
}

/**
 * Format USD currency
 */
export function formatUSD(value: number | string): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(numValue)) {
    return "$0.00"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

/**
 * Format token amount with appropriate decimals
 */
export function formatTokenAmount(
  value: number | string,
  tokenDecimals: number = 18
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(numValue) || numValue === 0) {
    return "0"
  }

  // Determine decimal places based on value size
  let decimals = 2
  if (numValue < 0.01) {
    decimals = 6
  } else if (numValue < 1) {
    decimals = 4
  } else if (numValue < 1000) {
    decimals = 2
  } else {
    decimals = 2
  }

  return formatNumber(numValue, decimals, true)
}

/**
 * Parse input value, removing non-numeric characters except decimal point
 */
export function parseNumericInput(value: string): string {
  // Remove everything except digits and decimal point
  const cleaned = value.replace(/[^\d.]/g, "")

  // Ensure only one decimal point
  const parts = cleaned.split(".")
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("")
  }

  return cleaned
}

