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

      // Retrieve first match id from player's matches
      const firstMatchId = player.relationships.matches.data[0]?.id;

      let statsField = {
        name: "Last Match Stats",
        value: "N/A",
        inline: false,
      };
      let gameMode = "N/A";
      let mapName = "N/A";
      let createdAt = "N/A"; // New variable for match creation date

      if (firstMatchId) {
        try {
          const matchResponse = await getMatchDetail(firstMatchId);
          // Update gameMode, mapName, and createdAt from match details
          gameMode = matchResponse.data.attributes.gameMode || "N/A";
          mapName = matchResponse.data.attributes.mapName || "N/A";
          createdAt = matchResponse.data.attributes.createdAt || "N/A";
          // Find the participant whose stats.playerId equals the player's id

          for (const element of matchResponse.included) {
            if (element.attributes.stats.playerId == player.id) {
              const stats = element.attributes.stats;
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

              break;
            }
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
          statsField,
          { name: "Game Mode", value: gameMode, inline: true },
          { name: "Map Name", value: mapName, inline: true },
          { name: "Match Created At", value: createdAt, inline: true } // New embed field for match creation date
        )
        .setFooter({ text: "PUBG Player Details" })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error: any) {
      await interaction.editReply({
        content: error instanceof Error ? error.message : String(error),
      });
    }
  },
  cooldown: 3,
  category: "llm",
};

export default command;
