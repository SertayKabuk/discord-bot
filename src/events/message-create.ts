import { Events, Message } from "discord.js";
import { BotEvent } from "../types.js";
import { checkDuplicateUrl } from "../behaviors/duplicate-url-behavior.js";
import { logDmMessage } from "../behaviors/dm-message-behavior.js";
import discordClient from "../utils/discord-client-helper.js";


const event: BotEvent = {
    name: Events.MessageCreate,
    execute: async (message: Message) => {
        // Ignore all bots
        if (message.author.bot) {
            console.log(message.content);
            return;
        }

        const prefix = "!";

        if (message.content.indexOf(prefix) === 0) {
            const args = message.content.slice(prefix.length).trim().split(/ +/g);

            if (!args) return;

            const command = args?.shift()?.toLowerCase();

            if (command) {
                const cmd = discordClient.client.commands.get(command);

                if (!cmd) return;

                cmd.execute(message, args);
            }
        }
        else {
            checkDuplicateUrl(message);
            logDmMessage(message);
        }
    }
}

export default event;