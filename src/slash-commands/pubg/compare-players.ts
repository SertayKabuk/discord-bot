import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import {
  getPlayerDetail,
  getMatchDetail,
  summarizeMatchDetails,
} from "../../api/pubg-helper.js";
import { SlashCommand } from "../../types.js";
import { fetchFilteredLLMModels } from "../../api/openrouter-helper.js";
import openai from "../../openai-helper.js";
import { concat } from "@langchain/core/utils/stream";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("pubg-compare-players")
    .addStringOption((option) => {
      return option
        .setName("gay1")
        .setDescription("Pipisi küçük olanın nickname'i")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("gay2")
        .setDescription("Pipisi büyük olanın nickname'i")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("model")
        .setDescription("Search llm model")
        .setRequired(true)
        .setAutocomplete(true);
    })
    .setDescription("PUBG kim daha gay?") as SlashCommandBuilder,
  autocomplete: async (interaction) => {
    const filteredModels = await fetchFilteredLLMModels();
    if (!filteredModels) return;

    interaction.respond(
      filteredModels.map((model) => ({
        name: model.name,
        value: model.id,
      }))
    );
  },
  execute: async (interaction) => {
    const player1Nickname = interaction.options.getString("gay1");
    const player2Nickname = interaction.options.getString("gay2");
    const selectedModel = interaction.options.getString("model");

    if (
      !player1Nickname ||
      player1Nickname === null ||
      player1Nickname === ""
    ) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Pipisi küçük olanın nickname'ini girmelisin!",
      });
      return;
    }
    if (
      !player2Nickname ||
      player2Nickname === null ||
      player2Nickname === ""
    ) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Pipisi büyük olanın nickname'ini girmelisin!",
      });
      return;
    }

    try {
      await interaction.deferReply();

      const player1Data = await getPlayerDetail(player1Nickname);
      // Use the first player from the data array
      if (player1Data.data.length === 0) {
        await interaction.editReply({
          content: "No player found for that nickname.",
        });
        return;
      }

      const player2Data = await getPlayerDetail(player2Nickname);
      // Use the first player from the data array
      if (player1Data.data.length === 0) {
        await interaction.editReply({
          content: "No player found for that nickname.",
        });
        return;
      }

      const player1 = player1Data.data[0];

      const matchList1 = player1.relationships.matches?.data?.slice(0, 5) || [];
      const matchDataList1 = [];
      for (const matchObj of matchList1) {
        try {
          const matchDetail = await getMatchDetail(matchObj.id);
          matchDataList1.push(matchDetail);
        } catch (e) {
          console.error(`Error fetching match ${matchObj.id}`, e);
        }
      }

      const detail1 = summarizeMatchDetails(player1.id, matchDataList1);

      const player2 = player2Data.data[0];

      const matchList2 = player2.relationships.matches?.data?.slice(0, 5) || [];
      const matchDataList2 = [];
      for (const matchObj of matchList2) {
        try {
          const matchDetail = await getMatchDetail(matchObj.id);
          matchDataList2.push(matchDetail);
        } catch (e) {
          console.error(`Error fetching match ${matchObj.id}`, e);
        }
      }

      const detail2 = summarizeMatchDetails(player2.id, matchDataList2);

      try {

        const stream = openai.stream(
          [
            {
              role: "user",
              content: `Senin görevin aşağıda verilen iki PUBG oyuncusunun verilerini karşılaştırmak ve hangisinin daha iyi olduğunu belirlemek. Türkçe cevap ver. Espirili ve kinayeli cevaplar ver. Dalga geçebilirsin. En iyi olanın pipisi daha büyüktür ve daha gay birisidir.
              
              Oyuncu 1 Adı: ${player1Nickname}
              Oyuncu 1 Son 5 Maç Ortalaması: 
              ${detail1.matchSummaries}
              __________________________________________
              Oyuncu 2 Adı: ${player2Nickname}
              Oyuncu 2 Son 5 Maç Ortalaması: 
              ${detail2.matchSummaries}`,
            },
          ],
          selectedModel ?? "gpt-3.5-turbo"
        );

        let gathered: string | null = null;

        for await (const chunk of stream) {
          if (gathered === null) {
            gathered = chunk;
          } else {
            gathered = concat(gathered, chunk);
          }

          if (gathered !== null)
            await interaction.editReply((gathered ?? "").toString());
        }
      } catch (error) {
        console.log(error);
        await interaction.editReply("Pc kapali daha sonra gel.");
      }
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
