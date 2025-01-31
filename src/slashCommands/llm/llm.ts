import { ChannelType, GuildMember, MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import openai from "../../openai_helper.js";
import { concat } from "@langchain/core/utils/stream";
import { httpClient } from "../../httpClient.js";
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

// Define interfaces for API response
interface ApiResponse {
  data: Model[];
}

interface Model {
  id: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type: string;
  };
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
    is_moderated: boolean;
  };
  per_request_limits: any;
}

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("llm")
    .addStringOption((option) => {
      return option
        .setName("prompt")
        .setDescription("prompt")
        .setRequired(true);
    })
    .addStringOption((option) => {
      option
        .setName("model")
        .setDescription("Search llm model")
        .setRequired(true)
        .setAutocomplete(true);
      return option;
    })
    .addBooleanOption((option) => {
      return option
        .setName("talk")
        .setDescription("Konuşayım mı?")
        .setRequired(false);
    })
    .setDescription("Chat with LLM!") as SlashCommandBuilder,
  autocomplete: async (interaction) => {
    const response = await httpClient.Get<ApiResponse>(
      process.env.OPEN_ROUTER_URL + "/models"
    );

    const filteredModels = response?.data.filter(
      (model) =>
        model.pricing.prompt === "0" &&
        model.architecture.modality === "text->text"
    );

    if (!filteredModels) return;

    interaction.respond(
      filteredModels.map((model) => ({
        name: model.name,
        value: model.id,
      }))
    );
  },
  execute: async (interaction) => {
    await interaction.deferReply();
    const input = interaction.options.getString("prompt");
    const selectedModel = interaction.options.getString("model");
    const talk = interaction.options.getBoolean("talk") ?? false;

    if (!input || input === null || input === "") {
      await interaction.reply("Bisiy yaz.");
      return;
    }

    if (talk === true) {
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

      try {
        const chatReponse = await openai.chat(
          [
            {
              role: "system",
              content: "Türkçe olarak cevap ver. Cevabını sese dönüştüreceğim. O yüzden kısa ve net cevaplar ver.",
            },
            {
              role: "user",
              content: input,
            },
          ],
          selectedModel ?? "gpt-3.5-turbo"
        );

        if (chatReponse) {
          await interaction.editReply(chatReponse);

          const base64Wav = await mqConnection.sendToQueue(
            QueueNames.TTS_INPUT,
            chatReponse
          );

          const binaryWav = Buffer.from(base64Wav, "base64");

          // Create readable stream from buffer
          const audioStream = Readable.from(binaryWav);

          let connection = getVoiceConnection(interaction.guildId);

          if (!connection) {
            connection = joinVoiceChannel({
              channelId: voiceChannel.id,
              guildId: interaction.guildId,
              adapterCreator: interaction.guild.voiceAdapterCreator,
            });
          }

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
            connection.destroy();
          });
        }
      } catch (error) {
        console.log(error);
        await interaction.editReply("Pc kapali daha sonra gel.");
      }
    } else {
      try {
        const stream = openai.stream(
          [
            {
              role: "user",
              content: input,
            },
          ],
          selectedModel ?? "gpt-3.5-turbo"
        );

        let gathered: string | null = null;

        for await (const chunk of stream) {
          if (gathered === null) {
            gathered = chunk;
          } else {
            gathered = concat(gathered, chunk);
          }

          if (gathered !== null)
            await interaction.editReply((gathered ?? "").toString());
        }
      } catch (error) {
        console.log(error);
        await interaction.editReply("Pc kapali daha sonra gel.");
      }
    }
  },
  cooldown: 3,
  category: "llm",
};

export default command;
