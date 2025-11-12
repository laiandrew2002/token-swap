/**
 * Format number with commas and appropriate decimal places
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

  // Use tokenDecimals to define a sensible dynamic decimal display range, but limit min/max shown decimals
  let decimals: number

  if (numValue < 1) {
    // Show min(tokenDecimals, 6) decimals but not less than 2
    decimals = Math.min(Math.max(tokenDecimals, 2), 6)
  } else if (numValue < 1000) {
    decimals = Math.min(tokenDecimals, 4)
    decimals = Math.max(decimals, 2)
  } else {
    decimals = 2
  }

  return formatNumber(numValue, decimals, true)
}

/**
 * Format USD amount with appropriate decimals
 */
export function formatUSDAmount(value: number | string): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(numValue) || numValue === 0) {
    return "0"
  }

  const absValue = Math.abs(numValue)
  const sign = numValue < 0 ? "-" : ""

  // Trillion
  if (absValue >= 1_000_000_000_000) {
    const trillions = absValue / 1_000_000_000_000
    return `${sign}${trillions.toFixed(2)}T`
  }

  // Billion
  if (absValue >= 1_000_000_000) {
    const billions = absValue / 1_000_000_000
    return `${sign}${billions.toFixed(2)}B`
  }

  // Million
  if (absValue >= 1_000_000) {
    const millions = absValue / 1_000_000
    return `${sign}${millions.toFixed(2)}M`
  }

  return sign + numValue.toFixed(2)
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

