import { Message, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import ollama from "../../utils/ollama-helper.js";
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

        let gathered: string | undefined = '';
        let messages: string[] = [''];
        let followUpMessages: Message[] = [];

        for await (const chunk of stream) {
          if (gathered === null) {
            gathered = (chunk.content ?? '').toString();
          } else {
            gathered = concat(gathered, (chunk.content ?? '').toString())
          }

          if (gathered !== null) {
            const content = gathered.toString();

            // Split content into parts if it exceeds Discord's limit
            if (content.length > 2000) {
              messages = [];
              let remainingContent = content;
              while (remainingContent.length > 0) {
                // Try to split at a natural break point
                let splitPoint = 1999;
                if (remainingContent.length > 2000) {
                  // Look for last sentence end or space before the limit
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
                await interaction.editReply(messages[0]);

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
