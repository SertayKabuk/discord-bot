import { ChannelMessage } from "../db/entities/ChannelMessage.entity.js";
import { ChannelMessageUrl } from "../db/entities/ChannelMessageUrl.entity.js";
import { ChannelType } from "discord.js";
import discordClient from "../discord-client-helper.js";
import dbHelper from "../db/db-helper.js";
import { extractUrls } from "../functions.js";

export const importAllMessages = async () => {
  const channel = await discordClient.client.channels.fetch(
    "485913862067978262"
  );

  const excludedUrls = [".gif", "tenor.com"];

  if (channel && channel.type == ChannelType.GuildText) {
    let lastMessageId;

    while (true) {
      let messages = await channel.messages.fetch({
        limit: 100,
        cache: false,
        before: lastMessageId,
      });

      if (messages.size == 0) break;

      messages.forEach(async (message) => {
        let lastId = message.id;

        let urls = extractUrls(message.content);

        if (urls) {
          const dbMessage = new ChannelMessage();
          dbMessage.guildId = message.guildId;
          dbMessage.channelId = message.channel.id;
          dbMessage.messageId = message.id;
          dbMessage.createdAt = message.createdAt;
          dbMessage.userId = message.author.id;
          dbMessage.username = message.author.username;

          urls.forEach((url) => {
            let excluded = false;

            excludedUrls.forEach((excludedUrl) => {
              if (url.includes(excludedUrl)) {
                excluded = true;
              }
            });

            if (excluded) return;

            const urlMessage = new ChannelMessageUrl();
            urlMessage.url = url;

            if (url.length < 256) {
              dbMessage.urls.add(urlMessage);
            }
          });

          if (dbMessage.urls.length > 0) {
            await dbHelper.em.persist(dbMessage).flush();
          }
        }
        lastMessageId = lastId;
      });

      console.log("last:" + lastMessageId);

      await dbHelper.em.flush();
    }
  }
};
