import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../../types";

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	execute: async (interaction) => {
		await interaction.reply('Pong!');
	},
	cooldown: 3,
	category: "fun"
};

export default command