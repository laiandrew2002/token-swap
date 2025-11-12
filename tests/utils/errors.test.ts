import {
  getUserFriendlyError,
  isRetryableError,
  ErrorType,
} from "@/lib/utils/errors";

describe("getUserFriendlyError", () => {
  it("returns user-friendly message for API key errors", () => {
    const error = "API key not configured";
    const result = getUserFriendlyError(error);
    expect(result).toBe(
      "API configuration is missing. Please check your settings."
    );
  });

  it("returns user-friendly message for network errors", () => {
    const error = "Failed to fetch: Network error";
    const result = getUserFriendlyError(error);
    expect(result).toBe(
      "Unable to connect to the service. Please check your internet connection and try again."
    );
  });

  it("returns user-friendly message for token not found", () => {
    const error = "Token USDC not found on chain 1";
    const result = getUserFriendlyError(error);
    expect(result).toBe(
      "Token information could not be found. Please try selecting a different token."
    );
  });

  it("returns user-friendly message for price not found", () => {
    const error = "Price not found for token 0x123 on chain 1";
    const result = getUserFriendlyError(error);
    expect(result).toBe(
      "Price data is currently unavailable. Please try again in a moment."
    );
  });

  it("returns user-friendly message for invalid data", () => {
    const error = "Invalid price data received";
    const result = getUserFriendlyError(error);
    expect(result).toBe("Received invalid data. Please try again.");
  });

  it("returns user-friendly message for rate limit", () => {
    const error = "Rate limit exceeded";
    const result = getUserFriendlyError(error);
    expect(result).toBe(
      "Too many requests. Please wait a moment and try again."
    );
  });

  it("returns user-friendly message for unknown errors", () => {
    const error = "Some random error";
    const result = getUserFriendlyError(error);
    expect(result).toBe("Something went wrong. Please try again.");
  });

  it("handles null error", () => {
    const result = getUserFriendlyError(null);
    expect(result).toBe("Something went wrong. Please try again.");
  });

  it("handles empty string error", () => {
    const result = getUserFriendlyError("");
    expect(result).toBe("Something went wrong. Please try again.");
  });

  it("detects network errors with various keywords", () => {
    const errors = [
      "Network error occurred",
      "Failed to fetch data",
      "Connection timeout",
      "Connection failed",
    ];

    errors.forEach((error) => {
      const result = getUserFriendlyError(error);
      expect(result).toBe(
        "Unable to connect to the service. Please check your internet connection and try again."
      );
    });
  });

  it("detects rate limit errors", () => {
    const errors = ["Rate limit exceeded", "Too many requests", "Error 429"];

    errors.forEach((error) => {
      const result = getUserFriendlyError(error);
      expect(result).toBe(
        "Too many requests. Please wait a moment and try again."
      );
    });
  });
});

describe("isRetryableError", () => {
  it("returns true for network errors", () => {
    expect(isRetryableError("Network error")).toBe(true);
    expect(isRetryableError("Failed to fetch")).toBe(true);
    expect(isRetryableError("Connection timeout")).toBe(true);
  });

  it("returns true for price not found errors", () => {
    expect(isRetryableError("Price not found")).toBe(true);
  });

  it("returns true for rate limit errors", () => {
    expect(isRetryableError("Rate limit exceeded")).toBe(true);
    expect(isRetryableError("Too many requests")).toBe(true);
  });

  it("returns true for unknown errors", () => {
    expect(isRetryableError("Some random error")).toBe(true);
  });

  it("returns false for API key errors", () => {
    expect(isRetryableError("API key not configured")).toBe(false);
  });

  it("returns false for token not found errors", () => {
    expect(isRetryableError("Token not found")).toBe(false);
  });

  it("returns false for invalid data errors", () => {
    expect(isRetryableError("Invalid data received")).toBe(false);
  });

  it("returns false for null error", () => {
    expect(isRetryableError(null)).toBe(false);
  });

  it("returns false for empty string error", () => {
    expect(isRetryableError("")).toBe(false);
  });
});
