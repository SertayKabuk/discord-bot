import { ChannelType, Collection, Message } from "discord.js";
import discordClient from "../utils/discord-client-helper.js";
import { prisma } from "../db/prisma.js";
import { extractUrls } from "../utils/functions.js";

export const importAllMessages = async () => {
  const channel = await discordClient.client.channels.fetch(
    "485913862067978262"
  );

  const excludedUrls = [".gif", "tenor.com"];

  if (channel && channel.type == ChannelType.GuildText) {
    let lastMessageId: string | undefined;

    while (true) {
      const messages: Collection<string, Message> = await channel.messages.fetch({
        limit: 100,
        cache: false,
        before: lastMessageId,
      });

      if (messages.size == 0) break;

      for (const message of messages.values()) {
        let urls = extractUrls(message.content);

        if (urls) {
          const validUrls = urls.filter(url => {
            let excluded = false;
            excludedUrls.forEach((excludedUrl) => {
              if (url.includes(excludedUrl)) {
                excluded = true;
              }
            });
            return !excluded && url.length < 256;
          });

          if (validUrls.length > 0) {
            await prisma.channel_messages.create({
              data: {
                guild_id: message.guildId!,
                channel_id: message.channel.id,
                message_id: message.id,
                created_at: message.createdAt,
                user_id: message.author.id,
                username: message.author.username,
                urls: {
                  create: validUrls.map(url => ({
                    url: url
                  }))
                }
              }
            });
          }
        }
        lastMessageId = message.id;
      }

      console.log("last:" + lastMessageId);
    }

    console.log("done");
  }
};
