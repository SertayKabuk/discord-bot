import { ChannelType, GuildMember, MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import { joinVoiceChannel } from "@discordjs/voice";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("join_channel")
    .setDescription("Joins a channel!") as SlashCommandBuilder,
  execute: async (interaction) => {
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

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    await interaction.reply("Geldim!");
  },
  cooldown: 3,
  category: "voice",
};

export default command;
