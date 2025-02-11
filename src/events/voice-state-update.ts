import { VoiceState } from "discord.js";
import { BotEvent } from "../types.js";
import {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
} from "@discordjs/voice";
import mqConnection from "../utils/rabbitmq-helper.js";
import { Readable } from "stream";
import { QueueNames } from "../constants/queue-names.js";

const event: BotEvent = {
  name: "voiceStateUpdate",
  execute: async (oldState: VoiceState, newState: VoiceState) => {

    try {

      const datetime = new Date();
      console.log(`${datetime.toISOString()} | ${oldState.member?.user.globalName} | ${oldState.guild?.name}:${oldState.channel?.name} ==> ${newState.guild?.name}:${newState.channel?.name}`);

      // Check if user joined a voice channel
      if (!oldState.channelId && newState.channelId) {

        if (!oldState.streaming && newState.streaming) {
          console.log(`${datetime.toISOString()} | ${newState.member?.user.globalName} | started streaming | ${newState.guild?.name}:${newState.channel?.name}`);
        }
        else if (oldState.streaming && !newState.streaming) {
          console.log(`${datetime.toISOString()} | ${newState.member?.user.globalName} | stopped streaming | ${newState.guild?.name}:${newState.channel?.name}`);
        }

        const connection = getVoiceConnection(newState.guild.id);

        if (!connection) {
          return;
        }

        if (connection.joinConfig.channelId !== newState.channelId) {
          return;
        }

        if (connection.state.status !== "ready") {
          console.log("Voice connection not ready");
          return;
        }

        // Get welcome message
        const input = getWelcomeMessage(newState);

        const base64Wav = await mqConnection.sendToQueue(QueueNames.TTS_INPUT, input);
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

const getWelcomeMessage = (newState: VoiceState): string => {

  const welcomeMessages = [
    "Hoş geldin değerli arkadaşım {name}. Nasılsın?",
    "Vay vay vay kimler gelmiş! {name} hoş geldin!",
    "Oh oh! {name} gelmiş, sefalar getirdin!",
    "Selam {name}! Seni görmek ne güzel.",
    "Hey {name}! Hoş geldin aramıza!",
  ];

  // Replace static input with random message
  const randomMessage =
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  const input = randomMessage.replace(
    "{name}",
    newState.member?.displayName || "dostum"
  );

  return input;
};

export default event;
