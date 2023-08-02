import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest"
import { readdirSync } from "fs";
import * as path from 'path'; 
import { color } from "../functions";
import { Command, SlashCommand } from "../types";

module.exports = (client : Client) => {
    const slashCommands : SlashCommandBuilder[] = []
    const commands : Command[] = []

    let slashCommandsDir = path.join(__dirname,"../slashCommands")
    const slashCommandsFolder = readdirSync(slashCommandsDir);
    let commandsDir = path.join(__dirname,"../commands")
    const commandsFolder = readdirSync(commandsDir);

    for (const folder of slashCommandsFolder) {
        const commandsPath = path.join(slashCommandsDir, folder);
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            if (!file.endsWith(".js")) return;
            const filePath = path.join(commandsPath, file);
            let command : SlashCommand = require(filePath).default
            slashCommands.push(command.command)
            client.slashCommands.set(command.command.name, command)
        }
    }

    for (const folder of commandsFolder) {
        const commandsPath = path.join(commandsDir, folder);
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            if (!file.endsWith(".js")) return;
            const filePath = path.join(commandsPath, file);
            let command : Command = require(filePath).default
            commands.push(command)
            client.commands.set(command.name, command)
        }
    }

    const rest = new REST({version: "10"}).setToken(process.env.TOKEN);

    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: slashCommands.map(command => command.toJSON())
    })
    .then((data : any) => {
        console.log(color("text", `🔥 Successfully loaded ${color("variable", data.length)} slash command(s)`))
        console.log(color("text", `🔥 Successfully loaded ${color("variable", commands.length)} command(s)`))
    }).catch(e => {
        console.log(e)
    })
}