const SWAGGER_PORT = process.env.SWAGGER_PORT;
const SWAGGER_HOST = process.env.API_HOST;
const SWAGGER_PROTOCOL = process.env.API_PROTOCOL;

export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Discord Bot API',
            description: 'API documentation for Discord Bot. Provides endpoints for managing guild information, user presence, and channel statuses.',
            version: '1.0.0'
        },
        servers: [
            {
                url: `${SWAGGER_PROTOCOL}://${SWAGGER_HOST}:${SWAGGER_PORT}/api/v1`,
                description: 'API Server'
            }
        ],
        tags: [
            {
                name: 'Discord',
                description: 'Discord-related endpoints for managing guilds, channels, users, and presence data'
            }
        ],
        paths: {
            '/discord/guilds': {
                get: {
                    tags: ['Discord'],
                    summary: 'Get all Discord guilds, their channels and users',
                    description: 'Retrieves a list of all Discord guilds, their channels and current users in each channel',
                    security: [{ ApiKeyAuth: [] }],
                    responses: {
                        '200': {
                            description: 'Successful operation',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/GuildsResponseDto'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/discord/presence-history/filter/startDate/{startDate}/endDate/{endDate}': {
                get: {
                    tags: ['Discord'],
                    summary: 'Get presence history between two dates',
                    description: 'Retrieves presence logs between the specified start and end dates',
                    parameters: [
                        {
                            name: 'startDate',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string',
                                format: 'date-time'
                            },
                            description: 'Start date in ISO format'
                        },
                        {
                            name: 'endDate',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string',
                                format: 'date-time'
                            },
                            description: 'End date in ISO format'
                        }
                    ],
                    security: [{ ApiKeyAuth: [] }],
                    responses: {
                        '200': {
                            description: 'Successful operation',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/PresenceHistoryDto'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            schemas: {
                UserDto: {
                    type: 'object',
                    required: ['id', 'username', 'displayName', 'status'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Discord user ID (Snowflake)',
                            example: '123456789012345678'
                        },
                        username: {
                            type: 'string',
                            description: 'Discord username',
                            example: 'username#1234'
                        },
                        displayName: {
                            type: 'string',
                            description: 'User\'s display name (nickname) in the guild',
                            example: 'Cool Nickname'
                        },
                        status: {
                            type: 'string',
                            description: 'User\'s connection status in Discord',
                            enum: ['connected', 'online', 'offline', 'idle', 'dnd'],
                            example: 'online'
                        },
                        activity: {
                            type: 'string',
                            description: 'User\'s current Discord activity (game, streaming, etc.)',
                            nullable: true,
                            example: 'Playing Minecraft'
                        }
                    }
                },
                ChannelDto: {
                    type: 'object',
                    required: ['id', 'name', 'type'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Discord channel ID (Snowflake)',
                            example: '123456789012345678'
                        },
                        parentId: {
                            type: 'string',
                            description: 'Parent category channel ID (Snowflake)',
                            nullable: true,
                            example: '987654321098765432'
                        },
                        name: {
                            type: 'string',
                            description: 'Channel name as shown in Discord',
                            example: 'general'
                        },
                        type: {
                            type: 'string',
                            description: 'Discord channel type (GuildText, GuildVoice, etc.)',
                            enum: ['GuildText', 'GuildVoice', 'GuildCategory', 'GuildNews', 'GuildStore'],
                            example: 'GuildText'
                        },
                        users: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/UserDto'
                            },
                            description: 'List of users currently in the channel'
                        }
                    }
                },
                GuildDto: {
                    type: 'object',
                    required: ['id', 'name'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Discord guild ID (Snowflake)',
                            example: '123456789012345678'
                        },
                        name: {
                            type: 'string',
                            description: 'Guild name as shown in Discord',
                            example: 'My Discord Server'
                        },
                        iconURL: {
                            type: 'string',
                            description: 'URL of the guild\'s icon image',
                            nullable: true,
                            example: 'https://cdn.discordapp.com/icons/...'
                        },
                        description: {
                            type: 'string',
                            description: 'Guild description if set',
                            nullable: true,
                            example: 'A friendly community server'
                        },
                        channels: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/ChannelDto'
                            },
                            description: 'List of channels in the guild'
                        }
                    }
                },
                GuildsResponseDto: {
                    type: 'object',
                    required: ['guilds'],
                    properties: {
                        guilds: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/GuildDto'
                            },
                            description: 'List of Discord guilds with their channels and users'
                        }
                    }
                },
                PresenceHistoryDto: {
                    type: 'object',
                    required: ['id', 'guild_id', 'user_id', 'created_at'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'int64',
                            description: 'Unique identifier for the presence log entry',
                            example: '123'
                        },
                        guild_id: {
                            type: 'string',
                            description: 'Discord guild ID where the presence change occurred',
                            example: '123456789012345678'
                        },
                        user_id: {
                            type: 'string',
                            description: 'Discord user ID whose presence changed',
                            example: '123456789012345678'
                        },
                        username: {
                            type: 'string',
                            nullable: true,
                            description: 'Discord username at the time of presence change',
                            example: 'username#1234'
                        },
                        old_status: {
                            type: 'string',
                            nullable: true,
                            description: 'Previous Discord status (online, offline, idle, dnd)',
                            example: 'online'
                        },
                        new_status: {
                            type: 'string',
                            nullable: true,
                            description: 'New Discord status (online, offline, idle, dnd)',
                            example: 'idle'
                        },
                        old_activity: {
                            type: 'string',
                            nullable: true,
                            description: 'Previous Discord activity',
                            example: 'Playing Minecraft'
                        },
                        new_activity: {
                            type: 'string',
                            nullable: true,
                            description: 'New Discord activity',
                            example: 'Playing Valorant'
                        },
                        client_status: {
                            type: 'string',
                            nullable: true,
                            description: 'Discord client platform status (web, desktop, mobile)',
                            example: 'desktop'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'ISO timestamp of when the presence change was logged',
                            example: '2025-02-13T18:01:27.495Z'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    required: ['error'],
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message describing what went wrong',
                            example: 'Invalid date format'
                        }
                    }
                }
            },
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key',
                    description: 'API key for authentication'
                }
            }
        },
        security: [{
            ApiKeyAuth: []
        }]
    },
    apis: ['./build/api/routes/*.js']
};