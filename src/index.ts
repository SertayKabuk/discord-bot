import { Client, GatewayIntentBits, Collection, PermissionFlagsBits, } from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
import { Command, SlashCommand } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { HttpServer } from "./httpServer";
config()

const client = new Client({ intents: [Guilds, MessageContent, GuildMessages, GuildMembers] })

client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client)
})

let server = new HttpServer(80);
server.CreateServer();
client.login(process.env.TOKEN);
