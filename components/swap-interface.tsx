"use client"

import { useState, useMemo } from "react"
import { Token } from "@/types"
import { TokenInput } from "@/components/token-input"
import { TokenSelector } from "@/components/token-selector"
import { TokenDisplay } from "@/components/token-display"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, TrendingUp } from "lucide-react"
import { useTokenInfo } from "@/lib/hooks/use-token-info"
import { useTokenPrices } from "@/lib/hooks/use-token-prices"
import { calculateSwapAmounts } from "@/lib/utils/calculations"
import { validateUSDInput } from "@/lib/utils/calculations"
import { useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"

export function SwapInterface() {
  const [usdAmount, setUsdAmount] = useState("")
  const [sourceToken, setSourceToken] = useState<Token | null>(null)
  const [targetToken, setTargetToken] = useState<Token | null>(null)
  const [inputError, setInputError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  // Fetch token info for source token (to get address)
  const sourceTokenInfo = useTokenInfo(
    sourceToken
      ? { chainId: sourceToken.chainId, symbol: sourceToken.symbol }
      : null
  )

  // Fetch token info for target token (to get address)
  const targetTokenInfo = useTokenInfo(
    targetToken
      ? { chainId: targetToken.chainId, symbol: targetToken.symbol }
      : null
  )

  // Derive tokens with addresses from API responses (avoiding useEffect state updates)
  const sourceTokenWithAddress = useMemo(() => {
    if (sourceToken && sourceTokenInfo.data?.token) {
      return {
        ...sourceToken,
        address: sourceTokenInfo.data.token.address,
      }
    }
    return sourceToken
  }, [sourceToken, sourceTokenInfo.data])

  const targetTokenWithAddress = useMemo(() => {
    if (targetToken && targetTokenInfo.data?.token) {
      return {
        ...targetToken,
        address: targetTokenInfo.data.token.address,
      }
    }
    return targetToken
  }, [targetToken, targetTokenInfo.data])

  // Fetch prices for both tokens
  const prices = useTokenPrices({
    sourceToken: sourceTokenWithAddress?.address ? sourceTokenWithAddress : null,
    targetToken: targetTokenWithAddress?.address ? targetTokenWithAddress : null,
  })

  // Calculate amounts
  const usdValue = parseFloat(usdAmount) || 0
  const validation = validateUSDInput(usdAmount)
  const isValidInput = validation.isValid && usdValue > 0

  const sourceAmount =
    isValidInput && prices.sourcePrice
      ? calculateSwapAmounts(usdValue, prices.sourcePrice, prices.targetPrice || 0)
          .sourceAmount
      : null

  const targetAmount =
    isValidInput && prices.targetPrice
      ? calculateSwapAmounts(usdValue, prices.sourcePrice || 0, prices.targetPrice)
          .targetAmount
      : null

  // Handle USD input change
  const handleUSDChange = (value: string) => {
    setUsdAmount(value)
    const validation = validateUSDInput(value)
    setInputError(validation.error || null)
  }

  // Handle flip tokens
  const handleFlip = () => {
    const temp = sourceToken
    setSourceToken(targetToken)
    setTargetToken(temp)
    // Invalidate price queries to refetch
    queryClient.invalidateQueries({ queryKey: ["tokenPrice"] })
  }

  // Retry price fetch
  const handleRetryPrices = () => {
    queryClient.invalidateQueries({ queryKey: ["tokenPrice"] })
  }

  // Retry token info fetch
  const handleRetrySourceInfo = () => {
    queryClient.invalidateQueries({
      queryKey: ["tokenInfo", sourceToken?.chainId, sourceToken?.symbol],
    })
  }

  const handleRetryTargetInfo = () => {
    queryClient.invalidateQueries({
      queryKey: ["tokenInfo", targetToken?.chainId, targetToken?.symbol],
    })
  }

  const isLoading =
    sourceTokenInfo.isLoading ||
    targetTokenInfo.isLoading ||
    (sourceToken && !sourceTokenWithAddress?.address) ||
    (targetToken && !targetTokenWithAddress?.address)

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <Card className="w-full border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center bg-linear-to-r from-primary to-primary-foreground text-transparent bg-clip-text">
            Token Swap Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TokenInput
            value={usdAmount}
            onChange={handleUSDChange}
            error={inputError || undefined}
          />

          {/* Token Selectors and Flip Button */}
          <div className="space-y-4">
            {/* Source Token */}
            <div className="space-y-4">
              <TokenSelector
                selectedToken={sourceToken}
                onSelect={setSourceToken}
                label="From"
                excludeToken={targetToken}
              />
              {sourceTokenInfo.data?.error && (
                <div className="text-sm text-destructive flex items-center gap-2">
                  <span>{sourceTokenInfo.data.error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetrySourceInfo}
                    className="h-6 text-xs"
                  >
                    Retry
                  </Button>
                </div>
              )}
            </div>

            {/* Flip Button */}
            <div className="flex justify-center -my-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={handleFlip}
                  aria-label="Flip tokens"
                  disabled={!sourceToken || !targetToken}
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Target Token */}
            <div className="space-y-4">
              <TokenSelector
                selectedToken={targetToken}
                onSelect={setTargetToken}
                label="To"
                excludeToken={sourceToken}
              />
              {targetTokenInfo.data?.error && (
                <div className="text-sm text-destructive flex items-center gap-2">
                  <span>{targetTokenInfo.data.error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetryTargetInfo}
                    className="h-6 text-xs"
                  >
                    Retry
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {(sourceToken && targetToken) && (
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium">
                  1 {sourceToken.symbol} = {prices.rate?.toFixed(6)} {targetToken.symbol}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TokenDisplay
                  token={sourceToken}
                  amount={sourceAmount}
                  isLoading={
                    isLoading ||
                    !!(sourceToken && prices.isLoading && !prices.sourceError)
                  }
                  error={
                    sourceTokenInfo.data?.error ||
                    (prices.sourceError && sourceToken ? prices.sourceError : null)
                  }
                  onRetry={
                    prices.sourceError && sourceToken
                      ? handleRetryPrices
                      : sourceTokenInfo.data?.error
                        ? handleRetrySourceInfo
                        : undefined
                  }
                  label="From Amount"
                />
                <TokenDisplay
                  token={targetToken}
                  amount={targetAmount}
                  isLoading={
                    isLoading ||
                    !!(targetToken && prices.isLoading && !prices.targetError)
                  }
                  error={
                    targetTokenInfo.data?.error ||
                    (prices.targetError && targetToken ? prices.targetError : null)
                  }
                  onRetry={
                    prices.targetError && targetToken
                      ? handleRetryPrices
                      : targetTokenInfo.data?.error
                        ? handleRetryTargetInfo
                        : undefined
                  }
                  label="To Amount"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

