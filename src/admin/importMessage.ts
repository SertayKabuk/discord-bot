
// import { extractUrls } from "./functions";
// import { ChannelMessage } from "./db/entities/ChannelMessage.entity";
// import { ChannelMessageUrl } from "./db/entities/ChannelMessageUrl.entity";



// const channel = await client.channels.fetch("485913862067978262");

// if (channel && channel.type == ChannelType.GuildText) {
//     let lastMessageId = "1232024580646768792";

//     while (true) {
//         let messages = await channel.messages.fetch({ limit: 100, cache: false, before: lastMessageId });

//         if (messages.size == 0)
//             break;

//         messages.forEach(async message => {
//             let lastId = message.id;

//             let urls = extractUrls(message.content);

//             if (urls) {
//                 const dbMessage = new ChannelMessage();
//                 dbMessage.channelId = message.channel.id;
//                 dbMessage.messageId = message.id;
//                 dbMessage.createdAt = message.createdAt;
//                 dbMessage.userId = message.author.id;
//                 dbMessage.username = message.author.username;

//                 for (let index = 0; index < urls.length; index++) {
//                     const element = urls[index];
//                     const urlMessage = new ChannelMessageUrl();
//                     urlMessage.url = element;

//                     if (element.length < 256) {
//                         dbMessage.urls.add(urlMessage);
//                     }
//                 }

//                 if (dbMessage.urls.length > 0) {
//                     orm.em.persist(dbMessage);
//                 }
//             }
//             lastMessageId = lastId;
//         });

//         await orm.em.flush();
//     }
// // }

// import { ChannelMessage } from "../db/entities/ChannelMessage.entity";
// import { ChannelType } from "discord.js";
// import { DI } from "../DI";

// export const importAllMessages = async () => {

//     const channel = await DI.discordClient.channels.fetch("485913862067978262");

//     if (channel && channel.type == ChannelType.GuildText) {
//         let lastMessageId;

//         while (true) {
//             let messages = await channel.messages.fetch({ limit: 100, cache: false, before: lastMessageId });

//             if (messages.size == 0)
//                 break;

//             messages.forEach(async message => {
//                 let lastId = message.id;

//                 const dbMessage = new ChannelMessage();
//                 dbMessage.channelId = message.channel.id;
//                 dbMessage.messageId = message.id;
//                 dbMessage.createdAt = message.createdAt;
//                 dbMessage.userId = message.author.id;
//                 dbMessage.username = message.author.username;
//                 dbMessage.guildId = message.guildId;
//                 dbMessage.message = message.content;

//                 DI.em.persist(dbMessage);
//                 lastMessageId = lastId;
//             });

//             console.log("last:" + lastMessageId);

//             await DI.em.flush();
//         }
//     }
// }