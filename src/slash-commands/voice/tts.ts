import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import { getVoiceConnection } from "@discordjs/voice";
import { playTTS } from "../../tt-helper.js";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("tts")
    .addStringOption((option) => {
      return option
        .setName("input")
        .setDescription("Ne solicen?")
        .setMaxLength(500)
        .setRequired(true);
    })
    .setDescription("Soverim!") as SlashCommandBuilder,
  execute: async (interaction) => {
    const input = String(interaction.options.get("input")?.value);

    if (input === null) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Bir seyler soylemem lazim!",
      });
      return;
    }

    if (interaction.guildId === null || interaction.guild === null) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Servedan dogru cagir beni!",
      });
      return;
    }

    const connection = getVoiceConnection(interaction.guildId);

    if (!connection) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Bot kanalda degil, kanala cagir!",
      });
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    await interaction.editReply("hazirliyorum...");

    try {
      await playTTS(interaction, connection.joinConfig.channelId!, input);

      await interaction.editReply("dedim");
    } catch (error) {
      console.log(error);
      await interaction.editReply("soyleyemedim");
    }
  },
  cooldown: 3,
  category: "voice",
};

export default command;
