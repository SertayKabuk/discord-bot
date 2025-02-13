
/**
 * @swagger
 * components:
 *   schemas:
 *     PresenceHistoryDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: int64
 *           description: Unique identifier for the presence log
 *         guild_id:
 *           type: string
 *           description: Discord guild ID
 *         user_id:
 *           type: string
 *           description: Discord user ID
 *         username:
 *           type: string
 *           nullable: true
 *           description: Discord username
 *         old_status:
 *           type: string
 *           nullable: true
 *           description: Previous user status
 *         new_status:
 *           type: string
 *           nullable: true
 *           description: New user status
 *         old_activity:
 *           type: string
 *           nullable: true
 *           description: Previous user activity
 *         new_activity:
 *           type: string
 *           nullable: true
 *           description: New user activity
 *         client_status:
 *           type: string
 *           nullable: true
 *           description: Client status information
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the presence change was logged
 */

export interface PresenceHistoryDto {
    id: bigint;
    guild_id: string;
    user_id: string;
    username: string | null;
    old_status: string | null;
    new_status: string | null;
    old_activity: string | null;
    new_activity: string | null;
    client_status: string | null;
    created_at: Date;
}