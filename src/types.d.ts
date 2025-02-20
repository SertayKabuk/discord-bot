import { SlashCommandBuilder, Client, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js"

export interface SlashCommand {
    command: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction) => void,
    async autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number // in seconds
    category: string
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
    category: string
}

interface GuildOptions {
    prefix: string,
}

export interface IGuild extends mongoose.Document {
    guildID: string,
    options: GuildOptions
    joinedAt: Date
}

export type GuildOption = keyof GuildOptions
export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            CLIENT_ID: string,
            GUILD_ID: string,
            ADMIN_USER_ID: string,
            DB_HOST: string,
            DB_PORT: number,
            DB_NAME: string,
            DB_USER: string,
            DB_PASSWORD: string,
            API_PORT: number,
            API_HOST: string,
            API_PROTOCOL: string,
            TARKOV_GRAPHQL_CLIENT: string,
            LANGCHAIN_TRACING_V2: string,
            LANGCHAIN_API_KEY: string,
            OLLAMA_URL: string,
            OLLAMA_MODEL: string,
            RABBITMQ_HOST: string,
            OPEN_ROUTER_URL: string,
            OPEN_ROUTER_API_KEY: string,
            PUBG_API_TOKEN: string,
            MONGO_URL: string,
            MONGO_DB_NAME: string,
            GOOGLE_API_KEY: string,
            GOOGLE_API_URL: string,
            GOOGLE_LLM_MODEL: string,
            API_KEY: string,
            SWAGGER_PORT: string,
            UI_BASE_URL: string,
        }
    }

    var client: Client
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
        channels: Collection<string, Channel>
    }
}


export interface CardDeck {
    success: string,
    deck_id: string,
    remaining: number,
    shuffled: boolean,
}

interface CardImage {
    svg: string,
    png: string,
}

interface Card {
    code: string,
    image: string,
    images: CardImage[],
    value: string,
    suit: string,
}

export interface DrawedCard {
    success: string,
    deck_id: string,
    cards: Card[],
}