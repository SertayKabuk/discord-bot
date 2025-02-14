export interface VoiceStateHistoryDto {
    id: string;
    user_id: string;
    from_guild_id: string;
    from_guild_name: string;
    to_guild_id: string;
    to_guild_name: string;
    from_channel_id: string;
    from_channel_name: string;
    to_channel_id: string;
    to_channel_name: string;
    username: string | null;
    event_type: string | null;
    created_at: Date;
}