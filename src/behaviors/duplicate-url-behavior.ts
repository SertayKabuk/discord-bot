import { ChannelType, Message, userMention } from "discord.js";
import { ChannelMessage } from "../db/entities/ChannelMessage.entity.js";
import { ChannelMessageUrl } from "../db/entities/ChannelMessageUrl.entity.js";
import { extractUrls } from "../utils/functions.js";
import dbHelper from "../db/db-helper.js";
import discordClient from "../utils/discord-client-helper.js";

export const checkDuplicateUrl = async (message: Message) => {
  if (message.guildId !== null) {
    let urls = extractUrls(message.content);

    const excludedUrls = [".gif", "tenor.com"];

    if (urls) {
      const foundRecords = await dbHelper.em.find(
        ChannelMessage,
        {
          $and: [
            { guildId: message.guildId },
            { urls: { $some: { url: urls } } },
          ],
        },
        { populate: ["urls"], limit: 1, orderBy: { createdAt: "ASC" } }
      );

      if (foundRecords.length > 0) {
        for (let index = 0; index < foundRecords.length; index++) {
          let excluded = false;

          const element = foundRecords[index];

          element.urls.getItems().forEach((urlItem) => {
            excludedUrls.forEach((excludedUrl) => {
              if (urlItem.url.includes(excludedUrl)) {
                excluded = true;
              }
            });
          });

          if (excluded) continue;

          message.reply(
            "Bu linki daha once " + userMention(element.userId) + " gondermis."
          );

          const channel = discordClient.client.channels.cache.get(
            element.channelId
          );

          if (channel) {
            if (channel.type == ChannelType.GuildText) {
              const oldMessage = await channel.messages.fetch(
                element.messageId
              );
              oldMessage.reply("Aha bu " + userMention(message.author.id));
            }
          }
        }
      } else {
       
        const dbMessage = new ChannelMessage();
        dbMessage.guildId = message.guildId;
        dbMessage.channelId = message.channel.id;
        dbMessage.messageId = message.id;
        dbMessage.createdAt = message.createdAt;
        dbMessage.userId = message.author.id;
        dbMessage.username = message.author.username;

        urls.forEach((url) => {
          const urlMessage = new ChannelMessageUrl();
          urlMessage.url = url;

          if (url.length < 256) {
            dbMessage.urls.add(urlMessage);
          }
        });

        if (dbMessage.urls.length > 0) {
          await dbHelper.em.persist(dbMessage).flush();
        }

        // try {
        //   for (let index = 0; index < urls.length; index++) {
        //     const parsedUrl = await urlParserHelper.parse(urls[index]);

        //     const parsedContentString = urlParserHelper.toString(parsedUrl);

        //     if (parsedContentString === null) {
        //       continue;
        //     }

        //     let vectorStore: PGVectorStore | null = null;

        //     if (parsedUrl !== null) {
        //       if ("title" in parsedUrl) {
        //         vectorStore = vectorStoreHelper.youtube_vectorStore;
        //       } else if ("tweetBody" in parsedUrl) {
        //         vectorStore = vectorStoreHelper.x_vectorStore;
        //       }

        //       const uuid = uuidv4();

        //       await vectorStoreHelper.addDocument(
        //         uuid,
        //         message.id,
        //         parsedContentString,
        //         urls[index]
        //       );
        //     }
        //   }
        // } catch (error) {
        //   console.error("Error: ", error);
        // }
      }
    }
  }
};
