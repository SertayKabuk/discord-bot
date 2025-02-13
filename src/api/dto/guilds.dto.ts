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