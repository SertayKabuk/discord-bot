# dcBot

A Discord bot built with Node.js and TypeScript featuring PUBG stats tracking, voice activity logging, and AI integrations.

## Features

- **Discord Slash Commands** - Intuitive user interface through Discord's native command system
- **PUBG Integration** - Player statistics, match details, and player comparisons
- **Voice Activity Tracking** - Comprehensive logging of user voice states (join, leave, mute, stream)
- **Presence Monitoring** - Tracks and logs user status and activity changes 
- **LLM Integration** - OpenAI and Ollama integrations for AI-powered interactions
- **REST API** - Swagger-documented endpoints for external access to bot data

## Tech Stack

- **Node.js & TypeScript** - Core development platform
- **Discord.js** - Discord API integration
- **Prisma ORM** - Database operations and schema management
- **PostgreSQL** - Primary database for storing logs and user data
- **MongoDB** - Secondary database for specific features
- **RabbitMQ** - Message queue for service communication
- **Express** - REST API server
- **Docker** - Containerization for deployment

## Integrations

- **Discord API** - Bot functionality and user interactions
- **PUBG API** - Game statistics and match data
- **OpenAI API** - AI text generation and processing
- **OpenRouter** - LLM model management
- **GraphQL** (Tarkov) - Additional game data integration
- **Google API** - Additional AI capabilities

## Project Structure

- `/src` - TypeScript source code
  - `/api` - API server and Swagger definitions
  - `/slash-commands` - Discord slash command implementations
  - `/events` - Discord event handlers
  - `/utils` - Helper functions and services
  - `/db` - Database connection and helpers
  - `/games` - Game-specific functionality (PUBG, etc.)
- `/prisma` - Database schema and migrations
- `/build` - Compiled JavaScript output

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` file:
   - Discord token and API keys
   - Database connections
   - External API credentials
4. Run database migrations: `npx prisma migrate deploy`
5. Build the project: `npm run build`
6. Start the bot: `npm start`

## Features in Detail

### PUBG Integration
Access player statistics, match histories, and compare multiple players' performance.

### Voice Activity Logging
Comprehensive tracking of voice channel activities including joins, leaves, mutes, and streams.

### Presence Monitoring
Track user status changes and activities across Discord platforms.

### LLM Integration
Multiple AI model support for generating responses and content.

## License

[ISC](LICENSE)