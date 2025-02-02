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

      // Retrieve last 5 match details
      const matchList = player.relationships.matches?.data?.slice(0, 5) || [];
      const matchDataList = [];
      for (const matchObj of matchList) {
        try {
          const matchDetail = await getMatchDetail(matchObj.id);
          matchDataList.push(matchDetail);
        } catch (e) {
          console.error(`Error fetching match ${matchObj.id}`, e);
        }
      }

      // Aggregate stats and collect match summaries
      let totalKills = 0,
        totalDamage = 0,
        totalSurvived = 0,
        totalAssists = 0,
        totalHeadshotKills = 0,
        totalDBNOs = 0,
        totalWalkDistance = 0,
        totalRideDistance = 0,
        totalRevives = 0;
      let countMatches = 0;
      const matchSummaries: string[] = [];

      for (const matchResponse of matchDataList) {
        const participant = matchResponse.included.find(
          (element: any) => element.attributes?.stats?.playerId === player.id
        );
        if (participant) {
          const stats = participant.attributes.stats;
          totalKills += stats.kills;
          totalDamage += stats.damageDealt;
          totalSurvived += stats.timeSurvived;
          totalAssists += stats.assists;
          totalHeadshotKills += stats.headshotKills;
          totalDBNOs += stats.DBNOs;
          totalWalkDistance += stats.walkDistance;
          totalRideDistance += stats.rideDistance;
          totalRevives += stats.revives;
          countMatches++;

          // Retrieve additional match details
          const gameMode = matchResponse.data.attributes.gameMode || "N/A";
          const mapName = matchResponse.data.attributes.mapName || "N/A";
          const createdAt = matchResponse.data.attributes.createdAt || "N/A";

          matchSummaries.push(
            `• Created At ${createdAt}, Game Mode ${gameMode}, Map ${mapName}, Kills ${stats.kills}, Damage ${stats.damageDealt.toFixed(0)}, Survived ${stats.timeSurvived}s`
          );
        }
      }

      // Reformat average stats with bullet points for clarity
      let avgStats = "N/A";
      if (countMatches > 0) {
        avgStats = `• Kills: ${(totalKills / countMatches).toFixed(1)}
                    • Damage: ${(totalDamage / countMatches).toFixed(1)}
                    • Survived: ${(totalSurvived / countMatches).toFixed(1)}s
                    • Assists: ${(totalAssists / countMatches).toFixed(1)}
                    • Headshot Kills: ${(
                      totalHeadshotKills / countMatches
                    ).toFixed(1)}
                    • DBNOs: ${(totalDBNOs / countMatches).toFixed(1)}
                    • Walk Distance: ${(
                      totalWalkDistance / countMatches
                    ).toFixed(1)}
                    • Ride Distance: ${(
                      totalRideDistance / countMatches
                    ).toFixed(1)}
                    • Revives: ${(totalRevives / countMatches).toFixed(1)}`;
      }

      const embed = new EmbedBuilder()
        .setColor(0xFFA500)
        .setTitle(player.attributes.name)
        .setThumbnail(
          "https://wstatic-prod.pubg.com/web/live/static/favicons/android-icon-192x192.png"
        )
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
            name: "Last 5 Match Average Stats",
            value: avgStats,
            inline: false,
          },
          {
            name: "Last 5 Match Details",
            value: matchSummaries.length ? matchSummaries.join("\n") : "N/A",
            inline: false,
          }
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
