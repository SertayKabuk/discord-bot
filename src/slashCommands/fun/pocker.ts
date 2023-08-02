import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, ComponentType, SlashCommandBuilder } from "discord.js"
import { HttpClient } from "../../httpClient";
import { SlashCommand, CardDeck, DrawedCard } from "../../types";

const command: SlashCommand = {
	cooldown: 5,
	category: "fun",
	command: new SlashCommandBuilder()
		.setName('poker')
		.setDescription('Starts a poker game!'),
	execute: async (interaction) => {

		const confirm = new ButtonBuilder()
			.setCustomId('join')
			.setLabel('Join')
			.setStyle(ButtonStyle.Success);

		const draw = new ButtonBuilder()
			.setCustomId('draw')
			.setLabel('Draw')
			.setStyle(ButtonStyle.Primary);

		const message = await interaction.reply({
			content: 'Katilmka isteyen join e bassin!',
			components: [new ActionRowBuilder<ButtonBuilder>({ components: [confirm, draw] })],
			fetchReply: true
		});

		const httpClient = new HttpClient();

		const baseUrl = 'https://deckofcardsapi.com/';
		// todo
		// set dealer, draw button should only be available to the dealer

		// first, get new deck
		const response = await httpClient.Get<CardDeck>(`${baseUrl}api/deck/new/shuffle/?deck_count=1`);
		let deckId = '';

		if (response !== null)
			deckId = response.deck_id;
		else {
			await interaction.editReply({ content: 'Sikinti var!' });
			return;
		}

		console.log(deckId);

		const acceptedUsers = new Array();

		const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

		collector.on('collect', async i => {
			if ((i.component as ButtonComponent).customId === 'join') {
				// already drawed cards
				if (acceptedUsers.some(user => user.id === i.user.id)) {
					await i.reply({ content: 'Zaten katilmissin az dur.', ephemeral: true });
				}
				else {
					acceptedUsers.push(i.user);
					console.log(`Collected from ${i.user.tag}`);

					await i.deferReply({ ephemeral: true });
					// draw card from deck

					const response = await httpClient.Get<DrawedCard>(`${baseUrl}api/deck/${deckId}/draw/?count=2`);
					let cards = '';

					if (response != null) {
						response.cards.forEach(element => {
							cards += ' ' + element.image;
						});
						await i.editReply({ content: `Desten! ${i.user.tag} ${cards}` });

					}
					else
						await i.editReply({ content: `${i.user.tag} kart bulamadim.` });


				}
			}
			else if ((i.component as ButtonComponent).customId === 'draw') {
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
	},
};

export default command