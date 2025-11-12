"use client"

import { useState, useRef } from "react"
import { Token } from "@/types"
import { TokenSelector } from "@/components/token-selector"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { parseNumericInput, formatUSDAmount } from "@/lib/utils/format"
import { getUserFriendlyError, isRetryableError } from "@/lib/utils/errors"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { X, AlertCircle } from "lucide-react"

interface TokenAmountInputProps {
  label: string
  token: Token | null
  onTokenSelect: (token: Token) => void
  excludeToken?: Token | null
  tokenAmount: string
  usdAmount: string
  onTokenAmountChange: (value: string) => void
  onUsdAmountChange: (value: string) => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function TokenAmountInput({
  label,
  token,
  onTokenSelect,
  excludeToken,
  tokenAmount,
  usdAmount,
  onTokenAmountChange,
  onUsdAmountChange,
  isLoading = false,
  error = null,
  onRetry,
}: TokenAmountInputProps) {
  const [isTokenFocused, setIsTokenFocused] = useState(false)
  const [isUsdFocused, setIsUsdFocused] = useState(false)
  const tokenInputRef = useRef<HTMLInputElement>(null)
  const usdInputRef = useRef<HTMLInputElement>(null)

  // Handle token amount input
  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = parseNumericInput(e.target.value)
    onTokenAmountChange(cleaned)
    // Parent component handles USD conversion
  }

  // Handle USD amount input
  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove $ and commas for parsing
    let cleaned = e.target.value.replace(/[$,]/g, "")
    cleaned = parseNumericInput(cleaned)
    onUsdAmountChange(cleaned)
    // Parent component handles token conversion
  }

  const handleClear = () => {
    onTokenAmountChange("")
    onUsdAmountChange("")
    tokenInputRef.current?.focus()
  }

  const displayTokenAmount = tokenAmount || ""
  const displayUsdAmount = usdAmount || ""
  
  // Format USD for display (when not focused)
  const formattedUsd = usdAmount && !isUsdFocused
    ? (() => {
        const num = parseFloat(usdAmount)
        if (isNaN(num)) return ""
        // Use abbreviated format for numbers >= 1000
        if (Math.abs(num) >= 1000) {
          return formatUSDAmount(num)
        }
        // For smaller numbers, show with commas and 2 decimal places
        return num.toFixed(2)
      })()
    : usdAmount

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>

      <TokenSelector
        selectedToken={token}
        onSelect={onTokenSelect}
        excludeToken={excludeToken}
      />

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-destructive">
              {getUserFriendlyError(error)}
            </p>
            {onRetry && isRetryableError(error) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="mt-2 h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/20"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Token Amount Input */}
        <div className="flex-1 w-full sm:w-auto">
          {isLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <Input
              ref={tokenInputRef}
              type="text"
              inputMode="decimal"
              value={displayTokenAmount}
              onChange={handleTokenAmountChange}
              onFocus={() => setIsTokenFocused(true)}
              onBlur={() => setIsTokenFocused(false)}
              placeholder="0.00"
              disabled={!token}
              className={cn(
                "h-12 text-2xl font-semibold px-4 w-full",
                isTokenFocused && "ring-2 ring-primary ring-offset-2",
                !token && "opacity-50 cursor-not-allowed"
              )}
            />
          )}
        </div>

        {/* USD Amount Display */}
        <div className="w-full sm:w-auto sm:shrink-0 sm:max-w-[180px]">
          {isLoading ? (
            <Skeleton className="h-12 w-full sm:w-32" />
          ) : (
            <div
              className={cn(
                "h-12 px-4 flex items-center justify-center rounded-md border relative",
                "w-full sm:w-auto text-right",
                isUsdFocused ? "bg-background ring-2 ring-primary ring-offset-2" : "bg-muted/50"
              )}
            >
              <span className="text-muted-foreground mr-1">$</span>
              <Input
                ref={usdInputRef}
                type="text"
                inputMode="decimal"
                value={isUsdFocused ? displayUsdAmount : formattedUsd}
                onChange={handleUsdAmountChange}
                onFocus={() => setIsUsdFocused(true)}
                onBlur={() => setIsUsdFocused(false)}
                placeholder="0.00"
                disabled={!token}
                className={cn(
                  "h-auto text-lg font-medium px-0 border-0 bg-transparent text-right flex-1 pr-6",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  !token && "opacity-50 cursor-not-allowed"
                )}
              />
              {usdAmount && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-accent"
                  aria-label="Clear input"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

