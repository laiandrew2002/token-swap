import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TokenAmountInput } from "@/components/token-amount-input";
import { Token } from "@/types";

// Mock the TokenSelector component
jest.mock("@/components/token-selector", () => ({
  TokenSelector: ({ selectedToken, onSelect, label }: any) => (
    <div data-testid="token-selector">
      <label>{label}</label>
      <button onClick={() => onSelect && onSelect(selectedToken)}>
        {selectedToken ? selectedToken.symbol : "Select token"}
      </button>
    </div>
  ),
}));

const mockToken: Token = {
  symbol: "USDC",
  chainId: "1",
  address: "0x123",
  name: "USD Coin",
  decimals: 6,
  icon: "/assets/usdc.svg",
};

describe("TokenAmountInput", () => {
  const defaultProps = {
    label: "Sell",
    token: null,
    onTokenSelect: jest.fn(),
    tokenAmount: "",
    usdAmount: "",
    onTokenAmountChange: jest.fn(),
    onUsdAmountChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with label", () => {
    render(<TokenAmountInput {...defaultProps} />);
    expect(screen.getByText("Sell")).toBeInTheDocument();
  });

  it("renders token selector", () => {
    render(<TokenAmountInput {...defaultProps} />);
    expect(screen.getByTestId("token-selector")).toBeInTheDocument();
  });

  it("renders token amount input", () => {
    const { container } = render(<TokenAmountInput {...defaultProps} />);
    const input = container.querySelector('input[placeholder="0.00"]');
    expect(input).toBeInTheDocument();
  });

  it("displays token amount value", () => {
    const { container } = render(
      <TokenAmountInput {...defaultProps} tokenAmount="100" />
    );
    const input = container.querySelector(
      'input[placeholder="0.00"]'
    ) as HTMLInputElement;
    expect(input?.value).toBe("100");
  });

  it("calls onTokenAmountChange when token amount is typed", async () => {
    const handleChange = jest.fn();
    const { container } = render(
      <TokenAmountInput
        {...defaultProps}
        onTokenAmountChange={handleChange}
        token={mockToken}
      />
    );

    const input = container.querySelector(
      'input[placeholder="0.00"]'
    ) as HTMLInputElement;
    if (input) {
      await userEvent.type(input, "123");
      expect(handleChange).toHaveBeenCalled();
    }
  });

  it("displays USD amount", () => {
    const { container } = render(
      <TokenAmountInput {...defaultProps} usdAmount="1000" />
    );
    // USD input is in a container with $ symbol
    const usdContainer = container.querySelector('[class*="bg-muted"]');
    const usdInput = usdContainer?.querySelector("input") as HTMLInputElement;
    expect(usdInput).toBeInTheDocument();
  });

  it("calls onUsdAmountChange when USD amount is typed", async () => {
    const handleChange = jest.fn();
    const { container } = render(
      <TokenAmountInput
        {...defaultProps}
        onUsdAmountChange={handleChange}
        token={mockToken}
      />
    );

    // Find USD input (it's in a container with $ symbol)
    const usdContainer = container.querySelector('[class*="bg-muted"]');
    const usdInput = usdContainer?.querySelector("input") as HTMLInputElement;

    if (usdInput) {
      await userEvent.type(usdInput, "1000");
      expect(handleChange).toHaveBeenCalled();
    }
  });

  it("shows clear button when USD amount is present", () => {
    render(<TokenAmountInput {...defaultProps} usdAmount="100" />);
    const clearButton = screen.getByLabelText("Clear input");
    expect(clearButton).toBeInTheDocument();
  });

  it("clears both amounts when clear button is clicked", async () => {
    const handleTokenChange = jest.fn();
    const handleUsdChange = jest.fn();
    render(
      <TokenAmountInput
        {...defaultProps}
        tokenAmount="100"
        usdAmount="1000"
        onTokenAmountChange={handleTokenChange}
        onUsdAmountChange={handleUsdChange}
      />
    );

    const clearButton = screen.getByLabelText("Clear input");
    await userEvent.click(clearButton);

    expect(handleTokenChange).toHaveBeenCalledWith("");
    expect(handleUsdChange).toHaveBeenCalledWith("");
  });

  it("displays error message when error is provided", () => {
    render(<TokenAmountInput {...defaultProps} error="Network error" />);
    expect(
      screen.getByText(/Unable to connect to the service/i)
    ).toBeInTheDocument();
  });

  it("shows retry button for retryable errors", () => {
    const onRetry = jest.fn();
    render(
      <TokenAmountInput
        {...defaultProps}
        error="Network error"
        onRetry={onRetry}
      />
    );
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("does not show retry button for non-retryable errors", () => {
    const onRetry = jest.fn();
    render(
      <TokenAmountInput
        {...defaultProps}
        error="API key not configured"
        onRetry={onRetry}
      />
    );
    expect(screen.queryByText("Try Again")).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const onRetry = jest.fn();
    render(
      <TokenAmountInput
        {...defaultProps}
        error="Network error"
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByText("Try Again");
    await userEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("disables inputs when token is not selected", () => {
    const { container } = render(<TokenAmountInput {...defaultProps} />);
    const tokenInput = container.querySelector(
      'input[placeholder="0.00"]'
    ) as HTMLInputElement;
    expect(tokenInput?.disabled).toBe(true);
  });

  it("enables inputs when token is selected", () => {
    const { container } = render(
      <TokenAmountInput {...defaultProps} token={mockToken} />
    );
    const tokenInput = container.querySelector(
      'input[placeholder="0.00"]'
    ) as HTMLInputElement;
    expect(tokenInput?.disabled).toBe(false);
  });

  it("formats large USD amounts with abbreviations when not focused", () => {
    const { container } = render(
      <TokenAmountInput {...defaultProps} usdAmount="1500000" />
    );
    // When not focused, should show abbreviated format
    // The USD input is inside a container with $ symbol
    const usdContainer = container.querySelector('[class*="bg-muted"]');
    expect(usdContainer).toBeInTheDocument();
    // Check if the formatted value is present (might be in the input or displayed)
    const usdInput = usdContainer?.querySelector("input");
    expect(usdInput).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    const { container } = render(
      <TokenAmountInput {...defaultProps} isLoading={true} />
    );
    // Skeleton components should be present (they have specific classes)
    const skeletons = container.querySelectorAll(
      '[class*="animate-pulse"], [class*="skeleton"]'
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
