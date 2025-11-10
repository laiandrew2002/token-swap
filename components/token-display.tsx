"use client"

import { Token } from "@/types"
import { formatTokenAmount } from "@/lib/utils/format"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface TokenDisplayProps {
  token: Token | null
  amount: number | null
  isLoading: boolean
  error: string | null
  onRetry?: () => void
  label?: string
}

export function TokenDisplay({
  token,
  amount,
  isLoading,
  error,
  onRetry,
  label = "Amount",
}: TokenDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="flex-1">{error}</span>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="h-8 text-xs"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (!token || amount === null || amount === 0) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">-</div>
      </div>
    )
  }

  const formattedAmount = formatTokenAmount(amount, token.decimals)

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-sm text-muted-foreground">{label}</div>
      <motion.div
        className="text-lg font-semibold"
        key={formattedAmount}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.3 }}
      >
        {formattedAmount} {token.symbol}
      </motion.div>
    </motion.div>
  )
}

