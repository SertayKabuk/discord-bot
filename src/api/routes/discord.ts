import { Request, Response, Router } from 'express';
import { validateApiKey } from '../middleware/auth.js';
import discordClient from "../../utils/discord-client-helper.js";
import { ChannelType, GuildMember, PermissionsBitField } from 'discord.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Discord user ID
 *         username:
 *           type: string
 *           description: Discord username
 *         displayName:
 *           type: string
 *           description: User's display name in the guild
 *         status:
 *           type: string
 *           description: User's connection status
 *           enum: [connected, online, offline, idle, dnd]
 *     Channel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Discord channel ID
 *         parentId:
 *           type: string
 *           nullable: true
 *           description: ID of the parent category channel, null if channel is not in a category
 *         name:
 *           type: string
 *           description: Channel name
 *         type:
 *           type: string
 *           description: Channel type
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *     Guild:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Discord guild ID
 *         name:
 *           type: string
 *           description: Guild name
 *         iconURL:
 *           type: string
 *           nullable: true
 *           description: URL to the guild's icon
 *         description:
 *           type: string
 *           nullable: true
 *           description: Guild description
 *         channels:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Channel'
 */

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
                let users: User[] = [];
                
                // Only fetch users for voice and text channels
                if (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildText) {
                    if (channel.type === ChannelType.GuildVoice) {
                        // For voice channels, get members currently in the channel
                        users = Array.from(channel.members?.values() || []).map((member: GuildMember) => ({
                            id: member.user.id,
                            username: member.user.username,
                            displayName: member.displayName,
                            status: 'connected'
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
                                status: member.presence?.status || 'offline'
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

        const response: GuildsResponse = { guilds };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching guilds:', error);
        res.status(500).json({ error: 'Failed to fetch guild information' });
    }
});

export default router;

interface User {
    id: string;
    username: string;
    displayName: string;
    status: string;
}

interface Channel {
    id: string;
    parentId: string | null;
    name: string;
    type: string;
    users: User[];
}

interface Guild {
    id: string;
    name: string;
    iconURL : string | null;
    channels: Channel[];
}

interface GuildsResponse {
    guilds: Guild[];
}