/**
 * @swagger
 * components:
 *   schemas:
 *     UserDto:
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
 *         activity:
 *           type: string
 *           description: User's current activity
 *           nullable: true
 *           example: "🎮 PLAYING Valorant"
 *     ChannelDto:
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
 *             $ref: '#/components/schemas/UserDto'
 *     GuildDto:
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
 *             $ref: '#/components/schemas/ChannelDto'
 */
export interface UserDto {
    id: string;
    username: string;
    displayName: string;
    status: string;
    activity: string;
}

export interface ChannelDto {
    id: string;
    parentId: string | null;
    name: string;
    type: string;
    users: UserDto[];
}

export interface GuildDto {
    id: string;
    name: string;
    iconURL: string | null;
    channels: ChannelDto[];
}

export interface GuildsResponseDto {
    guilds: GuildDto[];
}