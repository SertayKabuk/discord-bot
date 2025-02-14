import { ActivityType, Events, Presence } from "discord.js";
import { BotEvent } from "../types.js";
import dbHelper from "../db/db-helper.js";

const event: BotEvent = {
    name: Events.PresenceUpdate,
    execute: async (oldPresence: Presence | null, newPresence: Presence) => {
        try {
            const status = `Desktop:${newPresence.clientStatus?.desktop} Mobile:${newPresence.clientStatus?.mobile} Web:${newPresence.clientStatus?.web}`;
            const oldActivity = `${oldPresence?.activities[0]?.type !== undefined ? ActivityType[oldPresence?.activities[0]?.type] : ''} ${oldPresence?.activities[0]?.name || ''} ${oldPresence?.activities[0]?.details || ''} ${oldPresence?.activities[0]?.state || ''}`;
            const newActivity = `${newPresence.activities[0]?.type !== undefined ? ActivityType[newPresence?.activities[0]?.type] : ''} ${newPresence?.activities[0]?.name || ''} ${newPresence?.activities[0]?.details || ''} ${newPresence?.activities[0]?.state || ''}`;

            // Create and save presence log using Prisma
            await dbHelper.prisma.presence_logs.create({
                data: {
                    guild_id: newPresence.guild?.id || '',
                    user_id: newPresence.userId,
                    username: newPresence.member?.user.globalName || newPresence.user?.username || '',
                    old_status: oldPresence?.status || null,
                    new_status: newPresence.status,
                    old_activity: oldActivity || null,
                    new_activity: newActivity || null,
                    client_status: status
                }
            });

        } catch (error) {
            console.error("Error in presenceUpdate:", error);
        }
    },
};

export default event;
