import { Request, Response, Router } from 'express';
import { validateApiKey } from '../middleware/auth.js';
import discordClient from "../../utils/discord-client-helper.js";
import { ActivityType, ChannelType, GuildMember, PermissionsBitField } from 'discord.js';
import dbHelper from '../../db/db-helper.js';
import { PresenceHistoryDto } from '../dto/presence-history.dto.js';
import { GuildsResponseDto, UserDto } from '../dto/guilds.dto.js';

const router = Router();

/**
 * @swagger
 * /discord/guilds:
 *   get:
 *     tags:
 *       - Discord
 *     summary: Get all Discord guilds, their channels and users
 *     description: Retrieves a list of all Discord guilds, their channels and current users in each channel
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guilds:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Guild'
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch guild information"
 */
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

/**
 * @swagger
 * /discord/presence-history/filter/startDate/{startDate}/endDate/{endDate}:
 *   get:
 *     tags:
 *       - Discord
 *     summary: Get presence history between two dates
 *     description: Retrieves presence logs between the specified start and end dates
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         description: Start date in ISO format (e.g. 2025-02-13T18:01:27.495Z)
 *         schema:
 *           type: string
 *       - in: path
 *         name: endDate
 *         required: true
 *         description: End date in ISO format (e.g. 2025-02-13T18:01:27.495Z)
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PresenceHistoryDto'
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
router.get('/presence-history/filter/startDate/:startDate/endDate/:endDate', validateApiKey, async (req: Request, res: Response) => {
    const { startDate, endDate } = req.params;
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        res.status(400).json({ 
            error: 'Invalid date format. Expected format: YYYY-MM-DDThh:mm:ss.sssZ (e.g. 2025-02-13T18:01:27.495Z)' 
        });
        return;
    }

    try {
        const data = await dbHelper.prisma.presence_logs.findMany({
            where: {
                created_at: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }
        });
        
        // Convert BigInt values to strings before sending response
        const serializedData = data.map(record => ({
            ...record,
            // Convert any BigInt fields to strings
            id: record.id.toString(),
            user_id: record.user_id.toString(),
            guild_id: record.guild_id.toString()
        }));
        
        res.status(200).json(serializedData);
    } catch (error) {
        console.error('Error fetching presence history:', error);
        res.status(500).json({ error: 'Failed to fetch presence history' });
    }
});

export default router;