# Sentient Tweet Generator

## Overview

A full-stack web application that generates AI-powered tweets using a React frontend and Express backend. The application allows users to create tweet content with customizable style preferences (tone, length, emoji inclusion) through an AI agent service. Built with TypeScript, the app features a modern UI with shadcn/ui components, PostgreSQL database storage, and mobile-responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Theme System**: Built-in dark/light mode toggle with system preference detection
- **Mobile Support**: Responsive design with separate mobile navigation patterns

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured error handling
- **Validation**: Zod schemas for type-safe request/response validation
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **File Structure**: Separation of concerns with dedicated routes, storage, and service layers

### Data Storage
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database queries and migrations
- **Schema Design**: 
  - Users table with authentication fields
  - Tweets table storing generated content, style preferences, and metadata
  - JSON columns for complex style configuration storage
- **Migration Strategy**: Database schema versioning through Drizzle Kit

### Authentication & Authorization
- Session-based authentication preparation (infrastructure present but not fully implemented)
- Mock user system for development and demonstration
- Database schema includes user management tables

### AI Integration
- **Service Layer**: SentientAgent class abstracting AI tweet generation
- **Provider Flexibility**: Currently uses OpenAI API with framework for Sentient Agent integration
- **Style Processing**: Converts user preferences into system prompts for consistent AI output
- **Content Validation**: Character count limits and content filtering

### Development & Build
- **Development**: Hot module replacement with Vite
- **Build Process**: Vite for frontend bundling, esbuild for server compilation
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Path Aliases**: Configured import aliases for clean code organization

### External Dependencies
- **UI Framework**: Radix UI primitives for accessible components
- **Validation**: Zod for runtime type checking
- **Database**: Neon PostgreSQL serverless
- **AI Services**: OpenAI API (configurable for other providers)
- **Development**: Replit-specific tooling and error handling