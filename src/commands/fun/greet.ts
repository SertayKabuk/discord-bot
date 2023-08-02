import { PermissionFlagsBits } from "discord.js";
import { Command } from "../../types";

const command : Command = {
    category: "fun",
    name: "greet",
    execute: (message, args) => {
        let toGreet = message.mentions.members?.first()
        message.channel.send(`Hello there ${toGreet ? toGreet.user.username : message.member?.user.username}!`)
    },
    cooldown: 10,
    aliases: ["sayhello"],
    permissions: ["Administrator", PermissionFlagsBits.ManageGuildExpressions] // to test
}

export default command