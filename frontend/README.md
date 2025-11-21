# HeirLock Frontend

Next.js frontend for the HeirLock Bitcoin inheritance platform on Internet Computer.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **@dfinity/agent** & **@dfinity/auth-client** for ICP integration
- **React Query** for data fetching
- **Zustand** for state management

## Getting Started

### Prerequisites

- Node.js 18+ installed
- dfx running locally with heirlock canister deployed
- Canister ID configured in `.env.local`

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file (already created with default values):

```env
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:4943
NEXT_PUBLIC_HEIRLOCK_CANISTER_ID=uxrrr-q7777-77774-qaaaq-cai
NEXT_PUBLIC_NETWORK=local
```

Update the `HEIRLOCK_CANISTER_ID` with your actual canister ID from `.dfx/local/canister_ids.json`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing/Login page
│   └── dashboard/         # Protected dashboard
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── ui/               # UI components
│   └── ...
├── lib/                   # Utilities and config
│   ├── canister/         # ICP canister integration
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand stores
│   └── utils/            # Helper functions
└── types/                # TypeScript types
```

## Features (Phase 1 - Complete)

✅ **Authentication**
- ICP identity login
- Auth state management
- Protected routes

✅ **Project Setup**
- Next.js with TypeScript
- Tailwind CSS configured
- ICP integration setup
- Canister client utilities

## Next Steps (Phase 2)

- Dashboard with balance display
- Bitcoin address management
- Inactivity status tracking
- Activity timer

## Development Notes

### Local Development

For local development, the app connects to:
- IC Host: `http://127.0.0.1:4943` (local dfx)
- Identity Provider: Local Internet Identity

### Authentication Flow

1. User clicks "Connect Wallet"
2. AuthClient opens identity provider window
3. User authenticates with Internet Identity
4. Identity is stored in Zustand store
5. User is redirected to dashboard

### Canister Communication

All canister calls go through:
- `lib/canister/agent.ts` - Agent creation
- `lib/canister/heirlock.ts` - Canister actor
- `lib/hooks/useHeirlock.ts` - React hooks (Phase 2)

## Troubleshooting

### "Canister not found" error
- Ensure dfx is running: `dfx start`
- Check canister ID in `.env.local` matches `.dfx/local/canister_ids.json`
- Redeploy canister: `dfx deploy heirlock`

### Authentication not working
- Ensure dfx is running
- Check browser console for errors
- Try clearing browser storage and retrying

### Type errors
- Run `npm run build` to check for TypeScript errors
- Ensure all dependencies are installed: `npm install`
