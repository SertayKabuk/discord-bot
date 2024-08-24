import { Message } from "discord.js";
import { BotEvent } from "../types";
import { checkDuplicateUrl } from "../behaviors/duplicateUrlBehavior";
import { logDmMessage } from "../behaviors/dmMessageBehavior";
import discordClient from "../discord_client_helper";


const event: BotEvent = {
    name: "messageCreate",
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