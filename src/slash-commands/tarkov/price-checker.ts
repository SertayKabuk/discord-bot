import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../../types.js";
import { GameMode, Query, LanguageCode, QueryItemsArgs } from "../../__generated__/graphql.js";
import graphQLHelper from "../../utils/graphql-helper.js";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("tarkov_pricechecker")
        .addStringOption(option => {
            return option
                .setName("item_name")
                .setDescription("Item name.")
                .setRequired(true);
        })
        .addNumberOption(option => {
            return option
                .setName("limit")
                .setDescription("Item count limit.")
                .setMaxValue(10)
        })
        .setDescription("Find item price from tarkov market.") as SlashCommandBuilder,
    execute: async (interaction) => {
        const itemName = interaction.options.getString("item_name");
        let limit = interaction.options.getNumber("limit");

        if (limit === undefined || limit === null || limit < 1) {
            limit = 3;
        }

        await interaction.deferReply();

        const query = `
            query GetItemPrice($lang: LanguageCode, $name: String, $limit: Int, $gameMode: GameMode) {
                    items(lang: $lang, name: $name, limit: $limit, gameMode: $gameMode) {
                        name
                        lastLowPrice
                        updated
                        avg24hPrice
                        low24hPrice
                        high24hPrice
                        wikiLink,
                        inspectImageLink
                        buyFor {
                            price
                            currency
                            vendor {
                                name
                            }
                        }                   
                    }
                }
            `;

        const { data, error } = await graphQLHelper.client.query<Query, QueryItemsArgs>(query, { lang: LanguageCode.En, gameMode: GameMode.Regular, limit: limit, name: itemName })

        if (error)
            console.log(error);

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'RUB',

            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        const embeds: EmbedBuilder[] = [];

        if (data?.items && data?.items?.length > 0) {

            data.items.forEach(item => {

                if ((item?.lastLowPrice ?? 0) === 0) {
                    return;
                }

                const fields: APIEmbedField[] = [];

                if (item?.buyFor && item?.buyFor.length > 0) {

                    item?.buyFor.forEach(buyForElement => {
                        fields.push({ name: buyForElement.vendor.name, value: (buyForElement?.currency) + " " + (buyForElement?.price ?? 0).toLocaleString(), inline: true });
                    });
                }

                const tarkovItemEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(item?.name ?? "")
                    .setURL(item?.wikiLink ?? "")
                    .setAuthor({ name: item?.name ?? "", iconURL: item?.inspectImageLink ?? "", url: item?.wikiLink ?? "" })
                    .addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Last Low Price', value: formatter.format(item?.lastLowPrice ?? 0).toString() },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Avg 24h Price', value: formatter.format(item?.avg24hPrice ?? 0).toString(), inline: true },
                        { name: 'Min 24h Price', value: formatter.format(item?.low24hPrice ?? 0).toString(), inline: true },
                        { name: 'Max 24h Price', value: formatter.format(item?.high24hPrice ?? 0).toString(), inline: true },
                        { name: '\u200B', value: '\u200B'  },
                    )
                    .addFields(fields)
                    .setImage(item?.inspectImageLink ?? "")
                    .setTimestamp(new Date(item?.updated ?? ""));

                embeds.push(tarkovItemEmbed);

            });
        }

        if (embeds.length === 0) {
            interaction.editReply("bulamadim");
        }
        else {
            interaction.editReply({ embeds: embeds });
        }
    },
    cooldown: 3,
    category: "tarkov"
};

export default command