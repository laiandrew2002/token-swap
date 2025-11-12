import {
  formatNumber,
  formatUSD,
  formatTokenAmount,
  formatUSDAmount,
  parseNumericInput,
} from "@/lib/utils/format";

describe("formatNumber", () => {
  it("formats numbers with commas", () => {
    expect(formatNumber(1000)).toBe("1,000.00");
    expect(formatNumber(1000000)).toBe("1,000,000.00");
  });

  it("formats with specified decimal places", () => {
    expect(formatNumber(100, 0)).toBe("100");
    expect(formatNumber(100.123, 3)).toBe("100.123");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("handles string inputs", () => {
    expect(formatNumber("1000")).toBe("1,000.00");
  });
});

describe("formatUSD", () => {
  it("formats as currency", () => {
    expect(formatUSD(100)).toBe("$100.00");
    expect(formatUSD(1000)).toBe("$1,000.00");
  });

  it("handles zero", () => {
    expect(formatUSD(0)).toBe("$0.00");
  });

  it("handles string inputs", () => {
    expect(formatUSD("100")).toBe("$100.00");
  });
});

describe("formatTokenAmount", () => {
  it("formats small amounts with more decimals", () => {
    const result = formatTokenAmount(0.001, 18);
    expect(result).toMatch(/0\.00/);
  });

  it("formats larger amounts with fewer decimals", () => {
    const result = formatTokenAmount(100, 18);
    expect(result).toMatch(/100/);
  });

  it("handles zero", () => {
    expect(formatTokenAmount(0)).toBe("0");
  });

  it("handles string inputs", () => {
    expect(formatTokenAmount("100")).toBeTruthy();
  });
});

describe("formatUSDAmount", () => {
  it("formats trillions", () => {
    expect(formatUSDAmount(1_500_000_000_000)).toBe("1.50T");
    expect(formatUSDAmount(2_000_000_000_000)).toBe("2.00T");
  });

  it("formats billions", () => {
    expect(formatUSDAmount(1_500_000_000)).toBe("1.50B");
    expect(formatUSDAmount(2_000_000_000)).toBe("2.00B");
  });

  it("formats millions", () => {
    expect(formatUSDAmount(1_500_000)).toBe("1.50M");
    expect(formatUSDAmount(2_000_000)).toBe("2.00M");
  });

  it("formats numbers less than million without abbreviation", () => {
    expect(formatUSDAmount(1000)).toBe("1000.00");
    expect(formatUSDAmount(500)).toBe("500.00");
    expect(formatUSDAmount(99.99)).toBe("99.99");
  });

  it("handles zero", () => {
    expect(formatUSDAmount(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatUSDAmount(-1_500_000)).toBe("-1.50M");
    expect(formatUSDAmount(-1000)).toBe("-1000.00");
  });

  it("handles string inputs", () => {
    expect(formatUSDAmount("1500000")).toBe("1.50M");
    expect(formatUSDAmount("1000")).toBe("1000.00");
  });

  it("handles edge cases", () => {
    expect(formatUSDAmount(999_999)).toBe("999999.00");
    expect(formatUSDAmount(1_000_000)).toBe("1.00M");
    // 999,999,999 / 1,000,000 = 999.999999, rounded to 2 decimals = 1000.00
    expect(formatUSDAmount(999_999_999)).toBe("1000.00M");
    expect(formatUSDAmount(1_000_000_000)).toBe("1.00B");
  });
});

describe("parseNumericInput", () => {
  it("removes non-numeric characters", () => {
    expect(parseNumericInput("abc123def")).toBe("123");
    expect(parseNumericInput("$1,234.56")).toBe("1234.56");
  });

  it("preserves decimal point", () => {
    expect(parseNumericInput("123.45")).toBe("123.45");
  });

  it("handles multiple decimal points", () => {
    expect(parseNumericInput("123.45.67")).toBe("123.4567");
  });

  it("handles empty string", () => {
    expect(parseNumericInput("")).toBe("");
  });

  it("handles only non-numeric characters", () => {
    expect(parseNumericInput("abc")).toBe("");
  });
});
