import { VoiceState } from "discord.js";
import { BotEvent } from "../types";
import {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
} from "@discordjs/voice";
import mqConnection from "../rabbit_mq_conn";
import { Readable } from 'stream';

const event: BotEvent = {
  name: "voiceStateUpdate",
  execute: async (oldState: VoiceState, newState: VoiceState) => {
    try {
      // Check if user joined a voice channel
      if (!oldState.channelId && newState.channelId) {
        const connection = getVoiceConnection(newState.guild.id);

        if (!connection) {
          console.log("No voice connection found");
          return;
        }

        if (connection.joinConfig.channelId !== newState.channelId) {
          console.log("User joined different channel");
          return;
        }

        if (connection.state.status !== "ready") {
          console.log("Voice connection not ready");
          return;
        }

        const input = `Hoş geldin değerli arkadaşım ${newState.member?.displayName}. Nasılsın?`;

        const base64Wav = await mqConnection.sendToQueue("tts_input", input);
        const binaryWav = Buffer.from(base64Wav, "base64");

        // Create readable stream from buffer
        const audioStream = Readable.from(binaryWav);

        const player = createAudioPlayer();
        const resource = createAudioResource(audioStream);

        player.play(resource);
        connection.subscribe(player);

        // Error handling
        player.on('error', error => {
          console.error('Error:', error);
        });

      }
    } catch (error) {
      console.error('Error in voiceStateUpdate:', error);
    }
  }
};

export default event;
