"use client"

import { Input } from "@/components/ui/input"
import { parseNumericInput } from "@/lib/utils/format"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"

interface TokenInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
}

export function TokenInput({
  value,
  onChange,
  placeholder = "0.00",
  label = "USD Amount",
  error,
}: TokenInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = parseNumericInput(e.target.value)
    onChange(cleaned)
  }

  const handleClear = () => {
    onChange("")
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-2">
      <label htmlFor="usd-input" className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </div>
        <Input
          id="usd-input"
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`pl-8 pr-10 ${
            isFocused ? "ring-2 ring-ring ring-offset-2" : ""
          } ${error ? "border-destructive" : ""}`}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-accent"
            onClick={handleClear}
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

