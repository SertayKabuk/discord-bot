import { ChannelType, MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import { ChannelMessage } from "../../db/entities/ChannelMessage.entity.js";
import dbHelper from "../../db/db-helper.js";
import discordClient from "../../utils/discord-client-helper.js";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import urlParserHelper from "../../utils/url-parser-helper.js";
import vectorStoreHelper from "../../utils/vector-store-helper.js";
import ollama from "../../utils/ollama-helper.js";

const DuplicateUrlCheckCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("duplicateurlchecker")
    .addStringOption((option) => {
      return option.setName("url").setDescription("url").setRequired(true);
    })
    .addStringOption((option) => {
      return option.setName("server_id").setDescription("serverId");
    })
    .setDescription("Check if url is sent before.") as SlashCommandBuilder,

  execute: async (interaction) => {
    const url = String(interaction.options.get("url")?.value);
    let serverId = String(interaction.options.get("server_id")?.value);

    if (
      (serverId === undefined || serverId === "undefined") &&
      interaction.guildId
    ) {
      serverId = interaction.guildId;
    }

    if (serverId === undefined || serverId === "undefined") {
      await interaction.reply({
        content: "server_id bilgisi gerekli",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const foundRecords = await dbHelper.em.find(
      ChannelMessage,
      {
        $and: [{ guildId: serverId }, { urls: { $some: { url: url } } }],
      },
      { populate: ["urls"], limit: 1, orderBy: { createdAt: "ASC" } }
    );

    if (foundRecords.length > 0) {
      for (let index = 0; index < foundRecords.length; index++) {
        const element = foundRecords[index];
        const channel = discordClient.client.channels.cache.get(
          element.channelId
        );

        if (channel) {
          if (channel.type == ChannelType.GuildText) {
            const oldMessage = await channel.messages.fetch(element.messageId);
            await interaction.reply({
              content: oldMessage.url,
              flags: MessageFlags.Ephemeral,
            });
          }
        }
      }
    } else {
      await interaction.reply({
        content:
          "paylasan olmamis gibi ama bir de ai ile bakayim az bekle 1dk falan beklersin max",
          flags: MessageFlags.Ephemeral,
      });

      const parsedUrl = await urlParserHelper.parse(url);

      const parsedContent = urlParserHelper.toString(parsedUrl);

      if (parsedContent !== null) {
        let vectorStore: PGVectorStore | null = null;

        if (parsedUrl !== null) {
          if ("title" in parsedUrl) {
            vectorStore = vectorStoreHelper.youtube_vectorStore;
          } else if ("tweetBody" in parsedUrl) {
            vectorStore = vectorStoreHelper.x_vectorStore;
          }

          if (vectorStore !== null) {
            const llm = ollama.llm;
            const retriever = vectorStore.asRetriever();
            const systemPrompt =
              "Your job as an assistant is to check if the smilar content has been shared before. " +
              "You should use first message as a new content to compare with the retrieved context. " +
              "You MUST only return just 'YES' or 'NO'. DO NOT explain anything. " +
              "If the content is smilar to retrieved context return 'YES'. " +
              "If the content has not been smilar to retrieved context return 'NO'. " +
              "\n\n" +
              "Use the following pieces of retrieved context to compare smilarity. If retrieved context is empty return 'NO'" +
              "\n\n" +
              "{context}";

            const prompt = ChatPromptTemplate.fromMessages([
              ["system", systemPrompt],
              ["human", "{input}"],
            ]);

            const questionAnswerChain = await createStuffDocumentsChain({
              llm,
              prompt,
            });

            const ragChain = await createRetrievalChain({
              retriever,
              combineDocsChain: questionAnswerChain,
            });

            const response = await ragChain.invoke({
              input: parsedContent,
            });

            if (response.answer.includes("NO")) {
              await interaction.editReply({
                content: response.answer,
              });
            } else {
              await interaction.editReply({
                content: response.answer,
              });
            }
          }
        }
      }
    }
  },
  cooldown: 10,
  category: "utilty",
};

export default DuplicateUrlCheckCommand;
