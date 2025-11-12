# Token Swap Calculator

A modern, production-ready web application for calculating token swap amounts across multiple blockchain networks. Built with Next.js and React, this application provides real-time token price data and instant conversion calculations with an intuitive, responsive user interface.

## ✨ Features

- **Real-time Token Pricing**: Live token prices fetched from the Funkit API
- **Multi-Chain Support**: Swap calculations across Ethereum, Polygon, and Base networks
- **Intuitive Token Selection**: Search-enabled dropdown selectors with keyboard navigation
- **Instant Calculations**: Real-time conversion calculations as you type
- **Smooth User Experience**: 
  - Loading skeletons that prevent layout shift
  - Comprehensive error handling with retry functionality
  - Subtle animations and transitions
  - Responsive design for mobile and desktop
- **Type Safety**: Full TypeScript coverage for enhanced reliability
- **Exchange Rate Display**: Real-time conversion rates between selected tokens

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe development

### State Management & Data Fetching
- **TanStack Query (React Query) 5** - Server state management with caching and refetching
- **TanStack Query DevTools** - Development debugging tools

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **Framer Motion** - Animation library
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Icon library

### API Integration
- **@funkit/api-base** - Token data and pricing API

### Testing
- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing utilities
- **Testing Library User Event** - User interaction simulation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ (20+ recommended)
- **npm** or **yarn** package manager
- **Funkit API Key** - [Get one here](https://funkit.ai)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd token-swap
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FUNKIT_API_KEY=your-api-key-here
```

> **Note**: Replace `your-api-key-here` with your actual Funkit API key.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📖 Usage

1. **Enter USD Amount**: Type the USD amount you want to swap in the input field at the top
2. **Select Source Token**: Choose the token you want to swap from using the "From" dropdown
3. **Select Target Token**: Choose the token you want to swap to using the "To" dropdown
4. **View Results**: The application automatically calculates and displays:
   - The equivalent amount in the source token
   - The equivalent amount in the target token
   - The current exchange rate between the two tokens

### Additional Features

- **Flip Tokens**: Click the circular arrow button between token selectors to quickly swap source and target tokens
- **Retry on Error**: If an API call fails, click the "Retry" button to attempt the request again
- **Real-time Updates**: Token prices automatically refresh every 30 seconds

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

## 📦 Supported Tokens

The application currently supports the following token-chain pairs:

| Token | Chain | Chain ID |
|-------|-------|----------|
| USDC  | Ethereum | 1 |
| USDT  | Polygon | 137 |
| ETH   | Base | 8453 |
| WBTC  | Ethereum | 1 |

> **Note**: The token list can be easily extended by modifying `lib/config/tokens.ts`.

## 🏗️ Project Structure

```
token-swap/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles and Tailwind imports
├── components/              # React components
│   ├── ui/                  # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── skeleton.tsx
│   ├── providers/           # Context providers
│   │   └── query-provider.tsx
│   ├── loading-skeleton.tsx # Loading state component
│   ├── swap-interface.tsx   # Main swap interface
│   ├── token-display.tsx    # Token amount display
│   ├── token-input.tsx      # USD input component
│   └── token-selector.tsx   # Token selection dropdown
├── lib/                     # Core application logic
│   ├── api/                 # API integration layer
│   │   ├── prices.ts        # Price fetching utilities
│   │   └── tokens.ts        # Token info fetching utilities
│   ├── config/              # Configuration files
│   │   └── tokens.ts        # Supported tokens configuration
│   ├── hooks/               # Custom React hooks
│   │   ├── use-token-info.ts    # Token metadata hook
│   │   └── use-token-prices.ts  # Token prices hook
│   └── utils/               # Utility functions
│       ├── calculations.ts  # Swap calculation logic
│       └── format.ts        # Number formatting utilities
├── types/                   # TypeScript type definitions
│   └── index.ts
├── tests/                   # Test files
│   ├── components/
│   └── utils/
├── public/                  # Static assets
│   └── assets/              # Token icons
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── jest.config.js           # Jest configuration
└── package.json             # Project dependencies
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Code Style

The project uses:
- **ESLint** with Next.js configuration for code linting
- **TypeScript** for type checking
- **Prettier** (if configured) for code formatting

## 🎨 Design Philosophy

This application draws design inspiration from leading cryptocurrency platforms:

- **Matcha.xyz**: Real-time rate updates, integrated search dropdowns, and flip functionality
- **Coinbase**: Professional color scheme with clear visual hierarchy
- **Robinhood**: Clean number formatting and subtle interactive animations

### Component Architecture

- **Separation of Concerns**: UI components, business logic, and API calls are clearly separated
- **Reusability**: Base UI components are built for reuse across the application
- **Type Safety**: Full TypeScript coverage ensures compile-time error detection
- **Performance**: Optimized with React Query caching, memoization, and code splitting

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project in [Vercel](https://vercel.com)
3. Add the environment variable: `NEXT_PUBLIC_FUNKIT_API_KEY`
4. Deploy!

The application will automatically build and deploy on every push to the main branch.

### Manual Deployment

```bash
npm run build
npm start
```

For production environments, ensure:
- Node.js 18+ is installed
- Environment variables are properly configured
- The build completes without errors

## 🐛 Troubleshooting

### API Key Issues

**Problem**: "API key not configured" error

**Solution**:
1. Verify `.env.local` exists in the root directory
2. Check that `NEXT_PUBLIC_FUNKIT_API_KEY` is set correctly
3. Restart the development server after adding environment variables
4. Ensure the API key is valid and has proper permissions

### Token Not Found

**Problem**: Token doesn't appear in the selector

**Solution**:
1. Verify the token is configured in `lib/config/tokens.ts`
2. Check that the chain ID and symbol match the Funkit API
3. Inspect the browser console for API errors
4. Verify the token exists on the specified chain

### Build Errors

**Problem**: Build fails during `npm run build`

**Solution**:
1. Run `npm install` to ensure all dependencies are installed
2. Check TypeScript errors: `npx tsc --noEmit`
3. Verify Node.js version is 18 or higher: `node --version`
4. Clear `.next` directory and rebuild: `rm -rf .next && npm run build`

### Price Not Updating

**Problem**: Token prices don't refresh

**Solution**:
1. Check network connectivity
2. Verify API key is valid and not rate-limited
3. Check browser console for API errors
4. Prices refresh every 30 seconds automatically

## 📝 API Integration

The application uses the Funkit API for token data and pricing:

### Endpoints Used

1. **`getAssetErc20ByChainAndSymbol`**: Fetches token metadata (address, decimals, name)
2. **`getAssetPriceInfo`**: Fetches current token price by chain ID and token address

### Caching Strategy

- **Token Info**: Cached for 5 minutes
- **Token Prices**: Cached for 30 seconds with automatic background refetching

### Error Handling

- Network errors are caught and displayed with retry options
- Invalid API responses are handled gracefully
- User-friendly error messages are shown inline

## 🔐 Security Considerations

- API keys are stored in environment variables (never committed to version control)
- Client-side API calls use `NEXT_PUBLIC_` prefix for Next.js environment variables
- Input validation prevents invalid USD amounts
- TypeScript provides compile-time type safety

## 📄 License

This project is created as a take-home assignment.

## 🙏 Acknowledgments

- **Funkit** - Token data and pricing API
- **shadcn/ui** - Beautiful, accessible component library
- **TanStack Query** - Excellent data fetching patterns
- **Design Inspiration** - Matcha.xyz, Coinbase, and Robinhood

## 🤝 Contributing

This is a take-home assignment project. For questions or issues, please refer to the project maintainer.

---

Built with ❤️ using Next.js and React
