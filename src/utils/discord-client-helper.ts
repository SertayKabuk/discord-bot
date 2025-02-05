import {
  Client as DiscordClient,
  GatewayIntentBits,
  Collection,
  Partials,
} from "discord.js";
import { Command, SlashCommand } from "../types.js";
import { join } from "path";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DiscordClientHelper {
  private static instance: DiscordClientHelper;
  client!: DiscordClient;

  private constructor() {}

  static getInstance(): DiscordClientHelper {
    if (!DiscordClientHelper.instance) {
      DiscordClientHelper.instance = new DiscordClientHelper();
    }
    return DiscordClientHelper.instance;
  }

  async init() {
    const {
      Guilds,
      MessageContent,
      GuildMessages,
      GuildMembers,
      DirectMessages,
      GuildVoiceStates,
    } = GatewayIntentBits;

    this.client = new DiscordClient({
      intents: [
        Guilds,
        MessageContent,
        GuildMessages,
        GuildMembers,
        DirectMessages,
        GuildVoiceStates,
      ],
      partials: [Partials.Channel],
    });

    this.client.slashCommands = new Collection<string, SlashCommand>();
    this.client.commands = new Collection<string, Command>();
    this.client.cooldowns = new Collection<string, number>();

    const handlersDir = join(__dirname, "../handlers");

    readdirSync(handlersDir).forEach(async (handler) => {
      if (!handler.endsWith(".js")) return;
      const module = await import(`../handlers/${handler}`);
      module.default(this.client);
    });
  }

  async connect(token: string) {
    await this.client.login(token);
  }
}

const discordClient = DiscordClientHelper.getInstance();

export default discordClient;
