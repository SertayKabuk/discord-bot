import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  StreamType,
} from "@discordjs/voice";
import ytdl from "@distube/ytdl-core";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("youtube")
    .addStringOption((option) => {
      return option
        .setName("url")
        .setDescription("Youtube url?")
        .setRequired(true);
    })
    .setDescription("Turku soylerim!") as SlashCommandBuilder,
  execute: async (interaction) => {
    const url = String(interaction.options.get("url")?.value);

    if (url === null) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: "Url?",
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

    await interaction.deferReply();
    await interaction.editReply("hazirliyorum...");

    try {

      const cookies = process.env.YOUTUBE_COOKIES ? JSON.parse(process.env.YOUTUBE_COOKIES) : [];

      const agent = ytdl.createAgent(cookies);

      const stream = ytdl(url, { filter: "audioonly", agent: agent });

      const resource = createAudioResource(stream, {
        inputType: StreamType.Opus,
      });

      const player = createAudioPlayer();

      player.on(AudioPlayerStatus.Playing, () => {
        console.log(
          `The audio player has started playing! ${interaction.user.displayName} : ${url}`
        );
      });

      player.on("error", (error: any) => {
        console.error(`Error: ${error.message} with resource ${url}`);
      });

      player.on(AudioPlayerStatus.Idle, () => {
        subscription?.unsubscribe();
      });

      const subscription = connection.subscribe(player);
      player.play(resource);

      await interaction.editReply(url);
    } catch (error) {
      console.log(error);
      await interaction.editReply("soyleyemedim");
    }
  },
  cooldown: 3,
  category: "voice",
};

export default command;
