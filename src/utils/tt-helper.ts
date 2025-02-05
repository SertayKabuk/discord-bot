import { Buffer } from "buffer";
import { Readable } from "stream";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import mqConnection from "../utils/rabbitmq-helper.js";
import { ChatInputCommandInteraction } from "discord.js";
import { QueueNames } from "../constants/queue-names.js";

// Expose the playTTS function to generate and play TTS audio.
export async function playTTS(
  interaction: ChatInputCommandInteraction,
  voiceChannelId: string,
  input: string
) {
  const base64Wav = await mqConnection.sendToQueue(QueueNames.TTS_INPUT, input);
  const binaryWav = Buffer.from(base64Wav, "base64");
  const audioStream = Readable.from(binaryWav);

  let connection = getVoiceConnection(interaction.guildId!);
  let amIAlreadyInVoiceChannel = true;
  if (!connection) {
    amIAlreadyInVoiceChannel = false;
    connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: interaction.guildId!,
      adapterCreator: interaction.guild!.voiceAdapterCreator,
    });
  }

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
    if (!amIAlreadyInVoiceChannel) {
      connection.destroy();
    }
  });
}
