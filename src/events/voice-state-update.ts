import { Events, VoiceState } from "discord.js";
import { BotEvent } from "../types.js";
import {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import mqConnection from "../utils/rabbitmq-helper.js";
import { Readable } from "stream";
import { QueueNames } from "../constants/queue-names.js";
import dbHelper from "../db/db-helper.js";
import { VoiceStateEventType } from "../constants/voice-state-types.js";

const logVoiceStateToDb = async (oldState: VoiceState, newState: VoiceState, eventType: VoiceStateEventType) => {
  try {
    await dbHelper.prisma.voice_state_logs.create({
      data: {
        user_id: newState.member?.user.id || oldState.member?.user.id || "unknown",
        username: newState.member?.user.globalName || oldState.member?.user.globalName || "Unknown User",
        from_guild_id: oldState.guild?.id || "unknown",
        from_guild_name: oldState.guild?.name || "unknown",
        to_guild_id: newState.guild?.id || "unknown",
        to_guild_name: newState.guild?.name || "unknown",
        from_channel_id: oldState.channelId || "none",
        from_channel_name: oldState.channel?.name || "none",
        to_channel_id: newState.channelId || "none",
        to_channel_name: newState.channel?.name || "none",
        event_type: VoiceStateEventType[eventType]
      }
    });
  } catch (error) {
    console.error("Error logging voice state to database:", error);
  }
};

const logVoiceStateChanges = async (oldState: VoiceState, newState: VoiceState): Promise<void> => {
  let eventType: VoiceStateEventType | null = null;

  // Channel change
  if (oldState.channelId !== newState.channelId) {
    if (!oldState.channelId) {
      eventType = VoiceStateEventType.JOIN;
    } else if (!newState.channelId) {
      eventType = VoiceStateEventType.LEAVE;
    } else {
      eventType = VoiceStateEventType.MOVE;
    }
  }

  // Streaming state
  if (!oldState.streaming && newState.streaming) {
    eventType = VoiceStateEventType.STREAM_START;
  } else if (oldState.streaming && !newState.streaming) {
    eventType = VoiceStateEventType.STREAM_STOP;
  }

  // Self mute state
  if (!oldState.selfMute && newState.selfMute) {
    eventType = VoiceStateEventType.SELF_MUTE;
  } else if (oldState.selfMute && !newState.selfMute) {
    eventType = VoiceStateEventType.SELF_UNMUTE;
  }

  // Self deaf state
  if (!oldState.selfDeaf && newState.selfDeaf) {
    eventType = VoiceStateEventType.SELF_DEAF;
  } else if (oldState.selfDeaf && !newState.selfDeaf) {
    eventType = VoiceStateEventType.SELF_UNDEAF;
  }

  // Server mute state
  if (!oldState.serverMute && newState.serverMute) {
    eventType = VoiceStateEventType.SERVER_MUTE;
  } else if (oldState.serverMute && !newState.serverMute) {
    eventType = VoiceStateEventType.SERVER_UNMUTE;
  }

  // Server deaf state
  if (!oldState.serverDeaf && newState.serverDeaf) {
    eventType = VoiceStateEventType.SERVER_DEAF;
  } else if (oldState.serverDeaf && !newState.serverDeaf) {
    eventType = VoiceStateEventType.SERVER_UNDEAF;
  }

  // Video state
  if (!oldState.selfVideo && newState.selfVideo) {
    eventType = VoiceStateEventType.VIDEO_START;
  } else if (oldState.selfVideo && !newState.selfVideo) {
    eventType = VoiceStateEventType.VIDEO_STOP;
  }

  // Suppress state
  if (!oldState.suppress && newState.suppress) {
    eventType = VoiceStateEventType.SUPPRESS;
  } else if (oldState.suppress && !newState.suppress) {
    eventType = VoiceStateEventType.UNSUPPRESS;
  }

  if (eventType !== null) {
    await logVoiceStateToDb(oldState, newState, eventType);
  }
};

const event: BotEvent = {
  name: Events.VoiceStateUpdate,
  execute: async (oldState: VoiceState, newState: VoiceState) => {
    try {
      // Log all voice state changes
      await logVoiceStateChanges(oldState, newState);

      const connection = getVoiceConnection(newState.guild.id);

      if (connection && noOneLeft(oldState)) {
        connection.destroy();
        console.log(`No one left in the channel. ${newState.guild?.name}:${newState.channel?.name}`);
      }

      // Check if user joined a voice channel
      if (!oldState.channelId && newState.channelId) {
        if (!connection) {
          return;
        }

        if (connection.joinConfig.channelId !== newState.channelId) {
          return;
        }

        if (connection.state.status !== VoiceConnectionStatus.Ready) {
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
    "Buyur buyur {name}, gel otur şöyle!",
    "Aaa {name} gelmiş! Hoş geldin canım benim.",
    "Sonunda geldin {name}! Biz de seni bekliyorduk.",
    "Hoşgeldin {name} kardeşim, sefa getirdin!",
    "Ooo {name} aramıza katıldı, parti başlayabilir!",
    "Şeref verdin {name}, hoş geldin!",
    "Bak bak bak, kim gelmiş? {name} hoş geldin!",
    "Efendim, hoş geldiniz sayın {name}!",
    "Keyifler nasıl {name}? Hoş geldin aramıza!",
    "Nihayet {name} geldi, takım tamamlandı!"
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

const noOneLeft = (oldState: VoiceState): boolean => {
  return oldState.channel?.members.size === 1;
};

export default event;
