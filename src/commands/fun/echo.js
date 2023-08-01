const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	category: 'fun',
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies each letter with 1 sec delay!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo.')
				.setRequired(true)),
	async execute(interaction) {
		const input = interaction.options.getString('input') ?? 'No input provided';

		await interaction.deferReply();

		let echoBuilder = '';

		for (let index = 0; index < input.length; index++) {
			echoBuilder += input[index];
			await wait(1000);
			await interaction.editReply(echoBuilder);
		}
	},
};
