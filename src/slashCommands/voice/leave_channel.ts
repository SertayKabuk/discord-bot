import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import { getVoiceConnection } from "@discordjs/voice";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("leave_channel")
    .setDescription("Leave from a channel!") as SlashCommandBuilder,
  execute: async (interaction) => {
    if (interaction.guildId === null || interaction.guild === null) {
      await interaction.reply({
        ephemeral: true,
        content: "Serverdan dogru cagir beni!",
      });
      return;
    }

    const connection = getVoiceConnection(interaction.guildId);

    if (!connection) {
      await interaction.reply({
        ephemeral: true,
        content: "Bir ses kanalinda olmalisin!",
      });
      return;
    }

    connection.destroy();

    await interaction.reply("Gittim!");
  },
  cooldown: 3,
  category: "voice",
};

export default command;
