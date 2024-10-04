import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import ollama from "../../ollama_helper";
import { concat } from "@langchain/core/utils/stream";
import type { AIMessageChunk } from "@langchain/core/messages";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("ollama")
    .addStringOption((option) => {
      return option
        .setName("prompt")
        .setDescription("prompt")
        .setRequired(true);
    })
    .setDescription("Chat with LLM!") as SlashCommandBuilder,
  execute: async (interaction) => {
    await interaction.deferReply();
    const prompt = interaction.options.getString("prompt");

    if (prompt !== null) {
      try {
        const stream = await ollama.llm.stream(prompt);

        let gathered: AIMessageChunk | undefined = undefined;

        for await (const chunk of stream) {
          console.log(chunk);
          if (gathered === undefined) {
            gathered = chunk;
          } else {
            gathered = concat(gathered, chunk);
          }

          if (gathered !== undefined)
            await interaction.editReply((gathered?.content ?? "").toString());
        }
      } catch (error) {
        console.log(error);
        await interaction.editReply("Pc kapali daha sonra gel.");
      }
    } else {
      await interaction.editReply("Bisiy yaz.");
    }
  },
  cooldown: 3,
  category: "llm",
};

export default command;
