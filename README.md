# Token Swap Interface

A modern, production-ready token swap calculator built with Next.js, React 19, TypeScript, and TanStack Query. This application allows users to explore potential token swaps by selecting two tokens and inputting a USD amount to see equivalent amounts in both tokens.

## 🚀 Features

- **Real-time Token Pricing**: Fetches live token prices using the Funkit API
- **Intuitive Token Selection**: Search-enabled dropdown with keyboard navigation
- **Instant Calculations**: Real-time conversion calculations as you type
- **Smooth UX**: Loading skeletons, error states with retry, and subtle animations
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Type-Safe**: Full TypeScript coverage for reliability

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0
- **TypeScript**: Full type safety
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui with custom theme
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **API**: @funkit/api-base for token data and pricing
- **Testing**: Jest + React Testing Library

## 📋 Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm or yarn
- Funkit API key ([Get one here](https://funkit.ai))

## 🏃 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd token-swap
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FUNKIT_API_KEY=your-api-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage report:

```bash
npm run test:coverage
```

## 📦 Supported Tokens

The application currently supports the following token-chain pairs:

- **USDC** on Ethereum (Chain ID: 1)
- **USDT** on Polygon (Chain ID: 137)
- **ETH** on Base (Chain ID: 8453)
- **WBTC** on Ethereum (Chain ID: 1)

The token list is easily extensible via `lib/config/tokens.ts`.

## 🎨 Design Decisions

### UX Patterns Borrowed from Leading Platforms

#### From Matcha.xyz
- **Instant Swap Preview**: Real-time rate updates as users input USD amounts
- **Token Selector with Search**: Dropdown with integrated search (not a modal) for faster interaction
- **Flip Button**: Quick swap between source and target tokens with smooth animation

#### From Coinbase
- **Conservative Color Scheme**: Grays and blues (#0052ff primary) for a professional, trustworthy feel
- **Clear Visual Hierarchy**: USD input at top, token amounts displayed below with clear labels
- **Skeleton Loaders**: Loading states that match the final content shape to prevent layout shift

#### From Robinhood
- **Clean Number Formatting**: Commas and appropriate decimal places (e.g., "1,234.56")
- **Subtle Hover States**: Scale transforms on interactive elements (flip button, token selector)
- **Focus Ring Animations**: Smooth ring animations on input focus for clear feedback

### Component Architecture

The application follows a component-driven design:

- **Base UI Components** (`components/ui/`): Reusable shadcn/ui components (Button, Input, Card, Skeleton)
- **Feature Components** (`components/`): Domain-specific components (TokenSelector, TokenInput, TokenDisplay, SwapInterface)
- **Custom Hooks** (`lib/hooks/`): TanStack Query hooks for data fetching with proper caching
- **Utilities** (`lib/utils/`): Pure functions for formatting and calculations

### State Management Strategy

- **Server State**: TanStack Query handles all API calls with automatic caching, refetching, and error handling
- **Client State**: React useState for UI state (selected tokens, USD input)
- **No Global State**: Avoided Redux/Zustand as the app is simple enough for local state

### Performance Optimizations

1. **Parallel API Calls**: Source and target token prices fetched simultaneously
2. **Query Caching**: TanStack Query caches responses (5min for token info, 30s for prices)
3. **Automatic Refetching**: Prices refresh every 30 seconds for real-time updates
4. **Memoization**: Expensive calculations memoized where appropriate
5. **Code Splitting**: Next.js automatically code-splits by route

## 🔧 Key Implementation Details

### API Integration

The app uses `@funkit/api-base` with two main functions:

1. **`getAssetErc20ByChainAndSymbol`**: Fetches token metadata (address, decimals, name)
2. **`getAssetPriceInfo`**: Fetches current token price by chain ID and token address

Both are wrapped in error-handling utilities (`lib/api/tokens.ts` and `lib/api/prices.ts`).

### Calculation Logic

```
Source Token Amount = USD Amount / Source Token Price
Target Token Amount = USD Amount / Target Token Price
```

Both calculations happen in parallel and update in real-time as the user types.

### Error Handling

- **API Errors**: Displayed inline with retry buttons
- **Validation Errors**: Real-time validation on USD input (empty, invalid, negative, too large)
- **Network Errors**: Automatic retry with exponential backoff (configured in TanStack Query)

### Loading States

- **Initial Load**: Skeleton loaders that match content shape (no flash)
- **Refetching**: Subtle pulse animation on values during background refetch
- **Token Info Loading**: Disabled state on token selector while fetching address

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable: `NEXT_PUBLIC_FUNKIT_API_KEY`
4. Deploy!

The app will automatically build and deploy on every push to main.

### Manual Build

```bash
npm run build
npm start
```

## 📝 Assumptions & Trade-offs

### Assumptions

1. **API Key Required**: Assumes users have access to a Funkit API key
2. **Token Addresses**: Token addresses are fetched from the API (not hardcoded) to ensure accuracy
3. **Price Updates**: Prices refresh every 30 seconds - this balances real-time updates with API rate limits
4. **USD as Base**: All calculations use USD as the base currency

### Trade-offs

1. **No Token Icons**: Using simple colored circles with first letter instead of fetching token logos (faster, simpler)
2. **Limited Token List**: Hardcoded list of 4 tokens (easily extensible via config file)
3. **No Historical Data**: Only shows current prices, not price history or charts
4. **Client-Side Only**: No server-side rendering for token data (could improve initial load)

## 🧩 Project Structure

```
token-swap/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with QueryProvider
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles + Tailwind
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── token-selector.tsx  # Token dropdown with search
│   ├── token-input.tsx     # USD input with formatting
│   ├── token-display.tsx   # Token amount display
│   ├── swap-interface.tsx  # Main swap component
│   └── loading-skeleton.tsx
├── lib/
│   ├── api/                # API integration layer
│   ├── config/             # Token configuration
│   ├── hooks/              # TanStack Query hooks
│   └── utils/              # Formatting & calculations
├── types/                  # TypeScript types
└── tests/                  # Jest tests
```

## 🐛 Troubleshooting

### API Key Issues

If you see "API key not configured":
1. Check that `.env.local` exists
2. Verify `NEXT_PUBLIC_FUNKIT_API_KEY` is set
3. Restart the dev server after adding env vars

### Token Not Found

If a token doesn't appear:
1. Verify the token is in `lib/config/tokens.ts`
2. Check that the chain ID and symbol match the API
3. Check browser console for API errors

### Build Errors

If build fails:
1. Run `npm install` to ensure all dependencies are installed
2. Check TypeScript errors: `npx tsc --noEmit`
3. Verify Node.js version is 18+

## 📄 License

This project is created as a take-home assignment.

## 🙏 Acknowledgments

- Design inspiration from Matcha.xyz, Coinbase, and Robinhood
- shadcn/ui for beautiful, accessible components
- TanStack Query for excellent data fetching patterns
- Funkit for the token data API
