import {
  ChannelType,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types.js";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import mqConnection from "../../rabbit_mq_conn.js";
import { Readable } from "stream";
import { QueueNames } from "../../constants/queue-names.js";

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
      await interaction.reply("Bisiy yaz.");
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

    let connection = getVoiceConnection(interaction.guildId);

    let amIAlreadyInVoiceChannel = true;

    if (!connection) {
      amIAlreadyInVoiceChannel = false;

      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    }

    try {
      const base64Wav = await mqConnection.sendToQueue(
        QueueNames.TTS_INPUT,
        input
      );

      const binaryWav = Buffer.from(base64Wav, "base64");

      // Create readable stream from buffer
      const audioStream = Readable.from(binaryWav);

      const player = createAudioPlayer();

      player.on(AudioPlayerStatus.Playing, () => {
        console.log(
          `The audio player has started playing! ${interaction.user.displayName} : ${input}`
        );
      });

      player.on("error", (error) => {
        console.error(`Error: ${error.message} with resource ${input}`);
      });

      const resource = createAudioResource(audioStream);
      const subscription = connection.subscribe(player);
      player.play(resource);

      player.on(AudioPlayerStatus.Idle, () => {
        subscription?.unsubscribe();
        if (!amIAlreadyInVoiceChannel) {
          connection.destroy();
        }
      });

      await interaction.reply({
        content: "Sövdüm!",
      });
    } catch (error) {
      console.log(error);
      connection.destroy();
      await interaction.reply("soyleyemem");
    }
  },
  cooldown: 3,
  category: "voice",
};

export default command;
