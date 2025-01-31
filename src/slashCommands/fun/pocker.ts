import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, ComponentType, SlashCommandBuilder } from "discord.js"
import { PokerGame } from "../../games/PokerGame.js";
import { SlashCommand } from "../../types.js";

const startingMoney = 100;
const blindStartingMoney = 2;

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
			content: 'Katilmak isteyen join e bassin!',
			components: [new ActionRowBuilder<ButtonBuilder>({ components: [confirm, draw] })],
			fetchReply: true
		});

		let game = new PokerGame(interaction.channelId);

		// first, get new deck
		let deckId = await game.GetNewDeck();

		if (deckId === '') {
			await interaction.editReply({ content: 'Sikinti var!' });
			return;
		}

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

					let replyMessage = '';

					// draw 2 cards from deck for each user
					let cards = await game.DrawCardsFromDeck(deckId, blindStartingMoney);

					game.SetUser(i.user.id, i.user.globalName as string, cards, startingMoney);

					let imageUrls = game.GetCardImageUrl(cards);

					if (imageUrls.length > 0) {
						imageUrls.forEach(url => {
							replyMessage += ' ' + url;
						});

						await i.editReply({ content: `Desten! ${i.user.tag} ${replyMessage}` });
					}
					else
						await i.editReply({ content: `${i.user.tag} kart bulamadim.` });
				}
			}
			else if ((i.component as ButtonComponent).customId === 'draw') {
				await i.reply({ content: 'Dealer degilsin.', ephemeral: true });
			}
		});

		collector.on('end', async () => {
			let summation = '';

			if (acceptedUsers.length > 0) {
				summation = acceptedUsers.map(user => user.globalName).join('\n');

				const dealer = game.SetDealer();
				game.StartGame(blindStartingMoney);
				
				await interaction.followUp({ content: 'Katilanlar!\n' + summation });
				await interaction.followUp({ content: 'Dealer : ' + dealer });
			}
			else {
				await interaction.followUp({ content: 'Kimse gelmedi :(' });
			}
		});
	}
};

export default command