import { ChannelType, Message, userMention } from "discord.js";
import { extractUrls } from "../utils/functions.js";
import dbHelper from "../db/db-helper.js";
import discordClient from "../utils/discord-client-helper.js";

export const checkDuplicateUrl = async (message: Message) => {
  if (message.guildId !== null) {
    let urls = extractUrls(message.content);
    const excludedUrls = [".gif", "tenor.com"];

    if (urls) {
      // Find messages with matching URLs using Prisma
      const foundRecords = await dbHelper.prisma.channel_messages.findMany({
        where: {
          AND: [
            { guild_id: message.guildId },
            { urls: { some: { url: { in: urls } } } }
          ]
        },
        select: {
          user_id: true,
          channel_id: true,
          message_id: true,
          urls: {
            select: {
              url: true
            }
          }
        },
        take: 1,
        orderBy: { created_at: 'asc' }
      });

      if (foundRecords.length > 0) {
        for (let index = 0; index < foundRecords.length; index++) {
          let excluded = false;
          const element = foundRecords[index];

          if(element.user_id === message.author.id) continue;

          element.urls.forEach((urlItem: { url: string }) => {
            excludedUrls.forEach((excludedUrl) => {
              if (urlItem.url.includes(excludedUrl)) {
                excluded = true;
              }
            });
          });

          if (excluded) continue;

          message.reply(
            "Bu linki daha once " + userMention(element.user_id) + " gondermis."
          );

          const channel = discordClient.client.channels.cache.get(
            element.channel_id
          );

          if (channel) {
            if (channel.type == ChannelType.GuildText) {
              const oldMessage = await channel.messages.fetch(element.message_id);
              oldMessage.reply("Aha bu " + userMention(message.author.id));
            }
          }
        }
      } else {
        // Create new message and URLs using Prisma
        const validUrls = urls.filter(url => url.length < 256);
        if (validUrls.length > 0) {
          await dbHelper.prisma.channel_messages.create({
            data: {
              guild_id: message.guildId,
              channel_id: message.channel.id,
              message_id: message.id,
              created_at: message.createdAt,
              user_id: message.author.id,
              username: message.author.username,
              urls: {
                create: validUrls.map(url => ({
                  url: url,
                }))
              }
            }
          });
        }
      }
    }
  }
};
