import { ChannelType, MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import { prisma } from "../../db/prisma.js";
import discordClient from "../../utils/discord-client-helper.js";

const DuplicateUrlCheckCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("duplicateurlchecker")
    .addStringOption((option) => {
      return option.setName("url").setDescription("url").setRequired(true);
    })
    .addStringOption((option) => {
      return option.setName("server_id").setDescription("serverId");
    })
    .setDescription("Check if url is sent before.") as SlashCommandBuilder,

  execute: async (interaction) => {
    const url = String(interaction.options.get("url")?.value);
    let serverId = String(interaction.options.get("server_id")?.value);

    if (
      (serverId === undefined || serverId === "undefined") &&
      interaction.guildId
    ) {
      serverId = interaction.guildId;
    }

    if (serverId === undefined || serverId === "undefined") {
      await interaction.reply({
        content: "server_id bilgisi gerekli",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const foundRecord = await prisma.channel_messages.findFirst({
      where: {
        guild_id: serverId,
        urls: {
          some: {
            url: url
          }
        }
      },
      select: {
        channel_id: true,
        message_id: true
      },
      orderBy: { created_at: 'asc' }
    });

    if (foundRecord) {
      const channel = discordClient.client.channels.cache.get(
        foundRecord.channel_id
      );

      if (channel && channel.type == ChannelType.GuildText) {
        const oldMessage = await channel.messages.fetch(foundRecord.message_id);
        await interaction.reply({
          content: oldMessage.url,
          flags: MessageFlags.Ephemeral,
        });
      }
    } else {
      await interaction.reply({
        content: "paylasan olmamis",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
  cooldown: 10,
  category: "utilty",
};

export default DuplicateUrlCheckCommand;
