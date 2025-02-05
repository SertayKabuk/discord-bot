import { SlashCommandBuilder, AttachmentBuilder } from "discord.js"
import { SlashCommand } from "../../types.js";
import mqConnection from "../../utils/rabbitmq-helper.js";
import { QueueNames } from "../../constants/queue-names.js";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("flux")
        .addStringOption(option => {
            return option
                .setName("prompt")
                .setDescription("prompt")
                .setRequired(true)
        })
        .setDescription("Generate image with Flux!") as SlashCommandBuilder,
    execute: async (interaction) => {
        await interaction.deferReply();
        const prompt = interaction.options.getString("prompt");

        if (prompt !== null) {
            try {
                const base64Image = await mqConnection.sendToQueue(QueueNames.FLUX_INPUT, prompt);

                const imageBuffer = Buffer.from(base64Image, 'base64');

                const attachment = new AttachmentBuilder(imageBuffer, { name: 'image.png' });

                await interaction.editReply({ content: 'Olmus mu?', files: [attachment] });
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