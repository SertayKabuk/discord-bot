import {
  ChannelType,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";
import openai from "../../openai-helper.js";
import { concat } from "@langchain/core/utils/stream";
import { playTTS } from "../../tt-helper.js";
import { fetchFilteredLLMModels } from "../../api/openrouter-helper.js";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("llm")
    .addStringOption((option) => {
      return option
        .setName("prompt")
        .setDescription("prompt")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("model")
        .setDescription("Search llm model")
        .setRequired(true)
        .setAutocomplete(true);
    })
    .addBooleanOption((option) => {
      return option
        .setName("talk")
        .setDescription("Konuşayım mı?")
        .setRequired(false);
    })
    .setDescription("Chat with LLM!") as SlashCommandBuilder,
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
    const input = interaction.options.getString("prompt");
    const selectedModel = interaction.options.getString("model");
    const talk = interaction.options.getBoolean("talk") ?? false;

    if (!input || input === null || input === "") {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Bir seyler soylemem lazim!",
      });
      return;
    }

    if (talk === true) {
      if (interaction.guildId === null || interaction.guild === null) {
        await interaction.reply({
          flags: MessageFlags.Ephemeral,
          content: "Servedan dogru cagir beni!",
        });
        return;
      }

      //get current users voice channel
      const member = interaction.member;
      if (!member) {
        await interaction.reply({
          flags: MessageFlags.Ephemeral,
          content: "Seni bulamadim!",
        });
        return;
      }

      const voiceChannel = (member as GuildMember).voice.channel;

      if (
        !voiceChannel ||
        voiceChannel === null ||
        voiceChannel.type !== ChannelType.GuildVoice
      ) {
        await interaction.reply({
          flags: MessageFlags.Ephemeral,
          content: "Bir ses kanalinda olmalisin!",
        });

        return;
      }

      try {
        await interaction.deferReply();

        const chatReponse = await openai.chat(
          [
            {
              role: "user",
              content: `Detay: Türkçe olarak cevap ver. Cevabını sese dönüştüreceğim. O yüzden kısa ve net cevaplar ver.
              Soru: ${input}`,
            },
          ],
          selectedModel ?? "gpt-3.5-turbo"
        );

        if (chatReponse && chatReponse.length > 0) {
          await interaction.editReply(chatReponse);
          await playTTS(interaction, voiceChannel.id, chatReponse);
        } else {
          await interaction.editReply("Şu an cevap verecek mecalim yok.");
        }
      } catch (error) {
        console.log(error);
        await interaction.editReply("Pc kapali daha sonra gel.");
      }
    } else {
      try {
        await interaction.deferReply();

        const stream = openai.stream(
          [
            {
              role: "user",
              content: input,
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

        if (gathered === null) {
          await interaction.editReply("Şu an cevap verecek mecalim yok.");
        }
      } catch (error) {
        console.log(error);
        await interaction.editReply("Pc kapali daha sonra gel.");
      }
    }
  },
  cooldown: 3,
  category: "llm",
};

export default command;
