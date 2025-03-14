import {
  ChannelType,
  GuildMember,
  Message,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";
import openai from "../../utils/openai-helper.js";
import { concat } from "@langchain/core/utils/stream";
import { playTTS } from "../../utils/tt-helper.js";
import { fetchFilteredLLMModels } from "../../utils/openrouter-helper.js";

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
    const focusedOption = interaction.options.getFocused(true);

    const filteredModels = await fetchFilteredLLMModels(focusedOption.value);
    if (!filteredModels) return;

    interaction.respond(
      filteredModels.slice(0, 25).map((choice) => ({ name: choice.name, value: choice.id }))
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

        let chatReponse = await openai.chat(
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

          if (chatReponse.length > 2000) chatReponse = chatReponse.slice(0, 2000);

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
        let messages: string[] = [''];
        let followUpMessages: Message[] = [];
        let didIStartSecondMessage = false;

        for await (const chunk of stream) {
          if (gathered === null) {
            gathered = chunk;
          } else {
            gathered = concat(gathered, chunk);
          }

          if (gathered !== null) {
            const content = gathered.toString();

            // Split content into parts if it exceeds Discord's limit
            if (content.length > 2000) {
              messages = [];
              let remainingContent = content;
              while (remainingContent.length > 0) {
                let splitPoint = 1999;
                if (remainingContent.length > 2000) {
                  const lastPeriod = remainingContent.slice(0, 1999).lastIndexOf('.');
                  const lastSpace = remainingContent.slice(0, 1999).lastIndexOf(' ');
                  splitPoint = lastPeriod > 0 ? lastPeriod + 1 : (lastSpace > 0 ? lastSpace : 1999);
                }

                messages.push(remainingContent.slice(0, splitPoint));
                remainingContent = remainingContent.slice(splitPoint);
              }

              // Update or create messages as needed
              if (messages.length > 0) {
                // Update first message
                if (!didIStartSecondMessage) {
                  await interaction.editReply(messages[0]);
                }

                if (messages.length > 1 && !didIStartSecondMessage) {
                  didIStartSecondMessage = true;
                }

                // Handle subsequent messages
                for (let i = 1; i < messages.length; i++) {
                  if (i - 1 < followUpMessages.length) {
                    // Update existing followUp message
                    await followUpMessages[i - 1].edit(messages[i]);
                  } else {
                    // Create new followUp message
                    const newMessage = await interaction.followUp(messages[i]);
                    followUpMessages.push(newMessage);
                  }
                }
              }
            } else {
              // If content is under 2000 characters, just update normally
              await interaction.editReply(content);
            }
          }
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
