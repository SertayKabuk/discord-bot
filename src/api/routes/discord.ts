import { Request, Response, Router } from 'express';
import { validateApiKey } from '../middleware/auth.js';
import discordClient from "../../utils/discord-client-helper.js";
import { ActivityType, ChannelType, GuildMember, PermissionsBitField } from 'discord.js';
import { prisma } from '../../db/prisma.js';
import { PresenceHistoryDto } from '../dto/presence-history.dto.js';
import { GuildsResponseDto, UserDto } from '../dto/guilds.dto.js';
import { VoiceStateHistoryDto } from '../dto/voice-state-history.dto.js';

const router: Router = Router();

router.get('/guilds', validateApiKey, async (_req: Request, res: Response) => {
    try {
        const guilds = await Promise.all(discordClient.client.guilds.cache.map(async guild => {
            const channels = await Promise.all(guild.channels.cache.map(async channel => {
                let users: UserDto[] = [];

                // Only fetch users for voice and text channels
                if (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildText) {
                    if (channel.type === ChannelType.GuildVoice) {
                        // For voice channels, get members currently in the channel
                        users = Array.from(channel.members?.values() || []).map((member: GuildMember) => ({
                            id: member.user.id,
                            username: member.user.username,
                            displayName: member.displayName,
                            status: 'connected',
                            activity: `${member.presence?.activities[0]?.type !== undefined ? ActivityType[member.presence?.activities[0]?.type] : ''} ${member.presence?.activities[0]?.name || ''} ${member.presence?.activities[0]?.details || ''} ${member.presence?.activities[0]?.state || ''}`,
                        }));
                    } else if (channel.type === ChannelType.GuildText) {
                        // For text channels, get members who can view the channel
                        const members = Array.from(channel.members?.values() || []);
                        users = members
                            .filter(member => channel.permissionsFor(member)?.has(PermissionsBitField.Flags.ViewChannel))
                            .map(member => ({
                                id: member.user.id,
                                username: member.user.username,
                                displayName: member.displayName,
                                status: member.presence?.status || 'offline',
                                activity: `${member.presence?.activities[0]?.type !== undefined ? ActivityType[member.presence?.activities[0]?.type] : ''} ${member.presence?.activities[0]?.name || ''} ${member.presence?.activities[0]?.details || ''} ${member.presence?.activities[0]?.state || ''}`,
                            }));
                    }
                }

                return {
                    id: channel.id,
                    parentId: channel.parentId,
                    name: channel.name,
                    type: ChannelType[channel.type],
                    users
                };
            }));

            return {
                id: guild.id,
                iconURL: guild.iconURL(),
                description: guild.description,
                name: guild.name,
                channels
            };
        }));

        const response: GuildsResponseDto = { guilds };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching guilds:', error);
        res.status(500).json({ error: 'Failed to fetch guild information' });
    }
});

router.get('/presence-history/filter/guildId/:guildId/startDate/:startDate/endDate/:endDate', validateApiKey, async (req: Request, res: Response) => {
    const { guildId, startDate, endDate } = req.params;

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        res.status(400).json({
            error: 'Invalid date format. Expected format: YYYY-MM-DDThh:mm:ss.sssZ (e.g. 2025-02-13T18:01:27.495Z)'
        });
        return;
    }

    try {
        const where = {
            guild_id: guildId,
            created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        };

        const data = await prisma.presence_logs.findMany({ where });

        // Map database records to PresenceHistoryDto
        const response: PresenceHistoryDto[] = data.map(record => ({
            id: record.id.toString(),
            guild_id: record.guild_id.toString(),
            user_id: record.user_id.toString(),
            username: record.username,
            old_status: record.old_status,
            new_status: record.new_status,
            old_activity: record.old_activity,
            new_activity: record.new_activity,
            client_status: record.client_status,
            created_at: record.created_at
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching presence history:', error);
        res.status(500).json({ error: 'Failed to fetch presence history' });
    }
});

router.get('/voice-state-history/userId/:userId/startDate/:startDate/endDate/:endDate', validateApiKey, async (req: Request, res: Response) => {
    const { userId, startDate, endDate } = req.params;

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        res.status(400).json({
            error: 'Invalid date format. Expected format: YYYY-MM-DDThh:mm:ss.sssZ (e.g. 2025-02-13T18:01:27.495Z)'
        });
        return;
    }

    try {
        const data = await prisma.voice_state_logs.findMany({
            where: {
                user_id: userId,
                created_at: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        // Map database records to VoiceStateHistoryDto
        const response: VoiceStateHistoryDto[] = data.map(record => ({
            id: record.id.toString(),
            user_id: record.user_id,
            from_guild_id: record.from_guild_id,
            from_guild_name: record.from_guild_name,
            to_guild_id: record.to_guild_id,
            to_guild_name: record.to_guild_name,
            from_channel_id: record.from_channel_id,
            from_channel_name: record.from_channel_name,
            to_channel_id: record.to_channel_id,
            to_channel_name: record.to_channel_name,
            username: record.username,
            event_type: record.event_type,
            created_at: record.created_at
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching voice state history:', error);
        res.status(500).json({ error: 'Failed to fetch voice state history' });
    }
});

export default router;