# Edge State Checklist

This document provides a comprehensive checklist of edge cases and error states that should be tested and handled in the Token Swap Calculator application.

## 📋 Overview

This checklist covers:
- **Input Edge Cases**: Empty, invalid, boundary, and extreme values
- **API Error States**: Network failures, missing data, rate limits
- **UI Edge Cases**: Loading states, disabled states, responsive behavior
- **State Management**: Token selection, amount synchronization, flip operations
- **Accessibility**: Screen reader announcements, keyboard navigation, focus management

---

## 🔢 Input Edge Cases

### Token Amount Input

- [x] **Empty input**: Field shows placeholder "0.00", no errors
- [x] **Zero value**: "0" is accepted, USD shows "0.00"
- [x] **Negative values**: Should be prevented or handled gracefully
- [x] **Very large numbers**: Handles numbers up to token's max supply
- [x] **Decimal precision**: Respects token decimals (e.g., 6 for USDC, 18 for ETH)
- [x] **Leading zeros**: "000123" should normalize to "123"
- [x] **Multiple decimal points**: Only first decimal point accepted
- [x] **Non-numeric characters**: Filtered out (letters, special chars except ".")
- [x] **Scientific notation**: Should be handled or prevented
- [x] **Copy-paste invalid data**: Should be sanitized on paste

### USD Amount Input

- [x] **Empty input**: Field shows placeholder "0.00"
- [x] **Zero value**: "0" accepted, token amount shows "0.00"
- [x] **Negative values**: Should be prevented or handled gracefully
- [x] **Very large numbers**: Abbreviated format (M, B, T) when >= 1,000,000
- [x] **Decimal precision**: Two decimal places for USD
- [x] **Currency symbols**: "$" prefix displayed but not editable
- [x] **Comma separators**: Removed for parsing, added for display
- [x] **Copy-paste with formatting**: "$1,234.56" should parse to "1234.56"
- [x] **Abbreviation threshold**: Numbers >= 1M show abbreviated (1.5M, 1.5B, 1.5T)
- [x] **Abbreviation precision**: Abbreviated values show 2 decimal places (1.50M)

### Bidirectional Conversion

- [x] **Token → USD conversion**: Updates USD when token amount changes
- [x] **USD → Token conversion**: Updates token amount when USD changes
- [x] **Circular update prevention**: Last edited field determines conversion direction
- [x] **Simultaneous editing**: No infinite loops when both fields edited quickly
- [x] **Price not loaded**: Shows empty/placeholder until prices available
- [x] **Price changes during input**: Handles price updates gracefully
- [x] **Zero price**: Handles division by zero (price = 0) gracefully

---

## 🔌 API Error States

### Token Info API (`getTokenInfo`)

- [x] **API key missing**: Shows user-friendly error with no retry button
- [x] **Network error**: Shows retryable error with "Try Again" button
- [x] **Token not found**: Shows error, suggests selecting different token
- [x] **Invalid chain ID**: Handles gracefully with error message
- [x] **Timeout**: Shows network error with retry option
- [x] **Rate limit (429)**: Shows rate limit error with retry button
- [x] **Invalid response format**: Shows "invalid data" error
- [x] **Missing address in response**: Handles gracefully, shows error
- [x] **Missing decimals in response**: Falls back to default (18)

### Price API (`getTokenPrice`)

- [x] **API key missing**: Shows user-friendly error
- [x] **Network error**: Shows retryable error with "Try Again" button
- [x] **Price not found**: Shows retryable error (price may be temporarily unavailable)
- [x] **Invalid token address**: Handles gracefully
- [x] **Zero price returned**: Handles division by zero in calculations
- [x] **Negative price**: Handles invalid price data
- [x] **Timeout**: Shows network error with retry
- [x] **Rate limit (429)**: Shows rate limit error with retry
- [x] **Price update during calculation**: Handles price changes gracefully

### Error Categorization

- [x] **API key errors**: Categorized correctly, no retry button
- [x] **Network errors**: Categorized correctly, shows retry button
- [x] **Token not found**: Categorized correctly, no retry button
- [x] **Price not found**: Categorized correctly, shows retry button
- [x] **Rate limit**: Categorized correctly, shows retry button
- [x] **Invalid data**: Categorized correctly, shows retry button
- [x] **Unknown errors**: Falls back to generic message, shows retry button

---

## 🎨 UI Edge Cases

### Token Selection

- [x] **No token selected**: Inputs disabled, placeholders shown
- [x] **Same token selected for source and target**: Target excludes source token
- [x] **Token selection during loading**: Handles gracefully
- [x] **Token selection during error**: Allows retry or new selection
- [x] **Search with no results**: Shows "No tokens found" message
- [x] **Search with special characters**: Handles special chars in search
- [x] **Keyboard navigation**: Arrow keys navigate token list
- [x] **Enter key selection**: Selects highlighted token
- [x] **Escape key**: Closes dropdown
- [x] **Click outside**: Closes dropdown
- [x] **Rapid token switching**: Handles rapid selection changes

### Loading States

- [x] **Initial load**: Shows skeletons for inputs
- [x] **Price loading**: Shows skeletons while fetching prices
- [x] **Token info loading**: Shows skeletons while fetching token info
- [x] **Loading during input**: Handles input while data loads
- [x] **Loading state persistence**: Loading state doesn't flicker
- [x] **Loading after error retry**: Shows loading state during retry

### Disabled States

- [x] **Inputs disabled when no token**: Visual indication (opacity, cursor)
- [x] **Flip button disabled**: Disabled when tokens not selected
- [x] **Clear button visibility**: Only shows when USD amount has value
- [x] **Disabled state styling**: Clear visual feedback

### Responsive Design

- [x] **Mobile viewport (< 640px)**: Inputs stack vertically
- [x] **Desktop viewport (>= 640px)**: Inputs side by side
- [x] **Tablet viewport**: Handles intermediate sizes
- [x] **Very small mobile (< 375px)**: Layout remains usable
- [x] **Large desktop (> 1920px)**: Layout scales appropriately
- [x] **Orientation change**: Handles portrait/landscape switching
- [x] **Zoom levels**: Works at 50%, 100%, 150%, 200% zoom

### Exchange Rate Display

- [x] **Rate not available**: Hidden when tokens not selected
- [x] **Rate calculation**: Shows correct rate (source/target price)
- [x] **Rate precision**: Shows 6 decimal places
- [x] **Rate updates**: Updates when prices refresh (every 30s)
- [x] **Rate during flip**: Updates correctly after flip
- [x] **Rate with zero price**: Handles gracefully (doesn't show or shows error)

---

## 🔄 State Management Edge Cases

### Token Flip Operation

- [x] **Flip with both tokens**: Swaps tokens and amounts correctly
- [x] **Flip during error**: Clears errors, refetches prices
- [x] **Flip with amounts entered**: Preserves amounts correctly
- [x] **Flip animation**: Respects reduced motion preference

### Amount Synchronization

- [x] **Source token amount change**: Updates source USD and target amounts
- [x] **Source USD amount change**: Updates source token and target amounts
- [x] **Target token amount change**: Updates target USD and source amounts
- [x] **Target USD amount change**: Updates target token and source amounts
- [x] **Rapid input changes**: No flickering or race conditions
- [x] **Input cleared**: All related amounts cleared
- [x] **Clear button**: Clears both token and USD amounts, focuses token input

### Price Updates

- [x] **Price refresh (30s interval)**: Updates automatically
- [x] **Price update during input**: Doesn't interrupt user input
- [x] **Price update after flip**: Refetches prices for new tokens
- [x] **Price update after retry**: Refetches on successful retry
- [x] **Stale price handling**: Uses cached price if available

---

## ♿ Accessibility Edge Cases

### Screen Reader Support

- [x] **Token amount input**: Has aria-label with token symbol
- [x] **USD amount input**: Has aria-label with "USD amount"
- [x] **Live regions**: aria-live="polite" for calculated amounts
- [x] **Error announcements**: aria-live="assertive" for errors
- [x] **Exchange rate**: role="status" for rate updates
- [x] **Loading states**: Announced appropriately
- [x] **Token selection**: Announced when token changes

### Keyboard Navigation

- [x] **Tab order**: Logical tab sequence through inputs
- [x] **Token selector**: Opens with Enter/Space, navigates with arrows
- [x] **Input focus**: Clear focus indicators (ring-2 ring-primary)
- [x] **Clear button**: Accessible via keyboard (Tab + Enter)
- [x] **Flip button**: Accessible via keyboard
- [x] **Escape key**: Closes dropdowns
- [x] **Enter key**: Submits token selection

### Motion Preferences

- [x] **Reduced motion**: Animations disabled when prefers-reduced-motion
- [x] **Flip animation**: Respects motion preference
- [x] **Dropdown animation**: Respects motion preference
- [x] **CSS transitions**: Disabled when reduced motion preferred

---

## 🌐 Network Edge Cases

### Connectivity

- [x] **Offline mode**: Shows network error with retry
- [x] **Slow connection**: Loading states persist appropriately
- [x] **Connection restored**: Auto-retry or manual retry works
- [x] **Intermittent connection**: Handles connection drops gracefully

### API Rate Limiting

- [x] **Rate limit hit**: Shows rate limit error with retry
- [x] **Rate limit recovery**: Retry works after waiting
- [x] **Multiple rapid requests**: Handles gracefully with caching

---

## 🔍 Data Validation Edge Cases

### Token Data

- [x] **Missing token icon**: Shows fallback (first letter of symbol)
- [x] **Invalid token icon URL**: Handles broken image gracefully
- [x] **Missing chain info**: Handles gracefully
- [x] **Invalid chain ID**: Shows error or excludes from list

### Price Data

- [x] **Zero price**: Handles division by zero
- [x] **Negative price**: Handles invalid price data
- [x] **Extremely large price**: Handles without overflow
- [x] **Extremely small price**: Handles precision correctly
- [x] **Price precision**: Handles very small price differences

### Calculation Edge Cases

- [x] **Division by zero**: Handles when price = 0
- [x] **Very large amounts**: Handles without overflow
- [x] **Very small amounts**: Handles precision correctly
- [x] **Rounding errors**: Uses appropriate decimal places
- [x] **Token decimals**: Respects different decimal places (6, 8, 18)

---

## 🧪 Testing Edge Cases

### Component Tests

- [x] **Empty state rendering**: Components render with no data
- [x] **Loading state rendering**: Skeletons display correctly
- [x] **Error state rendering**: Error messages display correctly
- [x] **User interactions**: All interactions tested (type, click, keyboard)
- [x] **Prop variations**: All prop combinations tested

---

## 📝 Notes

### Implemented ✅

All edge cases marked with [x] are currently implemented and tested in the application.

### Future Considerations

- **Wallet Integration**: Edge cases for wallet connection/disconnection
- **Transaction Simulation**: Edge cases for actual swap execution
- **Multi-token Support**: Edge cases for selecting multiple tokens
- **Price History**: Edge cases for historical price data
- **Internationalization**: Edge cases for different locales/currencies

---

## 🔗 Related Documentation

- [Error Handling](./README.md#error-handling) - Error categorization and messages
- [Testing](./README.md#testing--quality-assurance) - Test coverage and structure
- [Assumptions & Trade-offs](./README.md#assumptions--trade-offs) - Design decisions

---

**Last Updated**: 2025
**Maintained By**: Development Team

