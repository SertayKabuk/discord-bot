import "./env";
import { Client as DiscordClient, GatewayIntentBits, Collection, Partials } from "discord.js";
import { Command, SlashCommand } from "./types";
import { readdirSync } from "fs";
import { join } from "path";
import { HttpServer } from "./httpServer";
import { PostgreSqlDriver, MikroORM } from '@mikro-orm/postgresql';
import ormConfig from './mikro-orm.config';
import { DI } from "./DI";
import { Client as GraphQLClient, cacheExchange, fetchExchange } from "@urql/core";
import { Ollama } from "@langchain/ollama";

async function main() {

    const graphQLClient = new GraphQLClient({
        url: process.env.TARKOV_GRAPHQL_CLIENT,
        exchanges: [cacheExchange, fetchExchange],
    });

    DI.graphQLClient = graphQLClient;
    
    const orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);

    DI.em = orm.em;

    const llm = new Ollama({
        model: "llama3.1:8b",
        temperature: 0,
        maxRetries: 2,
        baseUrl: process.env.OLLAMA_URL
      });

      DI.llm = llm;

    const { Guilds, MessageContent, GuildMessages, GuildMembers, DirectMessages } = GatewayIntentBits

    const client = new DiscordClient({ intents: [Guilds, MessageContent, GuildMessages, GuildMembers, DirectMessages], partials: [Partials.Channel] });

    client.slashCommands = new Collection<string, SlashCommand>();
    client.commands = new Collection<string, Command>();
    client.cooldowns = new Collection<string, number>();

    const handlersDir = join(__dirname, "./handlers");

    readdirSync(handlersDir).forEach(handler => {
        if (!handler.endsWith(".js")) return;
        require(`${handlersDir}/${handler}`)(client)
    });

    const server = new HttpServer(process.env.API_PORT);
    server.CreateServer();
    await client.login(process.env.TOKEN);
    DI.discordClient = client;
}

main();