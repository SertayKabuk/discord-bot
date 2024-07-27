import { ChannelType, Message } from "discord.js";

export const logDmMessage = async (message: Message) => {
    if (message.channel.type == ChannelType.DM) {
        await message.client.users.send(process.env.ADMIN_USER_ID, "fromUser:" + message.author.username + " " + message.content);
    }
}