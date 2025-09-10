# Overview

This is QuickJob (உடனடி வேலை), a hyperlocal real-time job platform for Tamil Nadu, built as a full-stack application with both web and mobile components. The platform connects job providers (skilled workers) with hirers (job posters) through a map-based interface similar to Rapido, featuring deep cultural integration, robust trust mechanisms, and bilingual support (Tamil/English).

**Key Features:**
- Dual-role system: Job Providers and Hirers
- Hyperlocal job matching with real-time location tracking
- Cultural integration with Tamil/Tanglish support
- Aadhaar verification for trust building
- UPI payment integration
- Map-based job discovery
- Video portfolio support for providers
- Real-time job applications and hiring

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

### Mobile Application (QuickJob)
- **Framework**: Expo (SDK 53) with React Native
- **Routing**: Expo Router with file-based navigation and role-based tab navigation
- **Localization**: Complete Tamil/English support with context-based translations
- **Maps Integration**: React Native Maps for job discovery and provider location
- **Authentication**: Phone + OTP verification with Truecaller integration fallback
- **User Roles**: Dynamic interface switching between Provider and Hirer roles
- **Skills System**: Localized skills selection with primary/secondary categorization
- **Portfolio**: Video and image portfolio support for job providers
- **Real-time Features**: Location tracking and job notifications

## Backend Architecture

### Server Framework
- **Runtime**: Hono.js running on Node.js
- **Architecture**: API-first design with route-based file organization
- **Authentication**: Auth.js integration with custom adapter
- **Middleware**: CORS, request ID tracking, context storage
- **Error Handling**: Centralized error reporting and logging

### Database Integration
- **Primary Database**: MongoDB with provided connection string (QuickJob data)
- **Secondary Database**: Neon (Postgres) for web app legacy data
- **MongoDB Schema**: 
  - Users collection (dual-role with provider/hirer profiles)
  - Jobs collection (with geospatial indexing)
  - Applications collection (job applications tracking)
  - Reviews collection (rating and feedback system)
- **Geospatial Features**: 2dsphere indexes for location-based job matching

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