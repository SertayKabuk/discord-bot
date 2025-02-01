import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getPlayerDetail } from "../../api/pubg-helper.js";
import { SlashCommand } from "../../types.js";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("pubg-player-detail")
    .addStringOption((option) => {
      return option
        .setName("nickname")
        .setDescription("Hilecinin nickname'i")
        .setRequired(true);
    })
    .setDescription("PUBG hilecilerini incelemek icin.") as SlashCommandBuilder,
  execute: async (interaction) => {
    const nickname = interaction.options.getString("nickname");

    if (!nickname || nickname === null || nickname === "") {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Hileci nickname'i girmelisin!",
      });
      return;
    }
    try {
      interaction.deferReply();

      const playerData = await getPlayerDetail(nickname);
      // Use the first player from the data array
      if (playerData.data.length === 0) {
        await interaction.reply({
          content: "No player found for that nickname.",
        });
        return;
      }

      if (playerData.data.length > 0) {
        const player = playerData.data[0];
        // Get last 3 match ids
        const matchIds =
          player.relationships.matches.data
            .slice(-3)
            .map((match) => match.id)
            .join(", ") || "N/A";
        const embed = new EmbedBuilder()
          .setTitle(player.attributes.name)
          .addFields(
            { name: "Player ID", value: player.id, inline: true },
            {
              name: "Ban Type",
              value: player.attributes.banType,
              inline: true,
            },
            {
              name: "Clan ID",
              value: player.attributes.clanId || "N/A",
              inline: true,
            },
            {
              name: "Patch Version",
              value: player.attributes.patchVersion || "N/A",
              inline: true,
            },
            { name: "Last 3 Matches", value: matchIds, inline: false }
          )
          .setFooter({ text: "PUBG Player Details" })
          .setTimestamp();
        await interaction.reply({
          embeds: [embed],
        });
      } else {
        await interaction.reply({
          flags: MessageFlags.Ephemeral,
          content: "No player found for that nickname.",
        });
      }
    } catch (error) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Failed to retrieve player details.",
      });
    }
  },
  cooldown: 3,
  category: "llm",
};

export default command;
