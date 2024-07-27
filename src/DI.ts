import { EntityManager } from '@mikro-orm/postgresql';
import { Client } from "discord.js";

export const DI = {} as {
  em: EntityManager,
  client : Client
}