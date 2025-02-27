import { ChannelType, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types.js";

const command: Command = {
  category: "fun",
  name: "greet",
  execute: (message, args) => {
    let toGreet = message.mentions.members?.first();

    if (message.channel.type == ChannelType.GuildText) {
      message.channel.send(
        `Hello there ${
          toGreet ? toGreet.user.username : message.member?.user.username
        }!`
      );
    }
  },
  cooldown: 10,
  aliases: ["sayhello"],
  permissions: ["SendMessages", PermissionFlagsBits.SendMessages], // to test
};

export default command;
