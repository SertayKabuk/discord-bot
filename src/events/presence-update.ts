import { ActivityType, Events, Presence } from "discord.js";
import { BotEvent } from "../types.js";

const event: BotEvent = {
    name: Events.PresenceUpdate,
    execute: async (oldPresence: Presence | null, newPresence: Presence) => {
        try {
            const datetime = new Date();

            const status = `Desktop:${newPresence.clientStatus?.desktop} Mobile:${newPresence.clientStatus?.mobile} Web:${newPresence.clientStatus?.web}`;
            const oldActivity = `${oldPresence?.activities[0]?.type !== undefined ? ActivityType[oldPresence?.activities[0]?.type] : ''} ${oldPresence?.activities[0]?.name || ''} ${oldPresence?.activities[0]?.details || ''} ${oldPresence?.activities[0]?.state || ''}`;
            const newActivity = `${newPresence.activities[0]?.type !== undefined ? ActivityType[newPresence?.activities[0]?.type] : ''} ${newPresence?.activities[0]?.name || ''} ${newPresence?.activities[0]?.details || ''} ${newPresence?.activities[0]?.state || ''}`;

            console.log(`${datetime.toISOString()} | ${newPresence.guild?.name} | ${newPresence.member?.user.globalName} | ${oldPresence?.status} ==> ${newPresence.status} | ${oldActivity} ==> ${newActivity} | ${status}`);

        } catch (error) {
            console.error("Error in presenceUpdate:", error);
        }
    },
};

export default event;
