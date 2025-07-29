# IntelliDeFi Dashboard

IntelliDeFi is a next-generation DeFi dashboard for cross-chain swaps, portfolio management, and AI-powered trading strategies. Built with Next.js, TypeScript, Tailwind CSS, and ethers.js, it provides:

- Secure, proxy-based 1inch API integration (no API key leaks)
- Dynamic token lists and real-time swap quotes
- Fusion+ cross-chain swaps and bridging
- Portfolio dashboard with risk alerts and transaction history
- NFT gallery and achievement badges
- Modern, responsive UI with custom branding

## Getting Started

1. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   ```
2. **Set up environment:**
   - Copy `.env.example` to `.env` and add your 1inch API key as `1INCH_API_KEY=...`
3. **Run the app locally:**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```

## Features

- Cross-chain swaps (Fusion+)
- Portfolio and transaction history
- Risk alerts and AI agent
- NFT gallery
- Customizable UI (logo, theme)

## Project Structure

- `app/` — Next.js app directory
- `components/` — UI and feature components
- `contexts/` — React context providers
- `hooks/` — Custom React hooks
- `lib/` — Utility functions
- `public/` — Static assets (logo, images)
- `styles/` — Global styles

## License

MIT
