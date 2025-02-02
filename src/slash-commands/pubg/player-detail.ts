import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import {
  getPlayerDetail,
  getMatchDetail,
  summarizeMatchDetails,
} from "../../api/pubg-helper.js";
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

      const embed = new EmbedBuilder()
        .setColor(0xffa500)
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
