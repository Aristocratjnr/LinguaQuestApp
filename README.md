## Overview

**LinguaQuest** is a persuasive dialogue game where players interact with AI characters speaking Ghanaian languages (Twi, Ga, Ewe). Players must translate and craft persuasive arguments to convince AI characters to change their opinions, with scoring based on translation accuracy, persuasive strength, and cultural appropriateness. The game now features Replit authentication, Material Icons, and a glassy lemon-themed interface with interactive AI behavior testing.

## User Preferences

- **Communication Style**: Simple, everyday language
- **Brand Name**: LinguaQuest (updated from PersuadeGH)
- **Design Theme**: Glassy lemon cards with Material Icons instead of Lucide icons
- **Authentication**: Replit Auth integration with session management
- **UI Style**: Glass morphism design with lemon color scheme

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
- **Database**: PostgreSQL with persistent storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema**: Shared TypeScript schema definitions with Zod validation
- **Migration**: Manual SQL migrations for authentication tables
- **Authentication Storage**: Sessions table for Replit Auth with user profiles

## Key Components

### Database Schema
The application uses a comprehensive schema with the following main entities:
- **Users**: Replit Auth user profiles with email, firstName, lastName, profileImageUrl, plus gamification (XP, levels, streaks, hearts)
- **Sessions**: Replit Auth session storage with expiration tracking
- **Characters**: AI debate opponents with personality, language, cultural context, persuasion resistance, and current stance
- **Conversations**: Persuasion game sessions with topics, AI stances, and persuasion scoring
- **Messages**: Individual persuasive exchanges with tone, translation accuracy, persuasive strength, and cultural appropriateness scores
- **Achievements**: Gamification rewards for persuasive successes

### AI Integration
- **OpenAI Integration**: GPT-4o model for generating character responses and evaluation
- **Character Personality**: AI maintains consistent character personas with persuasion resistance levels
- **Persuasion Evaluation**: AI scores translation accuracy, persuasive strength, and cultural appropriateness
- **Dynamic Scenarios**: AI generates debate topics and controversial stances for persuasion challenges

### Translation Services
- **Ghanaian Language Support**: Enhanced translation for Twi, Ga, and Ewe languages
- **Language Detection**: Automatic detection with patterns for Ghanaian languages
- **Cultural Context**: Explanations of cultural significance in translations and persuasion tactics

### Persuasion Game System
- **Real-time Debates**: Message-based persuasion interface with tone selection
- **Progress Tracking**: Round counting, persuasion score tracking, and XP calculation
- **Difficulty Levels**: Beginner, intermediate, and advanced persuasion challenges
- **Scoring System**: Multi-dimensional evaluation of translation, persuasion, and cultural respect
- **Tone Selection**: Players choose communication style (polite, passionate, formal, casual)

## Game Flow

1. **User Authentication**: Replit Auth with OpenID Connect for secure login/logout
2. **Landing Page**: Beautiful glass-design welcome page for unauthenticated users
3. **Character Selection**: Authenticated users browse available Ghanaian AI characters and select debate opponents
4. **Scenario Generation**: System generates controversial topics and AI stances for persuasion challenges
5. **Persuasion Rounds**: Players craft arguments in Ghanaian languages with tone selection
6. **AI Evaluation**: Multi-dimensional scoring of translation accuracy, persuasive strength, and cultural appropriateness
7. **Progress Tracking**: Persuasion score changes, XP calculation, achievement unlocking, and progress persistence
8. **Gamification**: Streak tracking, heart system, and level progression based on persuasive success

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- TypeScript for type safety
- Vite for development and build tooling

### UI and Styling
- Tailwind CSS for utility-first styling with custom lemon-themed glass morphism classes
- Radix UI for accessible component primitives
- Material Icons for consistent iconography (replaced Lucide)
- React Icons library for additional icon support
- Class Variance Authority for component variants
- Custom CSS variables for glass effects and lemon color scheme

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM for database operations
- OpenAI SDK for AI integration
- Zod for schema validation
- Replit Auth dependencies: openid-client, passport, express-session, connect-pg-simple, memoizee

### Development Tools
- ESBuild for server bundling
- TSX for TypeScript execution
- PostCSS for CSS processing

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **API Server**: Express server with TypeScript execution via TSX
- **Database**: PostgreSQL with persistent storage and connection pooling
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY, and PostgreSQL credentials configured
- **Database Management**: Drizzle migrations and seeding scripts available

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
