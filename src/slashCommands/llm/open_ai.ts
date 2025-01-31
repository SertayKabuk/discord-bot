import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import openai from "../../openai_helper.js";
import { concat } from "@langchain/core/utils/stream";
import { httpClient } from "../../httpClient.js";

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
    .setDescription("Chat with LLM!") as SlashCommandBuilder,
  autocomplete: async (interaction) => {
    const response = await httpClient.Get<ApiResponse>(
      "https://openrouter.ai/api/v1/models"
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

    if (input !== null) {
      try {
        const stream = await openai.chat(
          [
            {
              role: "user",
              content: input,
            },
          ],
          selectedModel ?? "gpt-3.5-turbo"
        ); // You'll need to modify your openai_helper to handle model selection

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
    } else {
      await interaction.editReply("Bisiy yaz.");
    }
  },
  cooldown: 3,
  category: "llm",
};

export default command;
