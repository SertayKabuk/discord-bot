import { REST, Routes } from "discord.js";


export const deleteAllCommands = async () => {
    const rest = new REST({version: "10"}).setToken(process.env.TOKEN);

    // for global commands
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);
};