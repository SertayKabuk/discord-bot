import "./env";
import { Client, GatewayIntentBits, Collection, Partials } from "discord.js";
import { Command, SlashCommand } from "./types";
import { readdirSync } from "fs";
import { join } from "path";
import { HttpServer } from "./httpServer";
import { PostgreSqlDriver, MikroORM } from '@mikro-orm/postgresql';
import ormConfig from './mikro-orm.config';
import { DI } from "./DI";

async function main() {

    const orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);

    DI.em = orm.em;

    const { Guilds, MessageContent, GuildMessages, GuildMembers, DirectMessages } = GatewayIntentBits

    const client = new Client({ intents: [Guilds, MessageContent, GuildMessages, GuildMembers, DirectMessages], partials: [Partials.Channel] });

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
    DI.client = client;
}

main();