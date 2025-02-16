import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import healthRoutes from './routes/health.js';
import discordRoutes from './routes/discord.js';
import pubgRoutes from './routes/pubg.js';
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

        const swaggerDocs = swaggerjsdoc({
            ...swaggerOptions,
            apis: ['./build/api/routes/*.js'] // Only need compiled JS files since we don't use annotations
        });
        
        // Configure Swagger UI
        const swaggerUiOptions = {
            explorer: true,
            swaggerOptions: {
                url: '/api/v1/api-docs/swagger.json',
                persistAuthorization: true
            }
        };

        // Serve Swagger JSON
        router.get('/api-docs/swagger.json', (_req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerDocs);
        });

        // Mount Swagger UI
        router.use('/api-docs', swaggerUi.serve);
        router.get('/api-docs', swaggerUi.setup(swaggerDocs, swaggerUiOptions));

        // CORS middleware
        router.use((_req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Headers', 'X-API-Key, Content-Type');
            next();
        });

        // Mount routes
        router.use('/health', healthRoutes);
        router.use('/discord', discordRoutes);
        router.use('/pubg', pubgRoutes);

        // Apply base path
        app.use('/api/v1', router);

        app.listen(this.port, () => {
            console.log(`[server]: Server is running at http://localhost:${this.port}`);
            console.log(`[server]: API documentation available at http://localhost:${this.port}/api/v1/api-docs`);
        });
    }
}
