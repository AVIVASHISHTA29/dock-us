# Dock-us Monorepo

This monorepo contains both the Next.js client application and Express GraphQL server.

## Project Structure

```
dock-us/
├── client/          # Next.js frontend application
└── server/          # Express GraphQL server
```

## Prerequisites

- Node.js >= 18
- npm >= 9

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development servers:

```bash
npm run dev
```

This will start both the client and server in development mode:

- Client: [http://localhost:3000](http://localhost:3000)
- Server: [http://localhost:4000](http://localhost:4000)

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build both applications
- `npm run lint` - Run linting for both applications
- `npm run test` - Run tests for both applications

## Development Guidelines

- Use TypeScript for all new code
- Follow the established code style and formatting rules
- Write tests for new features
- Keep the dependencies up to date

## Environment Variables

Create `.env` files in both client and server directories:

### Client (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

### Server (.env)

```
PORT=4000
NODE_ENV=development
```
