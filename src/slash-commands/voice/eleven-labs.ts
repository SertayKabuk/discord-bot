import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection } from "@discordjs/voice";
import elevenLabs from "../../utils/eleven-labs-helper.js";
import { Readable } from "stream";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("eleven-labs")
    .addStringOption((option) => {
      return option
        .setName("input")
        .setDescription("Ne solicen?")
        .setMaxLength(500)
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("voice_id")
        .setMaxLength(100)
        .setRequired(false);
    })
    .setDescription("Soverim!") as SlashCommandBuilder,
  execute: async (interaction) => {
    const input = String(interaction.options.get("input")?.value);
    const voiceId = interaction.options.getString("voiceId");

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
      
        const audioBuffer = await elevenLabs.createAudioStreamFromText(input, voiceId);

        const audioStream = Readable.from(audioBuffer);
        
        const player = createAudioPlayer();
      
        player.on(AudioPlayerStatus.Playing, () => {
          console.log(
            `The audio player has started playing! ${interaction.user.displayName} : ${input}`
          );
        });
      
        player.on("error", (error: any) => {
          console.error(`Error: ${error.message} with resource ${input}`);
        });
      
        const resource = createAudioResource(audioStream);
        const subscription = connection.subscribe(player);
        player.play(resource);
      
        player.on(AudioPlayerStatus.Idle, () => {
          subscription?.unsubscribe();
        });
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
