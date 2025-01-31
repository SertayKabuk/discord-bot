import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions.js";
import { BotEvent } from "../types.js";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";

export default (client: Client) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const eventsDir = join(__dirname, "../events");

  readdirSync(eventsDir).forEach(async (file) => {
    if (!file.endsWith(".js")) return;
    const modulePath = join(eventsDir, file);
    const eventModule = await import(pathToFileURL(modulePath).href);

    const event: BotEvent = eventModule.default;
    event.once
      ? client.once(event.name, (...args) => event.execute(...args))
      : client.on(event.name, (...args) => event.execute(...args));
    console.log(
      color(
        "text",
        `🌠 Successfully loaded event ${color("variable", event.name)}`
      )
    );
  });
};
