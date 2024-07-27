import { ChannelType, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { DI } from "../../DI";
import { ChannelMessage } from "../../db/entities/ChannelMessage.entity";

const DuplicateUrlCheckCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("duplicateurlchecker")
        .addStringOption(option => {
            return option
                .setName("url")
                .setDescription("url")
                .setRequired(true)
        })
        .addStringOption(option => {
            return option
                .setName("server_id")
                .setDescription("serverId")
        })
        .setDescription("Check if url is sent before."),

    execute: async (interaction) => {
        const url = String(interaction.options.get("url")?.value);
        let serverId = String(interaction.options.get("server_id")?.value);

        if ((serverId === undefined || serverId === "undefined") && interaction.guildId) {
            serverId = interaction.guildId;
        }

        if (serverId === undefined || serverId === "undefined") {
            await interaction.reply({ content: 'server_id bilgisi gerekli', ephemeral: true });
            return;
        }
        const foundRecords = await DI.em.find(ChannelMessage, {
            $and: [{ guildId: serverId },
            { urls: { $some: { url: url } } }]
        },
            { populate: ['urls'] }
        );

        if (foundRecords.length > 0) {
            for (let index = 0; index < foundRecords.length; index++) {
                const element = foundRecords[index];
                const channel = DI.client.channels.cache.get(element.channelId);

                if (channel) {
                    if (channel.type == ChannelType.GuildText) {
                        const oldMessage = await channel.messages.fetch(element.messageId);
                        await interaction.reply({ content: oldMessage.url, ephemeral: true });
                    }
                }
            }
        }
        else
        {
            await interaction.reply({ content: 'paylasan olmamis', ephemeral: true });
        }

    },
    cooldown: 10,
    category: "utilty"
}

export default DuplicateUrlCheckCommand;