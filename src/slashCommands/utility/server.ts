import { GuildMember, SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../../types.js";


const command: SlashCommand = {
	command: new SlashCommandBuilder()
    .setName("server")    
    .setDescription("Provides information about the server."),
	execute: async (interaction) => {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply({ content: `This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`, ephemeral: true });
	},
  	cooldown: 3,
	category: "utility"
};

export default command