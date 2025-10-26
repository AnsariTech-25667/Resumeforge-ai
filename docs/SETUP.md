# ResumeForge AI Setup Guide

## Prerequisites
- Node.js 20.x or higher
- npm 8.x or higher
- MongoDB (local or Atlas)

## Quick Start

### 1. Install Dependencies
```bash
# Install all dependencies for both client and server
npm run install:all

# Or install individually
cd client && npm install
cd server && npm install
```

### 2. Environment Configuration

#### Client (.env)
```bash
cd client
cp .env.example .env
# Edit .env with your API keys
```

#### Server (.env)
```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Servers
```bash
# Start both client and server
npm run dev

# Or start individually
npm run dev:client  # React app on http://localhost:3000
npm run dev:server  # Express API on http://localhost:5000
```

## Production Build
```bash
# Build client for production
npm run build

# Start production server
npm start
```

## Available Scripts
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build client for production
- `npm run lint` - Run ESLint on both client and server
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## Project Structure
```
resumeforge-ai/
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   └── package.json
├── docs/           # Documentation
└── package.json    # Root workspace config
```

## Environment Variables

### Required Client Variables
- `VITE_API_BASE` - Backend API URL
- `VITE_OPENAI_API_KEY` - OpenAI API key
- `VITE_GEMINI_API_KEY` - Google Gemini API key

### Required Server Variables
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key
- `GEMINI_API_KEY` - Google Gemini API key

## Features
- AI-powered content enhancement
- Real-time collaborative editing
- 3D template showcase
- Progressive Web App capabilities
- Enterprise-grade accessibility
- GitHub integration for developers

For detailed development information, see `DEVELOPMENT_TIMELINE.md`.