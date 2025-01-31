import { ChannelType, PermissionFlagsBits, userMention } from "discord.js";
import { Command } from "../../types.js";

const command: Command = {
  category: "fun",
  name: "timer",
  execute: (message, args) => {
    if (message.channel.type == ChannelType.GuildText) {
      const minutes = parseInt(args[0]);

      if (!minutes) {
        return message.channel.send("Please provide a valid number for minutes.");
      } else if (minutes < 1) {
        return message.channel.send("Timer duration must be at least 1 minute.");
      }

      message.channel.send(
        `${userMention(
          message.member!.user.id
        )} Timer set for ${minutes} minutes.`
      );

      setTimeout(() => {
        if (message.channel.type == ChannelType.GuildText) {
          message.channel.send(
            `${userMention(message.member!.user.id)} ${minutes} dakika bitti.`
          );
        }
      }, minutes * 60 * 1000); // Convert minutes to milliseconds
    }
  },
  cooldown: 10,
  aliases: ["settimer"],
  permissions: ["SendMessages", PermissionFlagsBits.SendMessages],
};

export default command;
