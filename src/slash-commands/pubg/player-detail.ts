import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import {
  getPlayerDetail,
  getMatchDetail,
  summarizeMatchDetails,
  PubgMatchResponse,
} from "../../utils/pubg-helper.js";
import { SlashCommand } from "../../types.js";
import mongoHelper from "../../db/mongo-helper.js";
import { MongoCollectionNames } from "../../constants/mongo-collection-names.js";

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

      if (player.relationships.matches?.data?.length) {

        try {
          await Promise.allSettled(
            player.relationships.matches.data.map((matchObj) =>
              getMatchDetail(matchObj.id)
            )
          );
        }
        catch (err) {
          console.error("Error in background fetching match details", err);
        }
      }

      const minSurvivalTimeInSeconds = 120; // 120 seconds = 2 minutes

      // Retrieve last 5 matches details
      const last5Matches = mongoHelper.find(MongoCollectionNames.MATCH_COLLECTION,
        {
          "included": {
            $elemMatch: {
              "attributes.stats.playerId": player.id,
              "attributes.stats.timeSurvived": { $gt: minSurvivalTimeInSeconds }
            }
          }
        },
        {
          limit: 5,
          sort: { "data.attributes.createdAt": -1 },
          projection: {
            "data": 1,
            "included.$": 1  // This will only return the matched element in the included array
          }
        }
      );

      const matchDataList = [];

      for await (const match of last5Matches) {
        matchDataList.push(match);
      }

      const { avgStats, matchSummaries } = summarizeMatchDetails(
        player.id,
        matchDataList
      );

      // Format match summaries with links
      const formattedMatchSummaries = matchSummaries.map((matchData, index) => {
        const [dateTime, ...details] = matchData.summary.split(', ');
        return `[**Match ${index + 1}** | ${dateTime}](${process.env.UI_BASE_URL}/matches/${matchData.matchId}) [Replay](https://pubg.sh/${nickname}/${player.attributes.shardId}/${matchData.matchId})\n${details.join('\n')}`;
      });

      const embed = new EmbedBuilder()
        .setColor(0x2f3136) // Discord dark theme color for better visibility
        .setTitle(`📊 PUBG Player Stats: ${player.attributes.name}`)
        .setDescription(`Last 5 matches (${minSurvivalTimeInSeconds} seconds or more survival time)`)
        .setThumbnail(
          "https://wstatic-prod.pubg.com/web/live/static/favicons/android-icon-192x192.png"
        )
        .addFields(
          {
            name: "👤 Player Information",
            value: [
              `**ID:** ${player.id}`,
              `**Ban Status:** ${player.attributes.banType || 'None'}`,
              `**Clan:** ${player.attributes.clanId || 'Not in a clan'}`
            ].join('\n'),
            inline: false
          },
          {
            name: "📈 Average Performance",
            value: avgStats,
            inline: false
          }
        );

      // Add each match as a separate field
      if (formattedMatchSummaries.length) {
        formattedMatchSummaries.forEach((matchSummary, index) => {
          embed.addFields({
            name: `🎮 Match ${index + 1}`,
            value: matchSummary,
            inline: false
          });
        });
      } else {
        embed.addFields({
          name: "🎮 Recent Matches",
          value: "No recent matches found",
          inline: false
        });
      }

      embed.setFooter({
        text: `Data refreshed ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        iconURL: "https://wstatic-prod.pubg.com/web/live/static/favicons/favicon-16x16.png"
      })
      .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });


    } catch (error: any) {
      console.error("Error fetching player detail:", error);
      await interaction.editReply({
        content: error instanceof Error ? error.message : String(error),
      });
    }
  },
  cooldown: 3,
  category: "llm",
};

export default command;
