import { ChannelType, PermissionFlagsBits, userMention } from "discord.js";
import { Command } from "../../types";

const command: Command = {
  category: "fun",
  name: "timer",
  execute: (message, args) => {
    if (message.channel.type == ChannelType.GuildText) {
      const minutes = parseInt(args[0]);

      if (!minutes && minutes > 0) {
        return message.channel.send("Please provide a time in minutes.");
      }

      message.channel.send(
        `${userMention(
          message.member!.user.id
        )} Timer set for ${minutes} minutes.`
      );

      setTimeout(() => {
        if (message.channel.type == ChannelType.GuildText) {
          message.channel.send(`${userMention(
            message.member!.user.id
          )} ${minutes} dakika bitti.`);
        }
      }, minutes * 60 * 1000); // Convert minutes to milliseconds
    }
  },
  cooldown: 10,
  aliases: ["settimer"],
  permissions: ["SendMessages", PermissionFlagsBits.SendMessages],
};

export default command;
