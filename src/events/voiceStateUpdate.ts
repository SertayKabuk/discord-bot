import { VoiceState } from "discord.js";
import { BotEvent } from "../types";
import {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
} from "@discordjs/voice";
import mqConnection from "../rabbit_mq_conn";
import { Readable } from "stream";

// Create array of welcome messages at the top of the file
const welcomeMessages = [
  "Hoş geldin değerli arkadaşım {name}. Nasılsın?",
  "Vay vay vay kimler gelmiş! {name} hoş geldin!",
  "Oh oh! {name} gelmiş, sefalar getirdin!",
  "Selam {name}! Seni görmek ne güzel.",
  "Hey {name}! Hoş geldin aramıza!",
];

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

        // Replace static input with random message
        const randomMessage =
          welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
          
        const input = randomMessage.replace(
          "{name}",
          newState.member?.displayName || "dostum"
        );

        const base64Wav = await mqConnection.sendToQueue("tts_input", input);
        const binaryWav = Buffer.from(base64Wav, "base64");

        // Create readable stream from buffer
        const audioStream = Readable.from(binaryWav);

        const player = createAudioPlayer();
        const resource = createAudioResource(audioStream);

        player.play(resource);
        connection.subscribe(player);

        // Error handling
        player.on("error", (error) => {
          console.error("Error:", error);
        });
      }
    } catch (error) {
      console.error("Error in voiceStateUpdate:", error);
    }
  },
};

export default event;
