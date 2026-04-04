# Stuffy Supermarket - Enterprise Micro-frontends E-commerce

Stuffy Supermarket is a modern, high-performance e-commerce platform built with a robust Micro-frontends (MFE) architecture. This project demonstrates advanced engineering patterns, including real-time synchronization, 3D interactivity, and a standardized design system, all managed within a strictly typed monorepo environment.

## Architecture Overview

The system is orchestrated using Webpack 5 Module Federation, allowing independent teams to develop, test, and deploy sub-applications (remotes) that are seamlessly integrated into a main App Shell (host) at runtime.

### Core Applications
- **Container (App Shell)**: The primary entry point (Port 3000) that dynamically orchestrates and loads all micro-frontends using React Suspense.
- **Header App**: Provides centralized navigation, AI-powered search, and a global language switcher (Port 3001).
- **Product App**: Handles the complex product catalog, category filtering, and 3D AR product visualization (Port 3002).
- **Cart App**: Manages local and server-synced shopping cart states with real-time price calculations (Port 3003).
- **Admin App**: An enterprise-grade dashboard for product management and inventory tracking (Port 3004).
- **Store App**: A headless utility MFE providing centralized API services (TypeScript), global state (Zustand), and i18n synchronization (Port 3005).
- **Design System**: A shared UI library containing reusable components like GlassCard and Button, documented with Storybook (Port 3006).
- **3D Viewer**: A heavy-duty Three.js engine for interactive product exploration, lazy-loaded on demand (Port 3007).

## Key Technical Features

### Monorepo and Build System
- **Turborepo Management**: Orchestrates build, lint, and start commands across all packages with high-performance caching.
- **TypeScript Integration**: Full end-to-end type safety from the Backend API (Node.js) through the Store App utility layer to the Frontend components.
- **Shared Configuration**: Unified ESLint and Prettier rules defined in `packages/config` to ensure code consistency across all micro-frontends.

### Advanced Capabilities
- **Module Federation (MFE)**: True isolation of development environments with dynamic remote URL loading via runtime configuration.
- **Real-time Synchronization**: Socket.io integration for instant price updates, flash sale countdowns, and cross-device cart syncing.
- **State Management**: Centralized store patterns using Zustand, accessible across different micro-frontends via the Store App.
- **Internationalization (i18n)**: Instant system-wide language switching (English/Vietnamese) without page reloads.
- **Error Tracking**: Full-stack observability with Sentry integrated into both the App Shell and the Backend API.
- **PWA and Offline Support**: Service Worker integration using Workbox to ensure fast load times and basic offline functionality.

### Performance and DevOps
- **Multi-stage Docker Builds**: Optimized Docker images using Alpine Linux and Nginx to minimize deployment footprint and speed up cold starts.
- **CI/CD Pipeline**: Automated GitHub Actions workflow utilizing matrix strategies for concurrent building and deployment of all ecosystem apps.
- **Dynamic Optimization**: Code splitting and lazy loading of heavy modules (like the 3D Engine) to maintain high Lighthouse scores.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker Desktop (for containerized environment)

### Local Development (Live Mode)
To start all applications simultaneously using Turborepo, run the following in the root directory:
```bash
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Simulation (Docker)
To build and run the entire ecosystem locally using Docker Compose:
```bash
docker-compose up -d --build
```

## Documentation
- **UI Components**: Run `npm run storybook` in the `design-system-app` directory to view the interactive documentation for shared components.
- **API Models**: Shared data interfaces are centrally defined in `packages/types`.

## Security and Best Practices
- **Cookie-based Auth**: Utilizes HttpOnly cookies for secure authentication handling.
- **Content Security**: Implements skeletal loading and error boundaries to ensure a resilient user experience during network instability.
