import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { readdirSync } from "fs";
import * as path from "path";
import { color } from "../functions.js";
import { Command, SlashCommand } from "../types.js";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";

export default async (client: Client) => {
  const slashCommands: SlashCommandBuilder[] = [];
  const commands: Command[] = [];

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  let slashCommandsDir = path.join(__dirname, "../slash-commands");
  const slashCommandsFolder = readdirSync(slashCommandsDir);
  let commandsDir = path.join(__dirname, "../commands");
  const commandsFolder = readdirSync(commandsDir);

  for (const folder of slashCommandsFolder) {
    const commandsPath = path.join(slashCommandsDir, folder);
    const commandFiles = readdirSync(commandsPath).filter((file) =>
      file.endsWith(".js")
    );

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      try {
        const commandModule = await import(pathToFileURL(filePath).href);
        let command: SlashCommand = commandModule.default;
        slashCommands.push(command.command);
        client.slashCommands.set(command.command.name, command);
      } catch (error) {
        console.error(`Failed importing slash command ${file}:`, error);
      }
    }
  }

  for (const folder of commandsFolder) {
    const commandsPath = path.join(commandsDir, folder);
    const commandFiles = readdirSync(commandsPath).filter((file) =>
      file.endsWith(".js")
    );

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      try {
        const commandModule = await import(pathToFileURL(filePath).href);
        let command: Command = commandModule.default;
        commands.push(command);
        client.commands.set(command.name, command);
      } catch (error) {
        console.error(`Failed importing command ${file}:`, error);
      }
    }
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: slashCommands.map((command) => command.toJSON()),
    })
    .then((data: any) => {
      console.log(
        color(
          "text",
          `🔥 Successfully loaded ${color(
            "variable",
            data.length
          )} slash command(s)`
        )
      );
      console.log(
        color(
          "text",
          `🔥 Successfully loaded ${color(
            "variable",
            commands.length
          )} command(s)`
        )
      );
    })
    .catch((e) => {
      console.error(e);
    });
};
