import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../../types";

const wait = require('node:timers/promises').setTimeout;

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName("echo")
		.addStringOption(option => {
			return option
				.setName("input")
				.setDescription("The input to echo.")
				.setRequired(true);
		})
		.setDescription("Replies each letter with 1 sec delay!"),
	execute: async (interaction) => {
		const input = interaction.options.getString('input') ?? 'No input provided';

		await interaction.deferReply();

		let echoBuilder = '';

		for (let index = 0; index < input.length; index++) {
			echoBuilder += input[index];
			await wait(1000);
			await interaction.editReply(echoBuilder);
		}
	},
	cooldown: 3,
	category: "fun"
};

export default command