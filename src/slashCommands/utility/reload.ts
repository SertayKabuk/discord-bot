import { GuildMember, SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { SlashCommand } from "../../types";


const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('reload')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDescription('Reloads a command.'),
	execute: async (interaction) => {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.slashCommands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
		}

		delete require.cache[require.resolve(`../${command.category}/${command.command.name}.js`)];

		try {
			interaction.client.slashCommands.delete(command.command.name);
			const newCommand = require(`../${command.category}/${command.command.name}.js`).default;
			interaction.client.slashCommands.set(newCommand.command.name, newCommand);
			await interaction.reply(`Command \`${newCommand.command.name}\` was reloaded!`);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: `There was an error while reloading a command \`${command.command.name}}\`:\n\`${error.message}\``, ephemeral: true });
		}
	},
	cooldown: 3,
	category: "utilty"
};

export default command