"use client";

import { useState, useRef, useEffect } from "react";
import { Token, ChainInfo } from "@/types";
import { SUPPORTED_TOKENS, getChainInfo } from "@/lib/config/tokens";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TokenSelectorProps {
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  label?: string;
  excludeToken?: Token | null;
}

export function TokenSelector({
  selectedToken,
  onSelect,
  label = "Select Token",
  excludeToken,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredTokens = SUPPORTED_TOKENS.filter((token) => {
    const matchesSearch =
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase());
    const notExcluded =
      !excludeToken ||
      token.symbol !== excludeToken.symbol ||
      token.chainId !== excludeToken.chainId;
    return matchesSearch && notExcluded;
  });

  // Reset highlighted index when search changes, only if not already 0
  if (highlightedIndex !== 0 && searchQuery !== "") {
    setHighlightedIndex(0);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredTokens.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredTokens[highlightedIndex]) {
          handleSelectToken(filteredTokens[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery("");
        break;
    }
  };

  const handleSelectToken = (token: Token) => {
    onSelect(token);
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(0);
  };

  const selectedChainInfo = selectedToken
    ? getChainInfo(selectedToken.chainId)
    : null;

  return (
    <div ref={containerRef} className="relative w-full">
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-between h-auto min-h-[56px] px-4 py-3",
          !selectedToken && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedToken ? (
            <>
              {selectedToken.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedToken.icon}
                  alt={selectedToken.symbol}
                  className="shrink-0 w-8 h-8 rounded-full bg-primary/10 object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {selectedToken.symbol.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <div className="font-medium truncate">
                  {selectedToken.symbol}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {selectedToken.name}
                </div>
              </div>
              {selectedChainInfo && (
                <div className="shrink-0 px-2 py-1 text-xs bg-secondary rounded">
                  {selectedChainInfo.shortName}
                </div>
              )}
            </>
          ) : (
            <span>{label}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2"
          >
            <Card className="p-2 shadow-lg border">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                  onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div
                ref={listRef}
                className="max-h-60 overflow-y-auto"
                role="listbox"
              >
                {filteredTokens.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No tokens found
                  </div>
                ) : (
                  filteredTokens.map((token, index) => {
                    const chainInfo = getChainInfo(token.chainId);
                    const isHighlighted = index === highlightedIndex;

                    return (
                      <motion.button
                        key={`${token.symbol}-${token.chainId}`}
                        type="button"
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
                          isHighlighted
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        )}
                        onClick={() => handleSelectToken(token)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        role="option"
                        aria-selected={isHighlighted}
                      >
                        {token.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={token.icon}
                            alt={token.symbol}
                            className="shrink-0 w-8 h-8 rounded-full bg-primary/10 object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {token.symbol.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {token.symbol}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {token.name}
                          </div>
                        </div>
                        {chainInfo && (
                          <div className="shrink-0 px-2 py-1 text-xs bg-secondary rounded">
                            {chainInfo.shortName}
                          </div>
                        )}
                      </motion.button>
                    );
                  })
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
