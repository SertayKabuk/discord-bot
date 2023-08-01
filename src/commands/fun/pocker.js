const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, SlashCommandBuilder } = require('discord.js');
const { httpGet } = require('../../utility');

module.exports = {
	category: 'fun',
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('poker')
		.setDescription('Starts a poker game!'),
	async execute(interaction) {

		const baseUrl = 'https://deckofcardsapi.com/';
		// todo
		// set dealer, draw button should only be available to the dealer

		const confirm = new ButtonBuilder()
			.setCustomId('join')
			.setLabel('Join')
			.setStyle(ButtonStyle.Success);

		const draw = new ButtonBuilder()
			.setCustomId('draw')
			.setLabel('Draw')
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder()
			.addComponents(confirm, draw);

		const message = await interaction.reply({ content: 'React with a thumbs up to join!', components: [row], fetchReply: true });

		const acceptedUsers = new Array();

		const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

		let deckId = '';

		collector.on('collect', async i => {
			if (i.component.customId === 'join') {
				// already drawed cards
				if (acceptedUsers.some(user => user.id === i.user.id)) {
					await i.reply({ content: 'Zaten katilmissin az dur.', ephemeral: true });
				}
				else {
					acceptedUsers.push(i.user);
					console.log(`Collected from ${i.user.tag}`);

					await i.deferReply({ content: 'geliyoor', ephemeral: true });
					// draw card from deck

					const response = await httpGet(`${baseUrl}api/deck/${deckId}/draw/?count=2`);
					let cards = '';

					response.data.cards.forEach(element => {
						cards += ' ' + element.image;
					});

					await i.editReply({ content: `Desten! ${i.user.tag} ${cards}`, ephemeral: true });

				}
			}
			else if (i.component.customId === 'draw') {
				await i.reply({ content: 'Dealer degeilsin.', ephemeral: true });
			}
		});

		collector.on('end', async () => {
			let summation = '';

			if (acceptedUsers.length > 0) {
				summation = acceptedUsers.map(user => user.globalName).join('\n');

				await interaction.followUp({ content: 'Katilanlar!\n' + summation });
			}
			else {
				await interaction.followUp({ content: 'Kimse gelmedi :(' });
			}

		});

		// first, get new deck
		const response = await httpGet(`${baseUrl}api/deck/new/shuffle/?deck_count=1`);
		deckId = response.data.deck_id;

		console.log(deckId);
	},
};
