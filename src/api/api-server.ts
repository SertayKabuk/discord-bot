import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import healthRoutes from './routes/health.js';
import discordRoutes from './routes/discord.js';
import swaggerjsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swaggerOptions.js';

export class APIServer {
    port: number;

    constructor(port: number = 80) {
        this.port = port;
    }

    CreateServer(): void {
        const app: Express = express();
        const router = express.Router();

        const swaggerDocs = swaggerjsdoc(swaggerOptions);
        
        // Configure Swagger UI with proper base path npm run handling
        const swaggerUiOptions = {
            explorer: true,
            swaggerOptions: {
                url: 'api/v1/api-docs/swagger.json',
                baseUrl: '/api/v1'
            }
        };

        // Serve Swagger JSON at a specific endpoint
        router.get('/api-docs/swagger.json', (_req, res) => {
            res.json(swaggerDocs);
        });

        // Mount Swagger UI under the API router
        app.use('/api-docs', swaggerUi.serve);
        app.get('/api-docs', swaggerUi.setup(swaggerDocs, swaggerUiOptions));

        // CORS middleware
        router.use((_req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Headers', 'X-API-Key');
            next();
        });

        // Mount routes
        router.use('/health', healthRoutes);
        router.use('/discord', discordRoutes);

        // Apply base path
        app.use('/api/v1', router);

        app.listen(this.port, () => {
            console.log(`[server]: Server is running at http://localhost:${this.port}`);
            console.log(`[server]: API documentation available at /api-docs`);
        });
    }
}
