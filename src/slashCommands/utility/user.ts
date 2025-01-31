import { GuildMember, MessageFlags, SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../../types.js";


const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName("user")
		.setDescription("Provides information about the user."),
	execute: async (interaction) => {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply({ content: `This command was run by ${interaction.user.username}, who joined on ${(interaction?.member as GuildMember)?.joinedAt}.`, flags: MessageFlags.Ephemeral });
	},
	cooldown: 3,
	category: "utility"
};

export default command