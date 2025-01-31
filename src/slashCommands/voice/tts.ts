import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import mqConnection from "../../rabbit_mq_conn.js";
import { Readable } from "stream";
import { QueueNames } from "../../constants/queue-names.js";

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
      await interaction.reply("Bisiy yaz.");
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

    await interaction.deferReply();
    await interaction.reply({ flags: MessageFlags.Ephemeral, content: "hazirliyorum..." });

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
      });

      await interaction.reply({
        content: "dedim",
      });
    } catch (error) {
      console.log(error);
      await interaction.reply("soyleyemem");
    }
  },
  cooldown: 3,
  category: "voice",
};

export default command;
