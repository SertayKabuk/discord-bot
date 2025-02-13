export interface PresenceHistoryDto {
    id: string;
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