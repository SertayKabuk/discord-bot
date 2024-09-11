import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../../types";
import ollama from "../../ollama_helper";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("ollama")
        .addStringOption(option => {
            return option
                .setName("prompt")
                .setDescription("prompt")
                .setRequired(true)
        })
        .setDescription("Chat with LLM!") as SlashCommandBuilder,
    execute: async (interaction) => {
        await interaction.deferReply();
        const prompt = interaction.options.getString("prompt");

        if (prompt !== null) {

            try {
                const completion = await ollama.llm.invoke(prompt);
                await interaction.editReply(completion);
            } catch (error) {
                console.log(error);
                await interaction.editReply("Pc kapali daha sonra gel.");
            }
        }
        else {
            await interaction.editReply("Bisiy yaz.");
        }
    },
    cooldown: 3,
    category: "llm"
};

export default command