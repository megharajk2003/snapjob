# Overview

This is a full-stack application with both web and mobile components built for a marketplace or gig economy platform. The web application uses React Router v7 with Hono server, while the mobile app is built with Expo and React Native. The system supports user authentication, job posting/management, and file uploads with a focus on hirers and service providers.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

### Web Application
- **Framework**: React Router v7 with file-based routing
- **Styling**: Tailwind CSS with custom utility classes
- **State Management**: Zustand for client-side state
- **UI Components**: Chakra UI, custom polymorphic components, and React Aria for accessibility
- **Development**: Vite with custom plugins for hot reload, font loading, and error handling

### Mobile Application
- **Framework**: Expo (SDK 53) with React Native
- **Routing**: Expo Router with file-based navigation
- **Cross-platform**: Web polyfills for React Native components to enable web compatibility
- **Error Handling**: Custom error boundaries with remote error reporting
- **State Management**: Zustand for authentication state

## Backend Architecture

### Server Framework
- **Runtime**: Hono.js running on Node.js
- **Architecture**: API-first design with route-based file organization
- **Authentication**: Auth.js integration with custom adapter
- **Middleware**: CORS, request ID tracking, context storage
- **Error Handling**: Centralized error reporting and logging

### Database Integration
- **Database**: Neon (Postgres) with serverless configuration
- **Query Builder**: Raw SQL with neon client
- **Schema**: Users, jobs, skills, and portfolio tables
- **Transactions**: Supported for complex operations

## Authentication and Authorization

### Authentication Strategy
- **Provider**: Auth.js with custom Neon adapter
- **Methods**: Credentials-based authentication
- **Session Management**: JWT tokens with secure storage
- **Mobile Auth**: Expo SecureStore for token persistence
- **Cross-platform**: Shared authentication utilities between web and mobile

### Authorization Model
- **Roles**: Hirer and Provider user types
- **Permissions**: Role-based access control for job posting and bidding
- **Security**: CSRF protection and secure cookie handling

## Data Management

### File Upload System
- **Provider**: Uploadcare for file storage
- **Implementation**: Custom upload hooks with progress tracking
- **Types**: Support for images, documents (PDF text extraction), and general files
- **Fallback**: Base64 and URL-based uploads

### Real-time Features
- **Streaming**: Response streaming for AI/LLM interactions
- **Hot Reload**: Development-time code updates with user feedback
- **Console Forwarding**: Development console messages forwarded to parent windows

## Development and Build

### Build System
- **Web**: Vite with custom plugins for development experience
- **Mobile**: Expo with Metro bundler and custom resolver
- **TypeScript**: Full TypeScript support with path mapping
- **Testing**: Vitest for unit testing with jsdom environment

### Development Tools
- **Error Reporting**: Comprehensive error tracking and serialization
- **Hot Reload**: Custom HMR with status tracking
- **DevTools**: Development server heartbeat and idle monitoring
- **Debugging**: Console forwarding and error overlay systems

# External Dependencies

## Core Infrastructure
- **Database**: Neon (Serverless Postgres)
- **File Storage**: Uploadcare for media and document uploads
- **Authentication**: Auth.js with custom database adapter

## UI and Styling
- **Web UI**: Chakra UI component library
- **Icons**: Lucide React icons, Expo Vector Icons for mobile
- **Fonts**: Google Fonts integration with Tailwind CSS
- **Charts**: React Google Maps for location services

## Mobile-Specific
- **Navigation**: Expo Router for file-based routing
- **Device APIs**: Expo modules for camera, location, contacts, notifications
- **Graphics**: React Native Skia for advanced graphics
- **Maps**: React Native Maps with web polyfills

## Development Tools
- **Build Tools**: Vite, Metro bundler, EAS CLI for mobile builds
- **Code Quality**: TypeScript, ESLint configurations
- **Testing**: Vitest, React Testing Library
- **Monitoring**: Custom error tracking and performance monitoring

## Third-Party Integrations
- **Payment**: Stripe integration (configured but not implemented)
- **Analytics**: Built-in development analytics and error tracking
- **PDF Processing**: PDF.js for client-side PDF text extraction
- **Query Management**: TanStack Query for data fetching and caching