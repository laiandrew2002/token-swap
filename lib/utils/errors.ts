export enum ErrorType {
  API_KEY_MISSING = "API_KEY_MISSING",
  NETWORK_ERROR = "NETWORK_ERROR",
  TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",
  PRICE_NOT_FOUND = "PRICE_NOT_FOUND",
  INVALID_DATA = "INVALID_DATA",
  RATE_LIMIT = "RATE_LIMIT",
  UNKNOWN = "UNKNOWN",
}

const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.API_KEY_MISSING]: "API configuration is missing. Please check your settings.",
  [ErrorType.NETWORK_ERROR]: "Unable to connect to the service. Please check your internet connection and try again.",
  [ErrorType.TOKEN_NOT_FOUND]: "Token information could not be found. Please try selecting a different token.",
  [ErrorType.PRICE_NOT_FOUND]: "Price data is currently unavailable. Please try again in a moment.",
  [ErrorType.INVALID_DATA]: "Received invalid data. Please try again.",
  [ErrorType.RATE_LIMIT]: "Too many requests. Please wait a moment and try again.",
  [ErrorType.UNKNOWN]: "Something went wrong. Please try again.",
}

function categorizeError(errorMessage: string | null): ErrorType {
  if (!errorMessage) return ErrorType.UNKNOWN

  const lowerError = errorMessage.toLowerCase()

  // API key errors
  if (lowerError.includes("api key") || lowerError.includes("api_key") || lowerError.includes("api key not configured")) {
    return ErrorType.API_KEY_MISSING
  }

  // Network errors
  if (
    lowerError.includes("network") ||
    lowerError.includes("fetch") ||
    lowerError.includes("connection") ||
    lowerError.includes("timeout") ||
    lowerError.includes("failed to fetch")
  ) {
    return ErrorType.NETWORK_ERROR
  }

  // Token not found
  if (lowerError.includes("token") && (lowerError.includes("not found") || lowerError.includes("not found on chain"))) {
    return ErrorType.TOKEN_NOT_FOUND
  }

  // Price not found
  if (lowerError.includes("price") && lowerError.includes("not found")) {
    return ErrorType.PRICE_NOT_FOUND
  }

  // Rate limiting
  if (lowerError.includes("rate limit") || lowerError.includes("too many requests") || lowerError.includes("429")) {
    return ErrorType.RATE_LIMIT
  }

  // Invalid data
  if (lowerError.includes("invalid") || lowerError.includes("invalid data")) {
    return ErrorType.INVALID_DATA
  }

  return ErrorType.UNKNOWN
}

/**
 * Get user-friendly error message from backend error
 */
export function getUserFriendlyError(errorMessage: string | null): string {
  if (!errorMessage) return ERROR_MESSAGES[ErrorType.UNKNOWN]

  const errorType = categorizeError(errorMessage)
  return ERROR_MESSAGES[errorType]
}

/**
 * Check if error is retryable
 */
export function isRetryableError(errorMessage: string | null): boolean {
  if (!errorMessage) return false

  const errorType = categorizeError(errorMessage)
  
  // These errors are typically retryable
  return [
    ErrorType.NETWORK_ERROR,
    ErrorType.PRICE_NOT_FOUND,
    ErrorType.RATE_LIMIT,
    ErrorType.UNKNOWN,
  ].includes(errorType)
}

