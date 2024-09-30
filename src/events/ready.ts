import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: (client : Client) => {

        console.log(
            color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`)
        )

        client.user?.setPresence({
            status: "online",
            activities:[ {
                name: "alien invasion",
                type: ActivityType.Custom,
                state: "👽 Kidnapping humans!",
            }]
        });
    }
}

export default event;