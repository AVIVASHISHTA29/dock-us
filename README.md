# Dock-us Monorepo

A modern movie exploration platform built with Next.js and GraphQL. This monorepo contains both the Next.js client application and Express GraphQL server.

## Features

### 🎬 Movie Exploration

- Browse popular movies with a beautiful, responsive grid layout
- Advanced search functionality with debounced queries
- Detailed movie information including:
  - High-quality movie posters
  - Release dates
  - Vote averages
  - Plot overviews

### 💬 Review System

- Write and publish movie reviews
- Rich text editor with formatting options:
  - Bold, italic, and underline text
  - Ordered and unordered lists
  - Multiple heading levels
  - Link insertion
- Real-time review updates
- Review count tracking

### 🎨 Modern UI/UX

- Responsive design with mobile-first approach
- Beautiful animations using Framer Motion
- Modern component library with Shadcn UI
- Dark mode support
- Loading states and skeletons
- Smooth transitions between pages

### 🛠 Technical Features

- GraphQL API with Apollo Server
- Next.js App Router for optimal routing
- Server-side rendering for better performance
- TypeScript for type safety
- Tailwind CSS for styling
- Apollo Client for state management
- Dynamic imports for optimal loading
- Debounced search for better performance

## Project Structure

```
dock-us/
├── client/          # Next.js frontend application
│   ├── app/         # Next.js App Router pages
│   ├── components/  # React components
│   └── lib/         # Utility functions and configurations
└── server/          # Express GraphQL server
    └── src/         # Server source code
```

## Prerequisites

- Node.js >= 18
- npm >= 9

## Environment Variables

### Server

Create a `.env` file in the server directory:

```env
TMDB_API_KEY=your_tmdb_api_key
```

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

## Development Guidelines

- Use TypeScript for all new code
- Follow the established code style and formatting rules
- Write tests for new features
- Keep the dependencies up to date

## Tech Stack

### Frontend

- Next.js 14 with App Router
- React 18
- TypeScript
- Apollo Client
- Tailwind CSS
- Shadcn UI
- Framer Motion
- TipTap Editor

### Backend

- Express
- Apollo Server
- GraphQL
- Node.js
- TypeScript

## API Integration

The application integrates with The Movie Database (TMDB) API for fetching movie data. Make sure to obtain an API key from [TMDB](https://www.themoviedb.org/documentation/api) and add it to your server's environment variables.
