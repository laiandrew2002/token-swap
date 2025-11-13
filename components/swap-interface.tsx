"use client";

import { useState, useMemo, useRef } from "react";
import { Token } from "@/types";
import { TokenAmountInput } from "@/components/token-amount-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingUp } from "lucide-react";
import { useTokenInfo } from "@/lib/hooks/use-token-info";
import { useTokenPrices } from "@/lib/hooks/use-token-prices";
import { useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { formatTokenAmount } from "@/lib/utils/format";

export function SwapInterface() {
  const [sourceTokenAmount, setSourceTokenAmount] = useState("");
  const [sourceUsdAmount, setSourceUsdAmount] = useState("");
  const [targetTokenAmount, setTargetTokenAmount] = useState("");
  const [targetUsdAmount, setTargetUsdAmount] = useState("");

  const [sourceToken, setSourceToken] = useState<Token | null>(null);
  const [targetToken, setTargetToken] = useState<Token | null>(null);

  // Track which input was last edited to avoid circular updates
  const lastEditedRef = useRef<"source" | "target" | null>(null);

  const queryClient = useQueryClient();
  const shouldReduceMotion = useReducedMotion();

  // Fetch token info for source token (to get address)
  const sourceTokenInfo = useTokenInfo(
    sourceToken
      ? { chainId: sourceToken.chainId, symbol: sourceToken.symbol }
      : null
  );

  // Fetch token info for target token (to get address)
  const targetTokenInfo = useTokenInfo(
    targetToken
      ? { chainId: targetToken.chainId, symbol: targetToken.symbol }
      : null
  );

  // Derive tokens with addresses from API responses
  const sourceTokenWithAddress = useMemo(() => {
    if (sourceToken && sourceTokenInfo.data?.token) {
      return {
        ...sourceToken,
        address: sourceTokenInfo.data.token.address,
      };
    }
    return sourceToken;
  }, [sourceToken, sourceTokenInfo.data]);

  const targetTokenWithAddress = useMemo(() => {
    if (targetToken && targetTokenInfo.data?.token) {
      return {
        ...targetToken,
        address: targetTokenInfo.data.token.address,
      };
    }
    return targetToken;
  }, [targetToken, targetTokenInfo.data]);

  // Fetch prices for both tokens
  const prices = useTokenPrices({
    sourceToken: sourceTokenWithAddress?.address
      ? sourceTokenWithAddress
      : null,
    targetToken: targetTokenWithAddress?.address
      ? targetTokenWithAddress
      : null,
  });

  // Handle source token amount change (from input)
  const handleSourceTokenAmountChange = (value: string) => {
    lastEditedRef.current = "source";
    setSourceTokenAmount(value);

    // Calculate USD and target amounts
    if (
      value &&
      prices.sourcePrice &&
      prices.targetPrice &&
      prices.sourcePrice > 0 &&
      prices.targetPrice > 0
    ) {
      const sourceValue = parseFloat(value);
      if (!isNaN(sourceValue) && sourceValue > 0) {
        // Calculate USD from source token amount
        const usdValue = sourceValue * prices.sourcePrice;
        setSourceUsdAmount(usdValue.toFixed(2));

        // Calculate target token amount from USD
        const targetValue = usdValue / prices.targetPrice;
        setTargetTokenAmount(
          formatTokenAmount(targetValue, targetToken?.decimals || 18)
        );
        setTargetUsdAmount(usdValue.toFixed(2));
      } else {
        setSourceUsdAmount("");
        setTargetTokenAmount("");
        setTargetUsdAmount("");
      }
    } else {
      setSourceUsdAmount("");
      setTargetTokenAmount("");
      setTargetUsdAmount("");
    }
  };

  // Handle source USD amount change (from input)
  const handleSourceUsdAmountChange = (value: string) => {
    lastEditedRef.current = "source";
    setSourceUsdAmount(value);
    if (value && prices.sourcePrice && prices.sourcePrice > 0) {
      const usdValue = parseFloat(value);
      if (!isNaN(usdValue) && usdValue > 0) {
        // Calculate source token amount
        const tokenValue = usdValue / prices.sourcePrice;
        setSourceTokenAmount(
          formatTokenAmount(tokenValue, sourceToken?.decimals || 18)
        );

        // Calculate target amounts
        if (prices.targetPrice && prices.targetPrice > 0) {
          const targetValue = usdValue / prices.targetPrice;
          setTargetTokenAmount(
            formatTokenAmount(targetValue, targetToken?.decimals || 18)
          );
          setTargetUsdAmount(usdValue.toFixed(2));
        }
      } else {
        setSourceTokenAmount("");
        setTargetTokenAmount("");
        setTargetUsdAmount("");
      }
    } else {
      setSourceTokenAmount("");
      setTargetTokenAmount("");
      setTargetUsdAmount("");
    }
  };

  // Handle target token amount change (from input)
  const handleTargetTokenAmountChange = (value: string) => {
    lastEditedRef.current = "target";
    setTargetTokenAmount(value);

    // Calculate USD and source amounts
    if (
      value &&
      prices.sourcePrice &&
      prices.targetPrice &&
      prices.sourcePrice > 0 &&
      prices.targetPrice > 0
    ) {
      const targetValue = parseFloat(value);
      if (!isNaN(targetValue) && targetValue > 0) {
        // Calculate USD from target token amount
        const usdValue = targetValue * prices.targetPrice;
        setTargetUsdAmount(usdValue.toFixed(2));

        // Calculate source token amount from USD
        const sourceValue = usdValue / prices.sourcePrice;
        setSourceTokenAmount(
          formatTokenAmount(sourceValue, sourceToken?.decimals || 18)
        );
        setSourceUsdAmount(usdValue.toFixed(2));
      } else {
        setTargetUsdAmount("");
        setSourceTokenAmount("");
        setSourceUsdAmount("");
      }
    } else {
      setTargetUsdAmount("");
      setSourceTokenAmount("");
      setSourceUsdAmount("");
    }
  };

  // Handle target USD amount change (from input)
  const handleTargetUsdAmountChange = (value: string) => {
    lastEditedRef.current = "target";
    setTargetUsdAmount(value);
    if (value && prices.targetPrice && prices.targetPrice > 0) {
      const usdValue = parseFloat(value);
      if (!isNaN(usdValue) && usdValue > 0) {
        // Calculate target token amount
        const tokenValue = usdValue / prices.targetPrice;
        setTargetTokenAmount(
          formatTokenAmount(tokenValue, targetToken?.decimals || 18)
        );

        // Calculate source amounts
        if (prices.sourcePrice && prices.sourcePrice > 0) {
          const sourceValue = usdValue / prices.sourcePrice;
          setSourceTokenAmount(
            formatTokenAmount(sourceValue, sourceToken?.decimals || 18)
          );
          setSourceUsdAmount(usdValue.toFixed(2));
        }
      } else {
        setSourceTokenAmount("");
        setSourceUsdAmount("");
        setTargetTokenAmount("");
      }
    } else {
      setSourceTokenAmount("");
      setSourceUsdAmount("");
      setTargetTokenAmount("");
    }
  };

  // Handle flip tokens
  const handleFlip = () => {
    const tempToken = sourceToken;
    const tempAmount = sourceTokenAmount;
    const tempUsd = sourceUsdAmount;

    setSourceToken(targetToken);
    setSourceTokenAmount(targetTokenAmount);
    setSourceUsdAmount(targetUsdAmount);

    setTargetToken(tempToken);
    setTargetTokenAmount(tempAmount);
    setTargetUsdAmount(tempUsd);

    // Invalidate price queries to refetch
    queryClient.invalidateQueries({ queryKey: ["tokenPrice"] });
  };

  // Retry handlers
  const handleRetryPrices = () => {
    queryClient.invalidateQueries({ queryKey: ["tokenPrice"] });
  };

  const handleRetrySourceInfo = () => {
    queryClient.invalidateQueries({
      queryKey: ["tokenInfo", sourceToken?.chainId, sourceToken?.symbol],
    });
  };

  const handleRetryTargetInfo = () => {
    queryClient.invalidateQueries({
      queryKey: ["tokenInfo", targetToken?.chainId, targetToken?.symbol],
    });
  };

  const isLoading =
    sourceTokenInfo.isLoading ||
    targetTokenInfo.isLoading ||
    (sourceToken && !sourceTokenWithAddress?.address) ||
    (targetToken && !targetTokenWithAddress?.address);

  // Calculate exchange rate
  const exchangeRate =
    prices.sourcePrice && prices.targetPrice && prices.targetPrice > 0
      ? prices.sourcePrice / prices.targetPrice
      : null;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <Card className="w-full border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-blue-500">
            Token Swap Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sell Section */}
          <TokenAmountInput
            label="From"
            token={sourceToken}
            onTokenSelect={setSourceToken}
            excludeToken={targetToken}
            tokenAmount={sourceTokenAmount}
            usdAmount={sourceUsdAmount}
            onTokenAmountChange={handleSourceTokenAmountChange}
            onUsdAmountChange={handleSourceUsdAmountChange}
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
          />

          <div className="relative py-2">
            <div className="relative flex flex-col items-center gap-2">
              {/* Rate */}
              {sourceToken && targetToken && exchangeRate && (
                <div
                  className="flex items-center gap-2 text-sm text-muted-foreground mb-2"
                  aria-live="polite"
                  aria-atomic="true"
                  role="status"
                >
                  <TrendingUp className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <span className="font-medium">
                    1 {sourceToken.symbol} = {prices.rate?.toFixed(6)}{" "}
                    {targetToken.symbol}
                  </span>
                </div>
              )}

              {/* Flip Button */}
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                transition={shouldReduceMotion ? { duration: 0 } : undefined}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-background"
                  onClick={handleFlip}
                  aria-label="Flip tokens"
                  disabled={!sourceToken || !targetToken}
                >
                  <ArrowUpDown className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Buy Section */}
          <TokenAmountInput
            label="To"
            token={targetToken}
            onTokenSelect={setTargetToken}
            excludeToken={sourceToken}
            tokenAmount={targetTokenAmount}
            usdAmount={targetUsdAmount}
            onTokenAmountChange={handleTargetTokenAmountChange}
            onUsdAmountChange={handleTargetUsdAmountChange}
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
          />
        </CardContent>
      </Card>
    </div>
  );
}
