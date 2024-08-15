import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../../types";
import { DI } from "../../DI";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("ollama")
        .addStringOption(option => {
            return option
                .setName("prompt")
                .setDescription("prompt")
                .setRequired(true)
        })
        .setDescription("Chat with LLM!"),
    execute: async (interaction) => {
        await interaction.deferReply();
        const prompt = interaction.options.getString("prompt");

        if (prompt !== null) {

            try {
                const completion = await DI.llm.invoke(prompt);
                await interaction.editReply(completion);
            } catch (error) {
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