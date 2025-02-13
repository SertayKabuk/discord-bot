import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import {
  getPlayerDetail,
  getMatchDetail,
  summarizeMatchDetails,
} from "../../utils/pubg-helper.js";
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
    const otherNickname = interaction.options.getString("other-nickname");

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

      const { avgStats, matchSummaries } = summarizeMatchDetails(
        player.id,
        matchDataList
      );

      // Format average stats with emojis and better organization
      const formattedAvgStats = avgStats.replace(/•/g, '➤')
        .replace('Kills:', '🎯 Kills:')
        .replace('Damage:', '💥 Damage:')
        .replace('Survived:', '⏱️ Survived:')
        .replace('Assists:', '🤝 Assists:')
        .replace('Headshot Kills:', '🎯 Headshot Kills:')
        .replace('DBNOs:', '🔫 DBNOs:')
        .replace('Walk Distance:', '👣 Walk Distance:')
        .replace('Ride Distance:', '🚗 Ride Distance:')
        .replace('Revives:', '❤️ Revives:')
        .replace('WinPlace:', '🏆 Average Place:');

      // Format match summaries with emojis and better organization
      const formattedMatchSummaries = matchSummaries.map((summary, index) => {
        const [dateTime, ...details] = summary.split(', ');
        return `**Match ${index + 1}** | ${dateTime}\n` +
          details.join('\n').replace('Kills', '🎯 Kills')
            .replace('Damage', '💥 Damage')
            .replace('Survived', '⏱️ Survived')
            .replace('Assists', '🤝 Assists')
            .replace('Map', '🗺️ Map')
            .replace('Place', '🏆 Place');
      });

      const embed = new EmbedBuilder()
        .setColor(0x2f3136) // Discord dark theme color for better visibility
        .setTitle(`📊 PUBG Player Stats: ${player.attributes.name}`)
        .setDescription(`Detailed statistics for the last 5 matches`)
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
            value: formattedAvgStats,
            inline: false
          },
          {
            name: "🎮 Recent Matches",
            value: formattedMatchSummaries.length ? formattedMatchSummaries.join('\n\n') : "No recent matches found",
            inline: false
          }
        )
        .setFooter({ 
          text: `Data refreshed ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
          iconURL: "https://wstatic-prod.pubg.com/web/live/static/favicons/favicon-16x16.png"
        })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });

      // *** Background process: fetch and insert all match details ***
      // This async process will retrieve all matches without affecting the reply.
      setTimeout(() => {
        if (player.relationships.matches?.data?.length) {
          Promise.allSettled(
            player.relationships.matches.data.map((matchObj) =>
              getMatchDetail(matchObj.id)
            )
          )
            .then(() =>
              console.log("Background fetching of all match details complete")
            )
            .catch((err) =>
              console.error("Error in background fetching match details", err)
            );
        }
      }, 0);
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
