import {
  ChannelType,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";
import { playTTS } from "../../utils/tt-helper.js";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("curse_run")
    .addStringOption((option) => {
      return option
        .setName("input")
        .setDescription("Ne dicen?")
        .setMaxLength(500)
        .setRequired(true);
    })
    .setDescription("Söv ve kaç!") as SlashCommandBuilder,
  execute: async (interaction) => {
    if (interaction.guildId === null || interaction.guild === null) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Servedan dogru cagir beni!",
      });
      return;
    }

    const input = String(interaction.options.get("input")?.value);

    if (input === null) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Bir seyler soylemem lazim!",
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

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      await playTTS(interaction, voiceChannel.id, input);

      await interaction.editReply({
        content: "Sövdüm!",
      });
    } catch (error) {
      console.log(error);
      await interaction.reply("soyleyemedim");
    }
  },
  cooldown: 3,
  category: "voice",
};

export default command;
