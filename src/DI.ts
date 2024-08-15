import { EntityManager } from '@mikro-orm/postgresql';
import { Client as DiscordClient } from "discord.js";
import { Client as GraphQLClient } from '@urql/core';
import { Ollama } from "@langchain/ollama";

export const DI = {} as {
  em: EntityManager,
  discordClient: DiscordClient,
  graphQLClient: GraphQLClient,
  llm : Ollama
}