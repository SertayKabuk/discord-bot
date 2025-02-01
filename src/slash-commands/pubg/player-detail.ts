import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getPlayerDetail, getMatchDetail } from "../../api/pubg-helper.js";
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
      await interaction.deferReply();

      const playerData = await getPlayerDetail(nickname);
      // Use the first player from the data array
      if (playerData.data.length === 0) {
        await interaction.editReply({
          content: "No player found for that nickname.",
        });
        return;
      }

      const player = playerData.data[0];

      // Retrieve last match id from player's matches
      const lastMatchId = player.relationships.matches.data.slice(-1)[0]?.id;
      
      let statsField = { name: "Last Match Stats", value: "N/A", inline: false };

      if (lastMatchId) {
        try {
          const matchResponse = await getMatchDetail(lastMatchId);
          // Find the participant whose stats.playerId equals the player's id
          const participant = matchResponse.included.find((item) => item.attributes.stats.playerId === player.id);
          if (participant) {
            const stats = participant.attributes.stats;
            statsField = {
              name: "Last Match Stats",
              value: `Kills: ${stats.kills}
                      Damage: ${stats.damageDealt}
                      Survived: ${stats.timeSurvived}s
                      Assists: ${stats.assists}
                      Headshot Kills: ${stats.headshotKills}
                      DBNOs: ${stats.DBNOs}
                      WalkDistance: ${stats.walkDistance}
                      EideDistance: ${stats.rideDistance}
                      Revives: ${stats.revives}`,
              inline: false,
            };
          }
        } catch (matchError) {
          // If match detail fails, leave statsField as 'N/A'
        }
      }

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
          statsField
        )
        .setFooter({ text: "PUBG Player Details" })
        .setTimestamp();
      
      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      await interaction.editReply({
        content: "Failed to retrieve player details.",
      });
    }
  },
  cooldown: 3,
  category: "llm",
};

export default command;
