import { ChannelType, Message, userMention } from "discord.js";
import { ChannelMessage } from "../db/entities/ChannelMessage.entity";
import { ChannelMessageUrl } from "../db/entities/ChannelMessageUrl.entity";
import { extractUrls } from "../functions";
import { DI } from "../DI";

export const checkDuplicateUrl = async (message: Message) => {

    if (message.guildId !== null) {
        let urls = extractUrls(message.content);

        const excludedUrls = ['.gif', 'tenor.com'];

        if (urls) {
            const foundRecords = await DI.em.find(ChannelMessage, {
                $and: [{ guildId: message.guildId },
                { urls: { $some: { url: urls } } }]
            },
                { populate: ['urls'] }
            );

            if (foundRecords.length > 0) {
                for (let index = 0; index < foundRecords.length; index++) {

                    let excluded = false;

                    const element = foundRecords[index];

                    element.urls.getItems().forEach(urlItem => {

                        excludedUrls.forEach(excludedUrl => {
                            if (urlItem.url.includes(excludedUrl)) {
                                excluded = true;
                            }
                        });
                    });

                    if (excluded) continue;

                    message.reply("Bu linki daha once " + userMention(element.userId) + " gondermis.");

                    const channel = DI.client.channels.cache.get(element.channelId);

                    if (channel) {
                        if (channel.type == ChannelType.GuildText) {
                            const oldMessage = await channel.messages.fetch(element.messageId);
                            oldMessage.reply("Aha bu " + userMention(message.author.id));
                        }
                    }
                }
            }
            else {
                const dbMessage = new ChannelMessage();
                dbMessage.guildId = message.guildId;
                dbMessage.channelId = message.channel.id;
                dbMessage.messageId = message.id;
                dbMessage.createdAt = message.createdAt;
                dbMessage.userId = message.author.id;
                dbMessage.username = message.author.username;

                urls.forEach(url => {
                    const urlMessage = new ChannelMessageUrl();
                    urlMessage.url = url;

                    if (url.length < 256) {
                        dbMessage.urls.add(urlMessage);
                    }
                });

                if (dbMessage.urls.length > 0) {
                    await DI.em.persist(dbMessage).flush();
                }
            }
        }
    }
}