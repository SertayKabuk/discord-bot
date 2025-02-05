# dcbot

A Discord bot built with Node.js and TypeScript.

## Features

- Slash commands
- PUBG player comparison
- Integrated API calls and real-time data streaming

## Required Stack

- **Node.js** (v14+ recommended)
- **TypeScript**
- **Discord.js** for communicating with Discord
- **Express** for the HTTP server ([see usage in `src/http-server.js`](src/http-server.js))
- **PostgreSQL** for database operations ([managed by `db/db-helper.js`](build/db/db-helper.js))
- **MikroORM** for ORM migrations ([see migration in `src/migrations/Migration20240428004001.ts`](src/migrations/Migration20240428004001.ts))
- **Docker** for containerization ([refer to `Dockerfile`](Dockerfile))
- Additional libraries such as **axios**, **dotenv**, and **langchain** for API integrations

## Required Integrations

- **PostgreSQL:** Integrated via MikroORM. See details in [src/migrations/Migration20240428004001.ts](src/migrations/Migration20240428004001.ts) and database helper in [build/db/db-helper.js](build/db/db-helper.js)
- **MongoDB:** Integration provided by the [mongo-helper](src/db/mongo-helper.ts) utilizing the official `mongodb` package.
- **RabbitMQ:** Integration implemented in [RabbitMQConnection](src/rabbitmq-helper.ts) using the `amqplib` package.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to compile the project.
4. Start the bot with `npm start`.

## Usage

Refer to the [command implementations](src/slash-commands/pubg/compare-players.ts) for details on command functionalities.

## License

[ISC](LICENSE)