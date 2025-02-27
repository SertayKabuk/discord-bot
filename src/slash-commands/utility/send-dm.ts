import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.js";
import discordClient from "../../utils/discord-client-helper.js";

const SendDmCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("senddm")
        .addStringOption(option => {
            return option
                .setName("userid")
                .setDescription("userId")
        })
        .addStringOption(option => {
            return option
                .setName("dmmessage")
                .setDescription("Message")
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription("Send DM to specific user.") as SlashCommandBuilder,

    execute: async (interaction) => {
        let userId = String(interaction.options.get("userid")?.value);
        let message = String(interaction.options.get("dmmessage")?.value);

        await discordClient.client.users.send(userId, message);
        //send to me
        await discordClient.client.users.send(process.env.ADMIN_USER_ID, "fromUser:" + interaction.user.displayName + " toUserId:" + userId + " " + message);

        await interaction.reply({ content: "Sent.", flags: MessageFlags.Ephemeral });
    },
    cooldown: 10,
    category: "utilty"
}

export default SendDmCommand;