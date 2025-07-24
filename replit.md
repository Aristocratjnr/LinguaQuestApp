# replit.md

## Overview

This is a language learning application similar to Duolingo, built with a modern full-stack architecture. The application allows users to practice conversations with AI characters in different languages, featuring real-time translation, cultural context, and gamification elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom logging and error handling middleware

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Drizzle config)
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema**: Shared TypeScript schema definitions with Zod validation
- **Development Storage**: In-memory storage implementation for development/testing

## Key Components

### Database Schema
The application uses a comprehensive schema with the following main entities:
- **Users**: User profiles with XP, levels, streaks, and hearts (gamification)
- **Characters**: AI conversation partners with personality, language, and cultural context
- **Conversations**: Learning sessions with progress tracking and scenarios
- **Messages**: Individual conversation exchanges with translations and cultural context
- **Achievements**: Gamification rewards for user progress

### AI Integration
- **OpenAI Integration**: GPT-4o model for generating character responses
- **Character Personality**: AI maintains consistent character personas during conversations
- **Cultural Context**: AI provides cultural insights and tips alongside language learning
- **Dynamic Scenarios**: AI generates conversation scenarios based on character and difficulty

### Translation Services
- **Translation API**: Basic translation service (designed to be extended with Google Translate)
- **Language Detection**: Automatic detection of user input language
- **Cultural Context**: Explanations of cultural significance in translations

### Conversation System
- **Real-time Chat**: Message-based conversation interface
- **Progress Tracking**: Exchange counting and XP calculation
- **Difficulty Levels**: Beginner, intermediate, and advanced conversations
- **Suggestions**: AI-powered response suggestions for learners

## Data Flow

1. **User Authentication**: Currently uses mock user data (ready for auth implementation)
2. **Character Selection**: Users browse available AI characters and select conversation partners
3. **Conversation Creation**: System generates scenarios and initializes conversation sessions
4. **Message Exchange**: Real-time chat with AI characters, including translation and cultural tips
5. **Progress Tracking**: XP calculation, achievement unlocking, and progress persistence
6. **Gamification**: Streak tracking, heart system, and level progression

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- TypeScript for type safety
- Vite for development and build tooling

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI for accessible component primitives
- Lucide React for icons
- Class Variance Authority for component variants

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM for database operations
- OpenAI SDK for AI integration
- Zod for schema validation

### Development Tools
- ESBuild for server bundling
- TSX for TypeScript execution
- PostCSS for CSS processing

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **API Server**: Express server with TypeScript execution via TSX
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL and OPENAI_API_KEY required

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Deployment**: Single-server deployment serving both API and static files
- **Database**: PostgreSQL with Drizzle migrations

### Configuration
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Module System**: ES modules throughout the application
- **Type Checking**: Strict TypeScript configuration with path mapping
- **Build Scripts**: Separate build processes for client and server code

The application is designed to be easily deployable on platforms like Replit, with environment-based configuration and a single-server architecture that serves both the API and frontend assets.