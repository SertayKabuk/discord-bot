const PORT = process.env.API_PORT;
const HOST = process.env.API_HOST;
const PROTOCOL = process.env.API_PROTOCOL;

export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Discord Bot API',
            description: 'API documentation for Discord Bot',
            version: '1.0.0'
        },
        servers: [
            {
                url: `${PROTOCOL}://${HOST}:${PORT}/api/v1`,
                description: 'API Server'
            }
        ],
        tags: [
            {
                name: 'Discord',
                description: 'Discord-related endpoints'
            },
            {
                name: 'System',
                description: 'System endpoints'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Discord user ID'
                        },
                        username: {
                            type: 'string',
                            description: 'Discord username'
                        },
                        displayName: {
                            type: 'string',
                            description: 'User\'s display name in the guild'
                        },
                        status: {
                            type: 'string',
                            description: 'User\'s connection status',
                            enum: ['connected', 'online', 'offline', 'idle', 'dnd']
                        }
                    }
                },
                Channel: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Discord channel ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Channel name'
                        },
                        type: {
                            type: 'string',
                            description: 'Channel type'
                        },
                        users: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/User'
                            }
                        }
                    }
                },
                Guild: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Discord guild ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Guild name'
                        },
                        channels: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Channel'
                            }
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
    apis: ['./build/api/routes/*.js'],
};