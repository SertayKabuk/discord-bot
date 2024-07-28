import { EntityManager } from '@mikro-orm/postgresql';
import { Client as DiscordClient } from "discord.js";
import { Client as GraphQLClient } from '@urql/core';

export const DI = {} as {
  em: EntityManager,
  discordClient: DiscordClient,
  graphQLClient: GraphQLClient
}