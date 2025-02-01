import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import ollama from "../../ollama-helper.js";
import { concat } from "@langchain/core/utils/stream";

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
    const input = interaction.options.getString("prompt");
 
    if (input !== null) {
      try {
        const stream = await ollama.llm.stream([
          [
            "system",
            "You are a helpful assistant who talks to users in the Discord chat channel. Your answer should be short and witty.",
          ],
          ["human", input],
        ]);

        let gathered: string | undefined = undefined;
        
        for await (const chunk of stream) {
          if (gathered === undefined) {
            gathered = (chunk?.content ?? "").toString();
          } else {
            gathered = concat(gathered, (chunk?.content ?? "").toString());
          }

          if (gathered !== undefined)
            await interaction.editReply((gathered ?? "").toString());
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
